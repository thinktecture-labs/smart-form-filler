import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CompletedFormField } from './completed-form-field';
import { FormField } from './form-field';
import { InferenceOptions } from './inference-options';
import { ModelBackend } from './model-backend';

@Injectable()
export class FormFiller extends ModelBackend {
  private readonly modelBackend = inject(ModelBackend);

  /**
   * Gets completions for the given form fields based on the user data.
   * @param fields The complete list of fields in this form.
   * @param userData The data the user wants to fill, in human language.
   * @param options Optional inference options.
   * @returns An array of completed form fields. Fields that could not be completed are not part of the array.
   */
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
