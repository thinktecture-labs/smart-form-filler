import { Injectable } from '@angular/core';
import { CompletedFormField } from '../completed-form-field';
import { FormField } from '../form-field';
import { PromptHandler } from './prompt-handler';

export interface TextParams {
  messages: [
    { content: string; role: 'system' },
    { content: string; role: 'user' },
  ];
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
    const currentDate = new Date().toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const fieldString = fields
      .map(
        ({ key, description, type }) =>
          `FIELD ${key}^^^${description ?? key} vom Typ ${type}`,
      )
      .join('\n');

    return `Aktuelles Datum: ${currentDate}

Jede Antwortzeile hat das folgende Format:
FIELD identifier^^^value

Gib eine Antwort mit ausschließlich den folgenden Zeilen und Werten abgeleitet von USER_DATA:

${fieldString}END_RESPONSE

Erkläre nicht wie die Werte zustande kommen.
Für Felder ohne entsprechender Information in USER_DATA nutze den Wert NO_DATA.
Für Felder vom Typ number nutze nur Ziffern und optional einen Dezimalseparator.
    `;
  }

  generateUserMessage(userData: string): string {
    return `USER_DATA: ${userData}`;
  }

  override parseResponse(response: string): CompletedFormField[] {
    return response
      .split('\n')
      .map((resultLine) => {
        // For compatibility with OpenAI-compatible local models (which may behave differently than GPT-3.5), this regex
        // a) ignores any whitespace before the first FIELD, as local models may add it
        // b) accepts at least three circumflex (^) characters, as local models may return more
        // c) omits the END_RESPONSE stop word, as local models may return it
        const [, key, value] =
          /\s*FIELD\s(.*?)[\^\*\\]{3,}(.*?)(END\\?_RESPONSE)?$/g.exec(
            resultLine,
          ) ?? [];
        return { key, value };
      })
      .filter(
        ({ value }) =>
          value !== 'NO_DATA' && value !== 'NO\\_DATA' && value !== 'false',
      );
  }
}
