// noinspection JSNonASCIINames,NonAsciiCharacters

import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { AudioRecordingService } from './audio-recording.service';
import { OpenAIWhisperBackend, TRANSCRIPTION_URL } from './backends/open-ai-whisper-backend';
import { SpeechRecognitionBackend } from './backends/speech-recognition-backend';
import { WhisperWebBackend } from './backends/whisper-web-backend';

interface AudioRecordingFeature {
    ɵproviders: Provider[];
}

export function provideAudioRecording(
    feature: AudioRecordingFeature,
): EnvironmentProviders {
    return makeEnvironmentProviders([AudioRecordingService, feature.ɵproviders]);
}

export function withOpenAIWhisperBackend(transcriptionUrl: string): AudioRecordingFeature {
    return {
        ɵproviders: [
            { provide: TRANSCRIPTION_URL, useValue: transcriptionUrl },
            { provide: SpeechRecognitionBackend, useClass: OpenAIWhisperBackend },
        ],
    };
}

// TODO: Offer options (e.g., language, exact model, etc.)
export function withWhisperWebBackend(): AudioRecordingFeature {
    return {
        ɵproviders: [
            { provide: SpeechRecognitionBackend, useClass: WhisperWebBackend },
        ],
    };
}
