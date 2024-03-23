import { inject, Injectable } from '@angular/core';
import OpenAI from 'openai';
import { InferenceOptions } from '../inference-options';
import { JsonToolParams } from '../prompt-handler/json-tool-prompt-handler';
import { ModelBackend } from './model-backend';
import { defaultConfig, OPEN_AI_CONFIG } from './open-ai-config';

@Injectable()
export class OpenAIToolsBackend implements ModelBackend<JsonToolParams> {
  private readonly config = inject(OPEN_AI_CONFIG);
  private readonly openAI = new OpenAI({
    baseURL: this.config.baseURL,
    // The OpenAI SDK refuses to send requests without an API key set, so we are faking one here.
    apiKey: 'FAKE',
    dangerouslyAllowBrowser: true,
  });

  async generate(params: JsonToolParams, options?: InferenceOptions): Promise<string | null | undefined> {
    const runner = this.openAI.beta.chat.completions.runTools({
      ...params,
      model: options?.model ?? this.config.model ?? defaultConfig.model,
      temperature: options?.temperature ?? 0,
    });
    const response = await runner.finalChatCompletion();
    return response.choices[0].message.tool_calls?.[0]?.function.arguments;
  }
}
