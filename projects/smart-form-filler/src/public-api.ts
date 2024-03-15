/*
 * Public API Surface of smart-form-filler
 */

// Service
export { FormFiller } from './lib/form-filler.service';

// Models
export { FormField } from './lib/form-field';
export { CompletedFormField } from './lib/completed-form-field';

// Model backend for exensibility
export { ModelBackend } from './lib/model-backend';

// Provider functions
export { provideFormFiller, withOpenAIBackend } from './lib/providers';
