import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import {
  GAME_TIME_LIMIT,
  GAME_OPTIONS_POOL_SIZE,
} from './tokens/game-config.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: GAME_TIME_LIMIT, useValue: 4000 },
    { provide: GAME_OPTIONS_POOL_SIZE, useValue: 4 },
  ],
};
