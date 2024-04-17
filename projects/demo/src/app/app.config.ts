import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideSmartFormFiller,
  withOpenAIBackend,
} from '../../../smart-form-filler/src/public-api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideSmartFormFiller(
      withOpenAIBackend({
        baseURL: `${location.origin}/api/inference/`,
        model: 'mixtral-8x7b-32768',
      }),
    ),
    // withCustomPromptHandler(EnglishTextPromptHandler),
  ],
};
