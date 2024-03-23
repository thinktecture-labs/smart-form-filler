import { InjectionToken } from '@angular/core';

export interface OpenAIConfig {
  /**
   * The base URL for the OpenAI SDK. If not specified, the official OpenAI endpoint is used.
   */
  baseURL?: string;

  /**
   * The model to use. If not specified, falls back to a default model.
   */
  model?: string;
}

export const OPEN_AI_CONFIG = new InjectionToken<OpenAIConfig>('OpenAI Config');

export const defaultConfig: OpenAIConfig & { model: string } = {
  model: 'gpt-3.5-turbo'
};
