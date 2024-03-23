import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideSmartFormFiller, withOpenAIToolsBackend } from '../../../smart-form-filler/src/public-api';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideSmartFormFiller(withOpenAIToolsBackend({
      baseURL: 'http://localhost:4200/api/inference/',
      //model: 'mixtral-8x7b-32768'
    })),
  ]
};
