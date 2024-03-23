import { Injectable } from '@angular/core';
import type OpenAI from 'openai';
import type { JSONSchemaDefinition } from 'openai/lib/jsonschema';
import type { RunnableToolFunctionWithoutParse } from 'openai/lib/RunnableFunction';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { CompletedFormField } from '../completed-form-field';
import { FormField } from '../form-field';
import { PromptHandler } from './prompt-handler';

export interface JsonToolParams {
  messages: Array<ChatCompletionMessageParam>;
  tools: Array<RunnableToolFunctionWithoutParse>;
  tool_choice: OpenAI.ChatCompletionNamedToolChoice;
}

@Injectable()
export class JsonToolPromptHandler extends PromptHandler<JsonToolParams> {
  override getRequestParams(fields: FormField[], userData: string): JsonToolParams {
    return {
      messages: [
        { content: this.generateSystemMessage(), role: 'system' },
        { content: this.generateUserMessage(userData), role: 'user' },
      ],
      tools: [{
        type: 'function',
        function: {
          name: 'to-form-json',
          description: 'Get the form data back from the LLM based on the properties of the form.',
          parameters: {
            type: 'object',
            properties: this.getResponseJsonSchema(fields),
          },
          function: () => undefined, // no-op function for our use case
        },
      }],
      tool_choice: { type: 'function', function: { name: 'to-form-json' } },
    };
  }

  private generateSystemMessage(): string {
    // TODO: Descriptions are not added yet!
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

  private generateUserMessage(userData: string): string {
    return userData;
  }

  private getResponseJsonSchema(fields: FormField[]): { [key: string]: JSONSchemaDefinition } {
    return fields.reduce((prev, { key, type }) => {
      prev[key] = { type };
      return prev;
    }, {} as { [key: string]: { type: string } })
  }

  override parseResponse(response: string): CompletedFormField[] {
    return Object.entries(JSON.parse(response))
      .map(([key, value]) => ({ key, value }));
  }
}
