import { Injectable } from '@angular/core';
import { ChatModule } from '@mlc-ai/web-llm';
import { CompletedFormField } from '../completed-form-field';
import { FormField } from '../form-field';
import { InferenceOptions } from '../inference-options';
import { ModelBackend } from '../model-backend';

// TODO: Deduplicate prompt generation and response parsing
// TODO: Model list to WebLLM config

@Injectable()
export class WebLLMBackend implements ModelBackend {
  private chatModule?: ChatModule;

  async getCompletions(fields: FormField[], userData: string, options?: InferenceOptions): Promise<CompletedFormField[]> {
    if (!this.chatModule) {
      this.chatModule = new ChatModule();
      await this.chatModule.reload(options?.model ?? 'Mistral-7B-Instruct-v0.2-q4f16_1', undefined, {
        model_list: [{
          "model_url": "https://huggingface.co/mlc-ai/Mistral-7B-Instruct-v0.2-q4f16_1-MLC/resolve/main/",
          "local_id": "Mistral-7B-Instruct-v0.2-q4f16_1",
          "model_lib_url": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Mistral-7B-Instruct-v0.2/Mistral-7B-Instruct-v0.2-q4f16_1-sw4k_cs1k-webgpu.wasm",
          "vram_required_MB": 6079.02,
          "low_resource_required": false,
          "required_features": ["shader-f16"],
        }]
      });
    }

    const systemPrompt = this.getSystemPrompt(fields);
    const userPrompt = `USER_DATA: ${userData}`;

    const response = await this.chatModule.generate([
      { content: systemPrompt, role: 'user' },
      { content: userPrompt, role: 'user' },
    ], undefined, undefined, {
      stop: 'END_RESPONSE',
      temperature: options?.temperature,
    });
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

  getSystemPrompt(fields: FormField[]): string {
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
}
