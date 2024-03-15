import { InjectionToken } from '@angular/core';

export interface OpenAIConfig {
  baseUrl?: string;
}

export const OPEN_AI_CONFIG = new InjectionToken<OpenAIConfig>('OpenAI Config');
