import { Provider } from '@angular/core';
import { OpenAIBackend } from './backends/open-ai-backend';
import { OPEN_AI_CONFIG, OpenAIConfig } from './backends/open-ai-config';
import { OpenAIToolsBackend } from './backends/open-ai-tools-backend.service';
import { WebLLMBackend } from './backends/web-llm-backend';
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

export function withOpenAIToolsBackend(config: OpenAIConfig) {
  return [
    { provide: OPEN_AI_CONFIG, useValue: config },
    { provide: ModelBackend, useClass: OpenAIToolsBackend },
  ];
}

export function withWebLLMBackend() {
  return { provide: ModelBackend, useClass: WebLLMBackend };
}
