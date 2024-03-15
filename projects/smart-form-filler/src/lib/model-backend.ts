import { CompletedFormField } from './completed-form-field';
import { FormField } from './form-field';
import { InferenceOptions } from './inference-options';

export abstract class ModelBackend {
  abstract getCompletions(fields: FormField[], userData: string, options?: InferenceOptions): Promise<CompletedFormField[]>;
}
