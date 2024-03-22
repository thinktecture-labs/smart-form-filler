// noinspection JSNonASCIINames,NonAsciiCharacters

import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { OpenAIBackend } from './backends/open-ai-backend';
import { OPEN_AI_CONFIG, OpenAIConfig } from './backends/open-ai-config';
import { OpenAIToolsBackend } from './backends/open-ai-tools-backend.service';
import { WebLLMBackend } from './backends/web-llm-backend';
import { FormFiller } from './form-filler';
import { ModelBackend } from './model-backend';

interface FormFillerFeature {
  ɵproviders: Provider[];
}

export function provideFormFiller(feature: FormFillerFeature): EnvironmentProviders {
  return makeEnvironmentProviders([
    FormFiller,
    feature.ɵproviders,
  ]);
}

export function withOpenAIBackend(config: OpenAIConfig): FormFillerFeature {
  return {
    ɵproviders: [
      { provide: OPEN_AI_CONFIG, useValue: config },
      { provide: ModelBackend, useClass: OpenAIBackend },
    ],
  };
}

export function withOpenAIToolsBackend(config: OpenAIConfig): FormFillerFeature {
  return {
    ɵproviders: [
      { provide: OPEN_AI_CONFIG, useValue: config },
      { provide: ModelBackend, useClass: OpenAIToolsBackend },
    ],
  };
}

export function withWebLLMBackend(): FormFillerFeature {
  return {
    ɵproviders: [
      { provide: ModelBackend, useClass: WebLLMBackend },
    ],
  };
}
