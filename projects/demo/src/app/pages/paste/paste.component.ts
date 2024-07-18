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
  selector: 'app-paste',
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
  templateUrl: './paste.component.html',
  styleUrl: './paste.component.css',
  providers: [provideNativeDateAdapter()],
})
export class PasteComponent {
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
    date: [''],
    make: [''],
    model: [''],
    licensePlate: [''],
    mileage: [0],
    tireType: [''],
    treadDepthFrontLeft: [0],
    treadDepthFrontRight: [0],
    treadDepthRearLeft: [0],
    treadDepthRearRight: [0],
    stoneChipInWindshield: [false],
    stoneChipInWindshieldWithCracking: [false],
    stoneChipInWindshieldViewingArea: [false],
    notes: [''],
  });

  private readonly fields = this.formFiller.getFormFieldsFromFormGroup(
    this.formGroup,
    {
      date: 'Datum der Inspektion (im Format yyyy-mm-dd)',
      make: 'Marke des inspizierten Autos',
      model: 'Modell des inspizierten Autos',
      licensePlate: 'Kennzeichen des inspizierten Autos',
      mileage: 'Kilometerstand (Einheit: km)',
      tireType:
        'Reifentyp (Optionen: "Sommerreifen", "Winterreifen", "Allwetterreifen")',
      treadDepthFrontLeft: 'Reifenprofiltiefe vorne links (Einheit: mm)',
      treadDepthFrontRight: 'Reifenprofiltiefe vorne rechts (Einheit: mm)',
      treadDepthRearLeft: 'Reifenprofiltiefe hinten links (Einheit: mm)',
      treadDepthRearRight: 'Reifenprofiltiefe hinten rechts (Einheit: mm)',
      stoneChipInWindshield: 'Ob es einen Steinschlag in der Frontscheibe gibt',
      stoneChipInWindshieldWithCracking:
        'Ob sich um den Steinschlag in der Frontscheibe ein Riss bildet',
      stoneChipInWindshieldViewingArea:
        'Ob sich der Steinschlag in der Frontscheibe im Sichtbereich des Fahrers befindet',
      notes: 'Sonstige Anmerkungen',
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
