import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { SpeechRecognitionBackend } from './speech-recognition-backend';

export const TRANSCRIPTION_URL = new InjectionToken<string>(
    'Transcription URL',
);

@Injectable()
export class OpenAIWhisperBackend implements SpeechRecognitionBackend {
    private readonly httpClient = inject(HttpClient);
    private readonly transcriptionUrl = inject(TRANSCRIPTION_URL);

    transcribe(audioBlob: Blob): Observable<{ text: string; }> {
        const formData = new FormData();
        formData.append('model', 'whisper-1');
        formData.append('file', audioBlob);

        return this.httpClient.post<{ text: string }>(
            this.transcriptionUrl,
            formData,
        );
    }
}
