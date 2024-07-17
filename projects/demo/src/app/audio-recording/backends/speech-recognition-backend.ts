import { Observable } from 'rxjs';

export abstract class SpeechRecognitionBackend {
    abstract transcribe(audioBlob: Blob): Observable<{ text: string }>;
}
