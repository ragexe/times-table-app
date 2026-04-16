import { Component, type OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SoundService } from '../../services/sound';

type GameMode = 'training' | 'test';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './game.component.html',
})
export class GameComponent implements OnInit {
  private readonly soundService = inject(SoundService);

  protected readonly numberLeft = signal(0);
  protected readonly numberRight = signal(0);
  protected readonly options = signal<number[]>([]);
  protected readonly score = signal(0);
  protected readonly message = signal('Приготовься...');
  protected readonly isAnswered = signal(false);
  protected readonly wrongAnswers = signal<number[]>([]);
  protected readonly correctAnswers = signal<number[]>([]);

  public readonly table = input.required<string>();

  public readonly mode = input<GameMode, string | null | undefined>('training', {
    transform: (inputValue) => (inputValue === 'test' ? 'test' : 'training'),
  });

  ngOnInit(): void {
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
    // If already answered correctly, ignore further clicks
    if (this.isAnswered()) return;

    const isCorrect = value === this.numberLeft() * this.numberRight();

    if (isCorrect) {
      this.score.update((score) => score + 1);
      this.message.set('⭐ Правильно! Молодец!');
      this.isAnswered.set(true);
      this.correctAnswers.update((prev) => [...prev, value]);
      this.soundService.playSuccess();
    } else {
      this.message.set('❌ Ой, почти! Попробуй ещё раз');
      this.score.update((score) => (score > 1 ? score - 1 : 0));
      // Add to wrong answers list to disable/dim the button
      this.wrongAnswers.update((prev) => [...prev, value]);
      this.soundService.playFailure();
    }
  }

  protected nextQuestion(): void {
    this.soundService.playAirBurst();
    this.isAnswered.set(false);
    this.wrongAnswers.set([]);
    this.correctAnswers.set([]);
    this.message.set('Выбери правильный ответ:');
    this.generateQuestion();
  }
}
