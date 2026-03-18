import { Component, inject, signal } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
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
import { SmartFormFiller } from '../../../../smart-form-filler/src/public-api';
import { AudioRecordingService } from '../audio-recording/audio-recording.service';

@Component({
  selector: 'app-form',
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
    FormsModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  providers: [provideNativeDateAdapter()],
})
export class FormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly formFiller = inject(SmartFormFiller);
  private readonly audioRecordingService = inject(AudioRecordingService);

  protected readonly inferencing = signal(false);
  protected readonly listening = signal(false);
  protected readonly text = signal(`Ich untersuche heute einen Ford Focus ST-Line, Modelljahr 2018.
Das Kennzeichen ist RA KL 8136.
Das Auto hat eine Laufleistung von 53105 Kilometern und fährt aktuell Sommerreifen.
Ich messe jetzt die Profiltiefe.
Vorne links 1,6 mm. Vorne rechts auch. Hinten rechts auch. Hinten links nur 1,3 mm.
In der Windschutzscheibe fällt mir ein Steinschlag auf, der sich im Sichtfeld befindet.`);
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

  private readonly fields = this.formFiller.getFormFieldsFromFormGroup(this.formGroup, {
    date: 'Datum der Inspektion (im Format yyyy-mm-dd)',
    make: 'Marke des inspizierten Autos',
    model: 'Modell des inspizierten Autos',
    licensePlate: 'Kennzeichen des inspizierten Autos',
    mileage: 'Kilometerstand (Einheit: km)',
    tireType: 'Reifentyp (Optionen: "Sommerreifen", "Winterreifen", "Allwetterreifen")',
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
  });

  protected async listenAndFill(): Promise<void> {
    if (!this.listening()) {
      this.listening.set(true);
      await this.audioRecordingService.startRecording();
      return;
    }

    this.listening.set(false);

    try {
      const blob = await this.audioRecordingService.stopRecording();
      const response = await firstValueFrom(this.audioRecordingService.transcribe(blob));
      this.text.set(response.text);
      this.fill(response.text);
    } catch (err) {
      console.error(err);
    }
  }

  protected async fill(text: string): Promise<void> {
    try {
      this.inferencing.set(true);

      const completions = await this.formFiller.getCompletions(this.fields, text);

      this.formGroup.reset();

      completions.forEach(({ key, value }) => this.formGroup.get(key)?.setValue(value));
    } catch (err) {
      console.error(err);
    }

    this.inferencing.set(false);
  }
}
