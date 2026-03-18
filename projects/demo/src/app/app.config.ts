import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideSmartFormFiller,
  withOpenAIBackend,
} from '../../../smart-form-filler/src/public-api';
import { TRANSCRIPTION_URL } from './audio-recording/audio-recording.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideSmartFormFiller(
      withOpenAIBackend({
        baseURL: `${location.origin}/api/openai/v1`,
        model: 'gpt-5.4-mini',
      }),
      // withCustomPromptHandler(EnglishTextPromptHandler),
    ),
    provideHttpClient(),
    {
      provide: TRANSCRIPTION_URL,
      useValue: `${location.origin}/api/openai/v1/audio/transcriptions`,
    },
  ],
};
