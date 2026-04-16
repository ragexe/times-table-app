import type { Routes } from '@angular/router';

import { MenuComponent } from './components/menu/menu';
import { GameComponent } from './components/game/game.component';

export const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'game/:table/:mode', component: GameComponent },
  { path: '**', redirectTo: '' },
];
