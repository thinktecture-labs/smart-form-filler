import { Provider } from '@angular/core';
import { OpenAIBackend } from './backends/open-ai-backend';
import { OPEN_AI_CONFIG, OpenAIConfig } from './backends/open-ai-config';
import { ModelBackend } from './model-backend';

export function provideFormFiller(feature: Provider): Provider {
  return [feature];
}

// TODO: Feature
export function withOpenAIBackend(config: OpenAIConfig) {
  return [
    { provide: OPEN_AI_CONFIG, useValue: config },
    { provide: ModelBackend, useClass: OpenAIBackend },
  ];
}
