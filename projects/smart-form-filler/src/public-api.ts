/*
 * Public API Surface of smart-form-filler
 */

// Service
export { FormFiller } from './lib/form-filler';

// Models
export { FormField } from './lib/form-field';
export { CompletedFormField } from './lib/completed-form-field';
export { InferenceOptions } from './lib/inference-options';

// Model backend for extensibility
export { ModelBackend } from './lib/model-backend';

// Provider functions
export { provideFormFiller, withOpenAIBackend, withOpenAIToolsBackend, withWebLLMBackend } from './lib/providers';
