import { Component, type OnInit, input, signal, type WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

type GameMode = 'train' | 'test';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './game.component.html',
})
export class GameComponent implements OnInit {
  protected readonly numberLeft: WritableSignal<number> = signal(0);
  protected readonly numberRight: WritableSignal<number> = signal(0);
  protected readonly options: WritableSignal<number[]> = signal([]);
  protected readonly score: WritableSignal<number> = signal(0);
  protected readonly message: WritableSignal<string> = signal('Приготовься...');

  public readonly table = input.required<string>();

  public readonly mode = input<GameMode, string | null | undefined>('train', {
    transform: (inputValue) => (inputValue === 'test' ? 'test' : 'train'),
  });

  public ngOnInit(): void {
    this.generateQuestion();
  }

  /**
   * Generates a new multiplication task based on the selected mode
   */
  private generateQuestion(): void {
    const tableValue = this.table();
    const base =
      tableValue === 'random' ? Math.floor(Math.random() * 8) + 2 : parseInt(tableValue, 10);

    this.numberLeft.set(base);
    this.numberRight.set(Math.floor(Math.random() * 8) + 2);

    const correctAnswer = this.numberLeft() * this.numberRight();
    this.options.set(GameComponent.generateOptions(correctAnswer));
  }

  /**
   * Creates a list of 4 unique options including the correct answer
   */
  private static generateOptions(correct: number): number[] {
    const set = new Set<number>([correct]);
    while (set.size < 4) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const wrong = correct + offset;
      if (wrong > 0 && wrong !== correct) set.add(wrong);
    }
    return Array.from(set).sort(() => Math.random() - 0.5);
  }

  /**
   * Validates the user choice and updates the game state
   */
  protected handleAnswer(value: number): void {
    if (value === this.numberLeft() * this.numberRight()) {
      this.score.update((s) => s + 1);
      this.message.set('⭐ Молодец!');
      setTimeout(() => {
        this.message.set('Следующий пример:');
        this.generateQuestion();
      }, 800);
    } else {
      this.message.set('❌ Попробуй ещё раз');
    }
  }
}
