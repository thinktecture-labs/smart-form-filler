import { Injectable } from '@angular/core';
import { CompletedFormField } from '../completed-form-field';
import { FormField } from '../form-field';
import { PromptHandler } from './prompt-handler';

export interface TextParams {
  messages: [{ content: string, role: 'system' }, { content: string, role: 'user' }];
  stop: string;
}

@Injectable()
export class TextPromptHandler extends PromptHandler<TextParams> {
  override getRequestParams(fields: FormField[], userData: string): TextParams {
    return {
      messages: [
        { content: this.generateSystemMessage(fields), role: 'system' },
        { content: this.generateUserMessage(userData), role: 'user' },
      ],
      stop: 'END_RESPONSE',
    };
  }

  generateSystemMessage(fields: FormField[]): string {
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  generateUserMessage(userData: string): string {
    return `USER_DATA: ${userData}`;
  }

  override parseResponse(response: string): CompletedFormField[] {
    return response
      .split('\n')
      .map(resultLine => {
        // For compatibility with OpenAI-compatible local models (which may behave differently than GPT-3.5), this regex
        // a) ignores any whitespace before the first FIELD, as local models may add it
        // b) accepts at least three circumflex (^) characters, as local models may return more
        // c) omits the END_RESPONSE stop word, as local models may return it
        const [, key, value] = /\s*FIELD\s(.*?)\^{3,}(.*?)(END_RESPONSE)?$/g.exec(resultLine) ?? [];
        return { key, value };
      }).filter(({ value }) => value !== 'NO_DATA');
  }
}
