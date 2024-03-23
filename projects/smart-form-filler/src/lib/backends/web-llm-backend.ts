import { inject, Injectable } from '@angular/core';
import { ChatModule } from '@mlc-ai/web-llm';
import { InferenceOptions } from '../inference-options';
import { TextParams } from '../prompt-handler/text-prompt-handler';
import { ModelBackend } from './model-backend';
import { defaultConfig, WEB_LLM_CONFIG } from './web-llm-config';

@Injectable()
export class WebLLMBackend implements ModelBackend<TextParams> {
  private readonly config = inject(WEB_LLM_CONFIG);
  private readonly chatModule = new ChatModule();
  private loadedModel?: string;

  constructor() {
    this.resetModel();
  }

  async generate({ messages, stop }: TextParams, options?: InferenceOptions): Promise<string> {
    await this.resetModel(options);

    return this.chatModule.generate(messages, undefined, undefined, {
      temperature: options?.temperature,
      stop,
    });
  }

  private async resetModel(options?: InferenceOptions): Promise<void> {
    // TODO: Fix re-entry if reloading is underway
    const targetModel = options?.model ?? this.config.model ?? defaultConfig.model;
    if (this.loadedModel !== targetModel) {
      await this.chatModule.reload(
        targetModel,
        undefined,
        {
          model_list: this.config.modelList ?? defaultConfig.modelList,
        },
      );
      this.loadedModel = targetModel;
    } else {
      await this.chatModule.resetChat();
    }
  }
}
