import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideApi } from './api';
import { routes } from './app.routes';
import { AuthService } from './core/auth/auth.service';
import { errorInterceptor } from './core/http/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    // XSRF protection is on by default: Angular copies the XSRF-TOKEN cookie into the
    // X-XSRF-TOKEN header of mutating requests, which Spring's CookieCsrfTokenRepository expects.
    provideHttpClient(withFetch(), withInterceptors([errorInterceptor])),
    // Generated API client (`npm run gen:api`): use relative URLs (through the dev proxy / nginx)
    // instead of the server URL in the OpenAPI spec (http://localhost:8080).
    provideApi(''),
    provideAppInitializer(() => inject(AuthService).restoreSession()),
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
