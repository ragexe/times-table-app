import {
  Component,
  type OnInit,
  computed,
  inject,
  input,
  signal,
  type OnDestroy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { timer, type Subscription, tap } from 'rxjs';

import { SoundService } from '../../services/sound';
import {
  GAME_TIME_LIMIT,
  GAME_OPTIONS_POOL_SIZE,
  GAME_OPTIONS_SCORE_INCREMENT,
} from '../../tokens/game-config.token';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './game.component.html',
})
export class GameComponent implements OnInit, OnDestroy {
  private readonly soundService = inject(SoundService);
  private readonly timeLimit = inject(GAME_TIME_LIMIT);
  private readonly tickInterval = Math.floor(this.timeLimit / 100);
  private readonly optionsPoolSize = inject(GAME_OPTIONS_POOL_SIZE);
  private readonly scoreIncrement = inject(GAME_OPTIONS_SCORE_INCREMENT);
  private timerSubscription?: Subscription;

  protected readonly numberLeft = signal(0);
  protected readonly numberRight = signal(0);
  protected readonly options = signal<number[]>([]);
  protected readonly score = signal(0);
  protected readonly message = signal('Приготовься...');
  protected readonly isAnswered = signal(false);
  protected readonly wrongAnswers = signal<number[]>([]);
  protected readonly correctAnswers = signal<number[]>([]);
  protected readonly timeLeft = signal(this.timeLimit);
  protected readonly progressWidth = computed(() => (this.timeLeft() / this.timeLimit) * 100);

  public readonly table = input.required<string>();

  ngOnInit(): void {
    this.generateQuestion();
  }

  ngOnDestroy(): void {
    this.stopTimer();
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
    this.options.set(this.generateOptions(correctAnswer));
    this.startTimer();
  }

  /**
   * Creates a list of 4 unique options including the correct answer
   */
  private generateOptions(correct: number): number[] {
    const set = new Set<number>([correct]);

    while (set.size < this.optionsPoolSize) {
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
      this.score.update((score) => score + this.scoreIncrement);
      this.message.set('⭐ Правильно! Молодец!');
      this.isAnswered.set(true);
      this.correctAnswers.update((prev) => [...prev, value]);
      this.soundService.playSuccess();
      this.stopTimer();
    } else {
      this.message.set('❌ Ой, почти! Попробуй ещё раз');
      this.score.update((score) => (score > this.scoreIncrement ? score - this.scoreIncrement : 0));
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

  private startTimer(): void {
    if (this.timeLimit === 0) return;
    if (!Number.isSafeInteger(this.timeLimit)) return;

    this.stopTimer();
    this.timeLeft.set(this.timeLimit);
    this.soundService.playTikTak();

    this.timerSubscription = timer(0, this.tickInterval)
      .pipe(
        tap(() => {
          this.timeLeft.update((time) => time - this.tickInterval);

          if (this.timeLeft() <= 0) {
            this.stopTimer();
            this.handleTimeOut();
          }
        }),
      )
      .subscribe();
  }

  private stopTimer(): void {
    this.soundService.stopTikTak();
    this.timerSubscription?.unsubscribe();
  }

  private handleTimeOut(): void {
    if (!this.isAnswered()) {
      this.message.set('⏰ Время вышло! Нужно быстрее');
    }
  }
}
