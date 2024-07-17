import { Injectable } from '@angular/core';
import { InferenceOptions } from '../inference-options';
import { TextParams } from '../prompt-handler/text-prompt-handler';
import { ModelBackend } from './model-backend';

@Injectable()
export class PromptAPIBackend implements ModelBackend<TextParams> {
    async generate(params: TextParams, options?: InferenceOptions): Promise<string> {
        const defaults = await window.ai!.defaultTextSessionOptions();
        const session = await window.ai!.createTextSession({
            temperature: options?.temperature ?? defaults.temperature,
            topK: defaults.topK,
        });
        return await session.prompt(params.messages.map(message => message.content).join(' '));
    }
}

interface AI {
    canCreateTextSession(): Promise<AIModelAvailability>;
    createTextSession(options?: AITextSessionOptions): Promise<AITextSession>;
    defaultTextSessionOptions(): Promise<AITextSessionOptions>;
}

interface AITextSession {
    prompt(input: string): Promise<string>;
    promptStreaming(input: string): ReadableStream<string>;
    destroy(): void;
    clone(): AITextSession;
}

interface AITextSessionOptions {
    topK?: number;
    temperature?: number;
}

type AIModelAvailability = "readily" | "after-download" | "no";

declare global {
    interface Window {
        readonly ai?: AI;
    }
}
