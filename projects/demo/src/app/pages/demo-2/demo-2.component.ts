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
  selector: 'app-demo-2',
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
  templateUrl: './demo-2.component.html',
  styleUrl: './demo-2.component.css',
  providers: [provideNativeDateAdapter()],
})
export class Demo2Component {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly formFiller = inject(SmartFormFiller);
  private readonly audioRecordingService = inject(AudioRecordingService);

  protected readonly inferencing = signal(false);
  protected readonly listening = signal(false);
  protected readonly transcribedText = signal('');
  protected readonly models = [
    {
      label: 'gpt 4.1 mini (Open AI)',
      endpoint: 'openai/v1',
      model: 'gpt-4.1-mini',
    },
    {
      label: 'gpt 4.1 nano (Open AI)',
      endpoint: 'openai/v1',
      model: 'gpt-4.1-nano',
    }
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
      date: 'Date of investigation (in yyyy-mm-dd)',
      make: 'Make of car under investigation',
      model: 'Model of car under investigation',
      licensePlate: 'License plate of car under investigation',
      mileage: 'Mileage (unit: km)',
      tireType:
        'Type of tire (options: "Summer tires", "Winter tires", "All-weather tires")',
      treadDepthFrontLeft: 'Tread depth front left (unit: mm)',
      treadDepthFrontRight: 'Tread depth front right (unit: mm)',
      treadDepthRearLeft: 'Tread depth rear left (unit: mm)',
      treadDepthRearRight: 'Tread depth rear right (unit: mm)',
      stoneChipInWindshield: 'Whether there is a stone chip in the windshield',
      stoneChipInWindshieldWithCracking:
        'Whether there is a crack in the windshield around the stone chip',
      stoneChipInWindshieldViewingArea:
        'Whether the stone chip in the windshield is in the viewing area',
      notes: 'Notes',
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
