import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModelBackend } from './backends/model-backend';
import { CompletedFormField } from './completed-form-field';
import { FormField } from './form-field';
import { InferenceOptions } from './inference-options';
import { PromptHandler } from './prompt-handler/prompt-handler';

@Injectable()
export class SmartFormFiller {
  private readonly modelBackend = inject(ModelBackend);
  private readonly promptHandler = inject(PromptHandler);

  /**
   * Gets completions for the given form fields based on the user data.
   * @param fields The complete list of fields in this form.
   * @param userData The data the user wants to fill, in human language.
   * @param options Optional inference options.
   * @returns An array of completed form fields. Fields that could not be completed are not part of the array.
   */
  async getCompletions(fields: FormField[], userData: string, options?: InferenceOptions): Promise<CompletedFormField[]> {
    const params = this.promptHandler.getRequestParams(fields, userData);
    const response = await this.modelBackend.generate(params, options);
    if (response == null) {
      throw new Error('No valid response received.');
    }

    return this.promptHandler.parseResponse(response);
  }

  getFormFieldsFromFormGroup(formGroup: FormGroup, descriptions: { [key: string]: string } = {}): FormField[] {
    return Object.keys(formGroup.controls).map(key => ({
      key: key,
      type: typeof formGroup.get(key)!.value,
      description: descriptions[key],
    }));
  }
}
