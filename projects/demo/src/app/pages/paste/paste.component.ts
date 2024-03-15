import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormFiller } from '../../../../../smart-form-filler/src/public-api';

@Component({
  selector: 'app-paste',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './paste.component.html',
  styleUrl: './paste.component.css',
})
export class PasteComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly formFiller = inject(FormFiller);

  // TODO: Groups, arrays
  protected readonly formGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    phoneNumber: [''],
    addressLine1: [''],
    addressLine2: [''],
    city: [''],
    state: [''],
    zip: [''],
    country: [''],
  })

  async onPaste() {
    const userData = await navigator.clipboard.readText();
    const fields = this.formFiller.getFormFieldsFromFormGroup(this.formGroup, {
      firstName: 'First name',
      lastName: 'Last name',
      addressLine1: 'Line 1',
      addressLine2: 'Line 2'
    });
    const completions = await this.formFiller.getCompletions(fields, userData);
    completions.forEach(({ key, value }) => this.formGroup.get(key)?.setValue(value));
  }
}
