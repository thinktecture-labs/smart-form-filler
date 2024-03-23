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

export const defaultConfig: Required<WebLLMConfig> = {
  model: 'Mistral-7B-Instruct-v0.2-q4f16_1',
  modelList: [{
    'model_url': 'https://huggingface.co/mlc-ai/Mistral-7B-Instruct-v0.2-q4f16_1-MLC/resolve/main/',
    'local_id': 'Mistral-7B-Instruct-v0.2-q4f16_1',
    'model_lib_url': "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Mistral-7B-Instruct-v0.2/Mistral-7B-Instruct-v0.2-q4f16_1-sw4k_cs1k-webgpu.wasm",
    'vram_required_MB': 6079.02,
    'low_resource_required': false,
    'required_features': ['shader-f16'],
  }]
};
