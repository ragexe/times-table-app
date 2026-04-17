import { InjectionToken } from '@angular/core';

export const GAME_TIME_LIMIT = new InjectionToken<number>('GAME_TIME_LIMIT', {
  providedIn: 'root',
  factory: () => 4000,
});

export const GAME_OPTIONS_POOL_SIZE = new InjectionToken<number>('GAME_OPTIONS_POOL_SIZE', {
  providedIn: 'root',
  factory: () => 4,
});

export const GAME_OPTIONS_SCORE_INCREMENT = new InjectionToken<number>('GAME_OPTIONS_POOL_SIZE', {
  providedIn: 'root',
  factory: () => 1,
});


