import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpeechRecognitionBackend } from './backends/speech-recognition-backend';

@Injectable()
export class AudioRecordingService {
  private readonly speechRecognitionBackend = inject(SpeechRecognitionBackend);
  private mediaRecorder: MediaRecorder | undefined;
  private audioChunks: Blob[] = [];
  private stream?: MediaStream;

  async startRecording(): Promise<void> {
    this.audioChunks = [];
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.addEventListener('dataavailable', (event) =>
        this.audioChunks.push(event.data),
      );
      this.mediaRecorder.addEventListener('error', () =>
        console.error('An unknown error occurred during recording'),
      );
      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing media devices: ', error);
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (this.mediaRecorder) {
        this.mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp4' });
          this.audioChunks = [];
          resolve(audioBlob);
        });
        this.mediaRecorder.stop();
        this.stream?.getTracks().forEach((track) => track.stop());
      }
    });
  }

  transcribe(audioBlob: Blob): Observable<{ text: string }> {
    return this.speechRecognitionBackend.transcribe(audioBlob);
  }
}
