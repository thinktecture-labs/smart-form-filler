import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideSmartFormFiller,
  withOpenAIBackend,
} from '../../../smart-form-filler/src/public-api';
import { TRANSCRIPTION_CONFIG } from './audio-recording/audio-recording.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideSmartFormFiller(
      withOpenAIBackend({
        baseURL: `${location.origin}/api/openai/v1`,
        model: 'Mistral-Small-3.2-24B-Instruct-2506',
      }),
    ),
    provideHttpClient(),
    {
      provide: TRANSCRIPTION_CONFIG,
      useValue: {
        baseURL: `${location.origin}/api/openai/v1/audio/transcriptions`,
        model: 'whisper-large-v3',
      },
    },
  ],
};
