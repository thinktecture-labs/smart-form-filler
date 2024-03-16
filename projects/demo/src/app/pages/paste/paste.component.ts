import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
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
    MatIcon,
  ],
  templateUrl: './paste.component.html',
  styleUrl: './paste.component.css',
})
export class PasteComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly formFiller = inject(FormFiller);

  protected readonly inferenceInProgress = signal(false);
  protected readonly formGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    phoneNumber: [''],
    company: [''],
    addressLine1: [''],
    addressLine2: [''],
    city: [''],
    state: [''],
    zip: [''],
    country: [''],
  })

  async onPaste() {
    this.inferenceInProgress.set(true);
    const userData = await navigator.clipboard.readText();
    const fields = this.formFiller.getFormFieldsFromFormGroup(this.formGroup, {
      firstName: 'First name',
      lastName: 'Last name',
      addressLine1: 'Line 1',
      addressLine2: 'Line 2'
    });

    try {
      const completions = await this.formFiller.getCompletions(fields, userData);
      this.formGroup.reset();
      completions.forEach(({ key, value }) => this.formGroup.get(key)?.setValue(value));
    } catch (err) {
      console.error(err);
    }

    this.inferenceInProgress.set(false);
  }
}
