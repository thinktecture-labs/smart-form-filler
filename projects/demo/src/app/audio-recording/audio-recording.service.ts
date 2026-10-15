import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';

interface TranscriptionConfig {
  baseURL: string;
  model: string;
}

export const TRANSCRIPTION_CONFIG = new InjectionToken<TranscriptionConfig>('Transcription config');

@Injectable({ providedIn: 'root' })
export class AudioRecordingService {
  private readonly httpClient = inject(HttpClient);
  private readonly transcriptionConfig = inject(TRANSCRIPTION_CONFIG);
  private mediaRecorder: MediaRecorder | undefined;
  private audioChunks: Blob[] = [];
  private stream?: MediaStream;

  async startRecording(): Promise<void> {
    this.audioChunks = [];
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(this.stream);
    this.mediaRecorder.addEventListener('dataavailable', event =>
      this.audioChunks.push(event.data),
    );
    this.mediaRecorder.start();
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const recorder = this.mediaRecorder;
      if (!recorder) {
        reject(new Error('Es läuft keine Aufnahme.'));
        return;
      }

      recorder.addEventListener('stop', () => {
        // The browser chooses the container (Chrome: WebM/Opus, Safari: MP4) – keep its type.
        const audioBlob = new Blob(this.audioChunks, { type: recorder.mimeType || 'audio/webm' });
        this.audioChunks = [];
        this.mediaRecorder = undefined;
        resolve(audioBlob);
      });
      recorder.stop();
      this.stream?.getTracks().forEach(track => track.stop());
    });
  }

  transcribe(audioBlob: Blob): Observable<{ text: string }> {
    const formData = new FormData();
    formData.append('model', this.transcriptionConfig.model);
    // OpenAI-compatible endpoints need a file extension; OVH answers 500 for a bare "blob".
    formData.append('file', audioBlob, `recording.${fileExtension(audioBlob.type)}`);

    return this.httpClient.post<{ text: string }>(this.transcriptionConfig.baseURL, formData);
  }
}

function fileExtension(mimeType: string): string {
  if (mimeType.includes('mp4')) return 'mp4';
  if (mimeType.includes('ogg')) return 'ogg';
  return 'webm';
}
