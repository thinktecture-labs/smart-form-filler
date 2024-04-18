import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AudioRecordingService {
  private readonly httpClient = inject(HttpClient);
  private mediaRecorder: MediaRecorder | undefined;
  private audioChunks: Blob[] = [];
  private stream?: MediaStream;

  async startRecording(): Promise<void> {
    this.audioChunks = [];
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };
      this.mediaRecorder.start(1000);
    } catch (error) {
      console.error('Error accessing media devices: ', error);
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (this.mediaRecorder) {
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp4' });
          this.audioChunks = [];
          resolve(audioBlob);
        };
        this.mediaRecorder.stop();
        this.stream?.getTracks().forEach((track) => track.stop());
      }
    });
  }

  transcribe(audioBlob: Blob): Observable<{ text: string }> {
    const formData = new FormData();
    formData.append('model', 'whisper-1');
    formData.append('file', audioBlob);

    return this.httpClient.post<{ text: string }>(
      `${location.origin}/api/transcription`,
      formData,
    );
  }
}