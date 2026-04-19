import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { StatsService } from '../../services/stats.service';
import type { GameOperation } from '../../models/GameOperation';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  // Available tables to practice
  protected readonly tables = [2, 3, 4, 5, 6, 7, 8, 9];
  protected readonly statsService = inject(StatsService);
  protected readonly soundService = inject(SoundService);
  protected readonly currentOperation = signal<GameOperation>('multiplication');

  protected setOperation(gameOperation: GameOperation): void {
    this.soundService.playRandomClick();
    this.currentOperation.set(gameOperation);
  }
}
