import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFormFiller, withOpenAIBackend } from '../../../smart-form-filler/src/lib/providers';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFormFiller(withOpenAIBackend({
      baseURL: 'http://localhost:4200/api/openai/',
    })),
  ]
};
