import { inject, Injectable } from '@angular/core';
import OpenAI from 'openai';
import { CompletedFormField } from '../completed-form-field';
import { FormField } from '../form-field';
import { ModelBackend } from '../model-backend';
import { OPEN_AI_CONFIG } from './open-ai-config';

@Injectable()
export class OpenAiBrowserBackend implements ModelBackend {
  private readonly config = inject(OPEN_AI_CONFIG);

  async getCompletions(fields: FormField[], userData: string): Promise<CompletedFormField[]> {
    const systemPrompt = this.getSystemPrompt(fields);
    const userPrompt = `USER_DATA: ${userData}`;
    const openAI = new OpenAI({
      baseURL: this.config.baseUrl,
      // The OpenAI SDK refuses to send requests without an API key set, so we are faking one here.
      apiKey: 'FAKE',
      dangerouslyAllowBrowser: true,
    });
    const response = await openAI.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { content: systemPrompt, role: 'system' },
        { content: userPrompt, role: 'user' },
      ],
      'max_tokens': 2000,
      "temperature": 0,
      "top_p": 1,
      "stop": [
        "END_RESPONSE",
      ],
      "presence_penalty": 0,
      "frequency_penalty": 0.1,
    });
    return (response.choices[0].message.content ?? '')
      .split('\n')
      .map(resultLine => {
        const [, key, value] = /\s*FIELD (.*?)\^\^\^+(.*)/g.exec(resultLine) ?? [];
        return { key, value };
      }).filter(({ value }) => value !== 'NO_DATA');
  }

  getSystemPrompt(fields: FormField[]): string {
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const fieldString = fields
      .map(({ key, description, type }) => `FIELD ${key}^^^The ${description ?? key} of type ${type}`)
      .join('\n');

    return `Current date: ${currentDate}

Each response line matches the following format:
FIELD identifier^^^value

Give a response with the following lines only, with values inferred from USER_DATA:

${fieldString}END_RESPONSE

Do not explain how the values were determined.
For fields without any corresponding information in USER_DATA, use value NO_DATA.
    `;
  }
}
