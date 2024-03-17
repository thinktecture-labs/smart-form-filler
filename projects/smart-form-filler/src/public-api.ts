/*
 * Public API Surface of smart-form-filler
 */

// Service
export { FormFiller } from './lib/form-filler.service';

// Models
export { FormField } from './lib/form-field';
export { CompletedFormField } from './lib/completed-form-field';
export { InferenceOptions } from './lib/inference-options';

// Model backend for exensibility
export { ModelBackend } from './lib/model-backend';

// Provider functions
export { provideFormFiller, withOpenAIToolsBackend } from './lib/providers';
