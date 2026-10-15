import { HttpErrorResponse } from '@angular/common/http';
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
  protected readonly error = signal('');
  protected readonly text = signal(
    'Christian Liebel hält am 21. Oktober einen Workshop zur Prompt-API und wie damit smartere Web-Apps mit Angular und lokaler KI gebaut werden können. Der Workshop ist für fortgeschrittene Entwickler.',
  );
  protected readonly formGroup = this.fb.group({
    date: [''],
    speaker: [''],
    title: [''],
    description: [''],
    tag: [''],
    level: [''],
  });

  private readonly fields = this.formFiller.getFormFieldsFromFormGroup(this.formGroup, {
    date: 'Datum des Vortrags (im Format yyyy-mm-dd)',
    speaker: 'Name des Vortragenden',
    title: 'Kurzer und prägnanter Titel des Vortrags',
    description: 'Ausführliche Beschreibung des Vortrags',
    tag: 'Tag für den Vortrag (Option: "HTMLCSS", "Angular", "GenAI", "Vue", "NodeJS")',
    level:
      'Schwierigkeit bzw. Zielgruppe des Vortrags (Option: "beginner", "intermediate", "advanced")',
  });

  async listenAndFill(): Promise<void> {
    this.error.set('');

    if (!this.listening()) {
      try {
        await this.audioRecordingService.startRecording();
        this.listening.set(true);
      } catch (err) {
        console.error(err);
        this.error.set(`Aufnahme konnte nicht gestartet werden: ${describeError(err)}`);
      }
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
      this.error.set(`Spracherkennung fehlgeschlagen: ${describeError(err)}`);
    }
  }

  async fill(text: string): Promise<void> {
    this.error.set('');
    this.inferencing.set(true);

    try {
      const completions = await this.formFiller.getCompletions(this.fields, text);

      this.formGroup.reset();

      completions.forEach(({ key, value }) => this.formGroup.get(key)?.setValue(value));
    } catch (err) {
      console.error(err);
      this.error.set(`Ausfüllen fehlgeschlagen: ${describeError(err)}`);
    }

    this.inferencing.set(false);
  }
}

function describeError(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    const detail = err.error?.error?.message ?? err.error?.message ?? err.message;
    return `HTTP ${err.status} – ${detail}`;
  }
  if (err instanceof DOMException && err.name === 'NotAllowedError') {
    return 'Zugriff auf das Mikrofon wurde verweigert.';
  }
  return err instanceof Error ? err.message : String(err);
}
