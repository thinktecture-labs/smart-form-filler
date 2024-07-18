// noinspection JSNonASCIINames,NonAsciiCharacters

import { EnvironmentProviders, makeEnvironmentProviders, Provider, Type } from '@angular/core';
import { ModelBackend } from './backends/model-backend';
import { OpenAIBackend } from './backends/open-ai-backend';
import { OPEN_AI_CONFIG, OpenAIConfig } from './backends/open-ai-config';
import { OpenAIToolsBackend } from './backends/open-ai-tools-backend';
import { PromptAPIBackend } from './backends/prompt-api-backend';
import { WebLLMBackend } from './backends/web-llm-backend';
import { WEB_LLM_CONFIG, WebLLMConfig } from './backends/web-llm-config';
import { JsonToolPromptHandler } from './prompt-handler/json-tool-prompt-handler';
import { PromptHandler } from './prompt-handler/prompt-handler';
import { TextPromptHandler } from './prompt-handler/text-prompt-handler';
import { SmartFormFiller } from './smart-form-filler';

interface SmartFormFillerFeature {
  ɵproviders: Provider[];
}

export function provideSmartFormFiller(
  ...features: SmartFormFillerFeature[]
): EnvironmentProviders {
  return makeEnvironmentProviders([
    SmartFormFiller,
    features.flatMap(feature => feature.ɵproviders),
  ]);
}

export function withOpenAIBackend(config: OpenAIConfig): SmartFormFillerFeature {
  return {
    ɵproviders: [
      { provide: OPEN_AI_CONFIG, useValue: config },
      { provide: ModelBackend, useClass: OpenAIBackend },
      { provide: PromptHandler, useClass: TextPromptHandler },
    ],
  };
}

export function withOpenAIToolsBackend(config: OpenAIConfig): SmartFormFillerFeature {
  return {
    ɵproviders: [
      { provide: OPEN_AI_CONFIG, useValue: config },
      { provide: ModelBackend, useClass: OpenAIToolsBackend },
      { provide: PromptHandler, useClass: JsonToolPromptHandler },
    ],
  };
}

export function withWebLLMBackend(config: WebLLMConfig = {}): SmartFormFillerFeature {
  return {
    ɵproviders: [
      { provide: WEB_LLM_CONFIG, useValue: config },
      { provide: ModelBackend, useClass: WebLLMBackend },
      { provide: PromptHandler, useClass: TextPromptHandler },
    ],
  };
}

export function withPromptAPIBackend(): SmartFormFillerFeature {
  return {
    ɵproviders: [
      { provide: ModelBackend, useClass: PromptAPIBackend },
      { provide: PromptHandler, useClass: TextPromptHandler },
    ],
  };
}

export function withCustomPromptHandler(
  handler: Type<PromptHandler<unknown>>,
): SmartFormFillerFeature {
  return {
    ɵproviders: [{ provide: PromptHandler, useClass: handler }],
  };
}
