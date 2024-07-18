import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import {
  provideSmartFormFiller,
  withOpenAIToolsBackend,
} from '../../../smart-form-filler/src/public-api';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideSmartFormFiller(
      withOpenAIToolsBackend({
        baseURL: 'http://localhost:4200/api/inference/',
        //model: 'mixtral-8x7b-32768'
      }),
      // withCustomPromptHandler(EnglishTextPromptHandler),
    ),
  ],
};
