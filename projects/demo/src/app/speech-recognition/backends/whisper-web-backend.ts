import { Injectable } from '@angular/core';
import { filter, first, from, fromEvent, map, Observable, switchMap, tap } from 'rxjs';
import { SpeechRecognitionBackend } from './speech-recognition-backend';

@Injectable()
export class WhisperWebBackend implements SpeechRecognitionBackend {
    private readonly worker = new Worker(new URL('./whisper.worker', import.meta.url));
    private readonly message$ = fromEvent<MessageEvent<any>>(this.worker, 'message');

    transcribe(audioBlob: Blob): Observable<{ text: string }> {
        return from(this.getAudioBufferFromBlob(audioBlob)).pipe(
            map(audioBuffer => this.extractSingleChannel(audioBuffer)),
            tap(audio => this.worker.postMessage({
                audio,
                model: 'Xenova/whisper-base',
                multilingual: true,
                quantized: false,
                subtask: null,
                language: null,
            })),
            switchMap(() => this.message$),
            filter((message: MessageEvent<any>) => message.data.status === 'complete'),
            map(message => ({ text: message.data.data.text })),
            first(),
        );
    }

    private async getAudioBufferFromBlob(audioBlob: Blob): Promise<AudioBuffer> {
        const audioContext = new AudioContext({ sampleRate: 16000 });
        const arrayBuffer = await audioBlob.arrayBuffer();
        return await audioContext.decodeAudioData(arrayBuffer);
    }

    private extractSingleChannel(audioBuffer: AudioBuffer): Float32Array {
        if (audioBuffer.numberOfChannels === 2) {
            const SCALING_FACTOR = Math.sqrt(2);

            const left = audioBuffer.getChannelData(0);
            const right = audioBuffer.getChannelData(1);

            const audio = new Float32Array(left.length);
            for (let i = 0; i < audioBuffer.length; ++i) {
                audio[i] = SCALING_FACTOR * (left[i] + right[i]) / 2;
            }
            return audio;
        } else {
            // If the audio is not stereo, we can just use the first channel:
            return audioBuffer.getChannelData(0);
        }
    }
}
