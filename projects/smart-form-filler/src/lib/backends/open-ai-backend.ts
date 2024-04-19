import { inject, Injectable } from '@angular/core';
import OpenAI from 'openai';
import { InferenceOptions } from '../inference-options';
import { TextParams } from '../prompt-handler/text-prompt-handler';
import { ModelBackend } from './model-backend';
import { defaultConfig, OPEN_AI_CONFIG } from './open-ai-config';

@Injectable()
export class OpenAIBackend implements ModelBackend<TextParams> {
  private readonly config = inject(OPEN_AI_CONFIG);
  private readonly openAI = new OpenAI({
    baseURL: this.config.baseURL,
    // The OpenAI SDK refuses to send requests without an API key set, so we are faking one here.
    apiKey: 'FAKE',
    dangerouslyAllowBrowser: true,
  });

  async generate(
    params: TextParams,
    options?: InferenceOptions,
  ): Promise<string | null | undefined> {
    let openAI = this.openAI;
    if (options?.baseURL !== undefined) {
      openAI = new OpenAI({
        baseURL: options.baseURL,
        apiKey: 'FAKE',
        dangerouslyAllowBrowser: true,
      });
    }

    const response = await openAI.chat.completions.create({
      ...params,
      model: options?.model ?? this.config.model ?? defaultConfig.model,
      temperature: options?.temperature ?? 0,
    });
    return response.choices[0]?.message.content;
  }
}
