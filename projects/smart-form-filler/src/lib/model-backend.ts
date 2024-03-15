import { CompletedFormField } from './completed-form-field';
import { FormField } from './form-field';

export abstract class ModelBackend {
  abstract getCompletions(fields: FormField[], userData: string): Promise<CompletedFormField[]>;
}
