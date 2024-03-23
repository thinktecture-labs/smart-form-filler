import { Injectable } from '@angular/core';
import { CompletedFormField } from '../completed-form-field';
import { FormField } from '../form-field';

@Injectable()
export abstract class PromptHandler<TParams> {
  abstract getRequestParams(fields: FormField[], userData: string): TParams;

  abstract parseResponse(response: string): CompletedFormField[];
}
