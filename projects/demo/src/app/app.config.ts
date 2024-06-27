import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import {
  provideSmartFormFiller,
  withPromptAPIBackend,
} from '../../../smart-form-filler/src/public-api';
import { routes } from './app.routes';
import { TRANSCRIPTION_URL } from './audio-recording/audio-recording.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideSmartFormFiller(withPromptAPIBackend()),
    provideHttpClient(),
    {
      provide: TRANSCRIPTION_URL,
      useValue: `${location.origin}/api/openai/v1/audio/transcriptions`,
    },
  ],
};
