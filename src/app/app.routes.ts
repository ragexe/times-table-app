import type { Routes } from '@angular/router';

import { MenuComponent } from './components/menu/menu.component';
import { GameComponent } from './components/game/game.component';
import { GAME_OPTIONS_SCORE_INCREMENT, GAME_TIME_LIMIT } from './tokens/game-config.token';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: MenuComponent },
  {
    path: 'game/:operation/:table',
    component: GameComponent,
    providers: [
      { provide: GAME_TIME_LIMIT, useValue: 0 },
      { provide: GAME_OPTIONS_SCORE_INCREMENT, useValue: 0 },
    ],
    canActivate: [authGuard],
  },
  {
    path: 'challenge/:operation/:table',
    component: GameComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
