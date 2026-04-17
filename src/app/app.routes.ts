import type { Routes } from '@angular/router';

import { MenuComponent } from './components/menu/menu';
import { GameComponent } from './components/game/game.component';
import { GAME_OPTIONS_SCORE_INCREMENT, GAME_TIME_LIMIT } from './tokens/game-config.token';

export const routes: Routes = [
  { path: '', component: MenuComponent },
  {
    path: 'game/:table',
    component: GameComponent,
    providers: [
      { provide: GAME_TIME_LIMIT, useValue: 0 },
      { provide: GAME_OPTIONS_SCORE_INCREMENT, useValue: 0 },
    ],
  },
  {
    path: 'challenge/:table',
    component: GameComponent,
  },
  { path: '**', redirectTo: '' },
];
