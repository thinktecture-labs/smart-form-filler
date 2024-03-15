import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-paste',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    JsonPipe,
  ],
  templateUrl: './paste.component.html',
  styleUrl: './paste.component.css'
})
export class PasteComponent {
  private readonly fb = inject(NonNullableFormBuilder);

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
}
