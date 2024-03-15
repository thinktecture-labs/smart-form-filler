import { InjectionToken } from '@angular/core';

export interface OpenAIConfig {
  /**
   * The base URL for the OpenAI SDK. If not specified, the official OpenAI endpoint is used.
   */
  baseURL?: string;
}

export const OPEN_AI_CONFIG = new InjectionToken<OpenAIConfig>('OpenAI Config');
