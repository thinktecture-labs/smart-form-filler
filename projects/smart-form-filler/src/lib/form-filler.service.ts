import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CompletedFormField } from './completed-form-field';
import { FormField } from './form-field';
import { InferenceOptions } from './inference-options';
import { ModelBackend } from './model-backend';

@Injectable({ providedIn: 'root' })
export class FormFiller extends ModelBackend {
  private readonly modelBackend = inject(ModelBackend);

  getCompletions(fields: FormField[], userData: string, options?: InferenceOptions): Promise<CompletedFormField[]> {
    return this.modelBackend.getCompletions(fields, userData, options);
  }

  getFormFieldsFromFormGroup(formGroup: FormGroup, descriptions: { [key: string]: string } = {}): FormField[] {
    return Object.keys(formGroup.controls).map(key => ({
      key: key,
      type: typeof formGroup.get(key)!.value,
      description: descriptions[key],
    }));
  }
}
