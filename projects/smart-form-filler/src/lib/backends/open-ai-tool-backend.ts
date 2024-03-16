import { inject, Injectable } from '@angular/core';
import OpenAI from 'openai';
import { CompletedFormField } from '../completed-form-field';
import { FormField } from '../form-field';
import { InferenceOptions } from '../inference-options';
import { ModelBackend } from '../model-backend';
import { OPEN_AI_CONFIG } from './open-ai-config';

@Injectable()
export class OpenAIToolBackend implements ModelBackend {
  private readonly config = inject(OPEN_AI_CONFIG);

  async getCompletions(fields: FormField[], userData: string, options?: InferenceOptions): Promise<CompletedFormField[]> {
    const systemPrompt = this.getSystemPrompt(fields);
    const userPrompt = `USER_DATA: ${userData}`;
    const openAI = new OpenAI({
      baseURL: this.config.baseURL,
      // The OpenAI SDK refuses to send requests without an API key set, so we are faking one here.
      apiKey: 'FAKE',
      dangerouslyAllowBrowser: true,
    });
    const runner = openAI.beta.chat.completions.runTools({
      model: options?.model ?? this.config.model ?? 'gpt-3.5-turbo',
      messages: [
        { content: systemPrompt, role: 'system' },
        { content: userPrompt, role: 'user' },
      ],
      temperature: options?.temperature ?? 0,
      stop: [
        "END_RESPONSE",
      ],
      tools: [{
        type: 'function',
        function: {
          name: 'to-form-json',
          description: 'convert the response to JSON',
          parameters: {
            type: 'object',
            properties: fields.reduce((prev, { key, type }) => {
              prev[key] = { type };
              return prev;
            }, {} as { [key: string]: { type: string } }),
          },
          function: (obj: string) => JSON.parse(obj),
        }
        // TODO: Type??
      } as any],
      tool_choice: { type: 'function', function: { name: 'to-form-json' } }
    });
    const response = await runner.finalChatCompletion();
    const json = response.choices[0].message.tool_calls![0].function.arguments ?? "{}";
    const obj = JSON.parse(json);
    return Object.keys(obj)
      .filter(key => obj[key] !== 'NO_DATA')
      .map(key => ({ key, value: obj[key] }));
  }

  getSystemPrompt(fields: FormField[]): string {
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const schema = fields.reduce((prev, {key, description}) => {
      prev[key] = description ?? key;
      return prev;
    }, {} as { [key: string]: string });

    return `Current date: ${currentDate}

Give a response with the following JSON only, with values inferred from the user's message:

${JSON.stringify(schema)}END_RESPONSE

Do not explain how the values were determined.
For fields without any corresponding information in the user's message, use value NO_DATA.
    `;
  }
}
