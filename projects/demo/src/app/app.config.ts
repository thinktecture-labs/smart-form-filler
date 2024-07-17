import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import {
  provideSmartFormFiller,
  withPromptAPIBackend,
} from '../../../smart-form-filler/src/public-api';
import { routes } from './app.routes';
import {
  provideAudioRecording,
  withWhisperWebBackend,
} from './audio-recording/providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideSmartFormFiller(withPromptAPIBackend()),
    provideAudioRecording(withWhisperWebBackend()),
    // provideAudioRecording(withOpenAIWhisperBackend(`${location.origin}/api/openai/v1/audio/transcriptions`)),
  ],
};
