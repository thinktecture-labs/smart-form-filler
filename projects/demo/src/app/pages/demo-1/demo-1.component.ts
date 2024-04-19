import { Component, inject, model, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { firstValueFrom } from 'rxjs';
import { SmartFormFiller } from '../../../../../smart-form-filler/src/public-api';
import { AudioRecordingService } from '../../audio-recording/audio-recording.service';

@Component({
  selector: 'app-demo-1',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
  templateUrl: './demo-1.component.html',
  styleUrl: './demo-1.component.css',
  providers: [provideNativeDateAdapter()],
})
export class Demo1Component {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly formFiller = inject(SmartFormFiller);
  private readonly audioRecordingService = inject(AudioRecordingService);

  protected readonly inferencing = signal(false);
  protected readonly listening = signal(false);
  protected readonly transcribedText = signal('');
  protected readonly models = [
    {
      label: 'Mixtral 7B (Groq)',
      endpoint: 'groq/openai/v1',
      model: 'mixtral-8x7b-32768',
    },
    {
      label: 'Mistral Small',
      endpoint: 'mistral/v1',
      model: 'mistral-small-latest',
    },
  ];
  protected readonly model = model(0);
  protected readonly formGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    company: [''],
    phoneNumber: [''],
    addressLine1: [''],
    addressLine2: [''],
    city: [''],
    state: [''],
    zip: [''],
    country: [''],
  });

  private readonly fields = this.formFiller.getFormFieldsFromFormGroup(
    this.formGroup,
    {
      firstName: 'Vorname',
      lastName: 'Nachname',
      company: 'Name der Firma, nicht Name der Gruppe oder der Abteilung',
      phoneNumber: 'Telefonnummer mit Ländercode',
      addressLine1: 'Addresszeile 1',
      addressLine2: 'Addresszeile 2',
      city: 'Stadt',
      state: 'Bundesland oder Bundesstaat',
      zip: 'Postleitzahl',
      country: 'Land',
    },
  );

  async paste(): Promise<void> {
    this.inferencing.set(true);

    const userData = await navigator.clipboard.readText();
    await this.fillForm(userData);

    this.inferencing.set(false);
  }

  async listen(): Promise<void> {
    if (!this.listening()) {
      this.listening.set(true);
      await this.audioRecordingService.startRecording();
      return;
    }

    this.listening.set(false);
    this.inferencing.set(true);

    try {
      const blob = await this.audioRecordingService.stopRecording();
      const response = await firstValueFrom(
        this.audioRecordingService.transcribe(blob),
      );
      this.transcribedText.set(response.text);
      this.fillForm(response.text);
    } catch (err) {
      console.error(err);
    } finally {
      this.inferencing.set(false);
    }
  }

  private async fillForm(userData: string): Promise<void> {
    try {
      const model = this.models[this.model()];
      const completions = await this.formFiller.getCompletions(
        this.fields,
        userData,
        {
          baseURL: `${location.origin}/api/${model.endpoint}`,
          model: model.model,
        },
      );

      this.formGroup.reset();

      completions.forEach(({ key, value }) =>
        this.formGroup.get(key)?.setValue(value),
      );
    } catch (err) {
      console.error(err);
    }
  }
}
