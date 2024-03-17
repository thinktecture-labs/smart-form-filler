import { inject, Injectable } from '@angular/core';
import OpenAI from 'openai';
import { CompletedFormField } from '../completed-form-field';
import { FormField } from '../form-field';
import { InferenceOptions } from '../inference-options';
import { ModelBackend } from '../model-backend';
import { OPEN_AI_CONFIG } from './open-ai-config';

@Injectable()
export class OpenAIToolsBackend implements ModelBackend {
  private readonly config = inject(OPEN_AI_CONFIG);

  async getCompletions(fields: FormField[], userData: string, options?: InferenceOptions): Promise<CompletedFormField[]> {
    const systemPrompt = this.getSystemPrompt();
    const userPrompt = userData;
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
      tools: [{
        type: 'function',
        function: {
          name: 'to-form-json',
          description: 'Get the form data back from the LLM based on the properties of the form.',
          parameters: {
            type: 'object',
            properties: fields.reduce((prev, { key, type }) => {
              prev[key] = { type };
              return prev;
            }, {} as { [key: string]: { type: string } }),
          },
          function: (obj: string) => obj // no-op function for our use case
        }
        // TODO: Type??
      } as any],
      tool_choice: { type: 'function', function: { name: 'to-form-json' } }
    });
    const response = await runner.finalChatCompletion();
    const json = response.choices[0].message.tool_calls![0].function.arguments ?? "{}";
    const obj = JSON.parse(json);
    return Object.keys(obj)
      .map(key => ({ key, value: obj[key] }));
  }

  getSystemPrompt(): string {
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `Current date: ${currentDate}
Give a response with the JSON only based on the tool, with values inferred from the user's message.
Do not explain how the values were determined.`;
  }
}
