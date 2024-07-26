import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { ApiModule, BASE_PATH } from '../api';
import { environment } from '../environments/environment.development';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideHttpClient(),
    ApiModule,
    {
      provide: BASE_PATH,
      useValue: environment.API_BASE_PATH
    }, provideAnimationsAsync()
  ]
};
