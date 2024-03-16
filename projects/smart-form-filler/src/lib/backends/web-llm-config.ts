import { InjectionToken } from '@angular/core';

export interface WebLLMConfig {
  /**
   * The model to use. If not specified, falls back to a default model.
   */
  model?: string;

  /**
   * The model list to use. If not specified, uses a default selection.
   */
  modelList?: {
    'model_url': string,
    'local_id': string,
    'model_lib_url': string,
    'vram_required_MB': number,
    'low_resource_required': boolean,
    'required_features': string[],
  }[]
}

export const WEB_LLM_CONFIG = new InjectionToken<WebLLMConfig>('WebLLM Config');
