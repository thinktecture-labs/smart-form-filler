/*
 * Public API Surface of smart-form-filler
 */

// Service
export { SmartFormFiller } from './lib/smart-form-filler';

// Models
export { FormField } from './lib/form-field';
export { CompletedFormField } from './lib/completed-form-field';
export { InferenceOptions } from './lib/inference-options';

// Provider functions
export {
    provideSmartFormFiller, withOpenAIBackend, withOpenAIToolsBackend, withWebLLMBackend, withBuiltInAiBackend,
} from './lib/providers';
