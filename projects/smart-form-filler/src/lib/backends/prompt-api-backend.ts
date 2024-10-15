import { Injectable } from '@angular/core';
import { InferenceOptions } from '../inference-options';
import { TextParams } from '../prompt-handler/text-prompt-handler';
import { ModelBackend } from './model-backend';

@Injectable()
export class PromptAPIBackend implements ModelBackend<TextParams> {
    async generate(params: TextParams, options?: InferenceOptions): Promise<string> {
        const defaults = await window.ai.languageModel.capabilities();
        const session = await window.ai.languageModel.create({
            temperature: options?.temperature ?? defaults.defaultTemperature ?? undefined,
            topK: defaults.defaultTopK ?? undefined,
        });
        return await session.prompt(params.messages.map(message => message.content).join(' '));
    }
}
