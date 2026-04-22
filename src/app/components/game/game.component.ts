import {
  Component,
  computed,
  inject,
  input,
  signal,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { tap, timer, type Subscription } from 'rxjs';

import { SoundService } from '../../services/sound.service';
import { StatsService } from '../../services/stats.service';
import {
  GAME_OPTIONS_POOL_SIZE,
  GAME_OPTIONS_SCORE_INCREMENT,
  GAME_TIME_LIMIT,
} from '../../tokens/game-config.token';
import type { GameOperation } from '../../models/GameOperation';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  private readonly soundService = inject(SoundService);
  private readonly timeLimit = inject(GAME_TIME_LIMIT);
  private readonly tickInterval = Math.floor(this.timeLimit / 100);
  private readonly optionsPoolSize = inject(GAME_OPTIONS_POOL_SIZE);
  private readonly scoreIncrement = inject(GAME_OPTIONS_SCORE_INCREMENT);
  private timerSubscription?: Subscription;

  protected readonly table = input.required<string>();
  protected readonly operation = input<GameOperation>('multiplication');

  protected readonly statsService = inject(StatsService);
  protected readonly numberLeft = signal(0);
  protected readonly numberRight = signal(0);
  protected readonly answer = signal<number | null>(null);
  protected readonly options = signal<number[]>([]);
  protected readonly message = signal('Приготовься...');
  protected readonly isAnswered = signal(false);
  protected readonly wrongAnswers = signal<number[]>([]);
  protected readonly correctAnswers = signal<number[]>([]);
  protected readonly timeLeft = signal(this.timeLimit);
  protected readonly progressWidth = computed(() => (this.timeLeft() / this.timeLimit) * 100);
  protected readonly activeOperation = signal<GameOperation>('multiplication');
  protected readonly scoreEffect = signal<'up' | 'down' | 'none'>('none');

  ngOnInit(): void {
    this.generateQuestion();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  /**
   * Generates a new division/multiplication task based on the selected mode
   */
  private generateQuestion(): void {
    const tableValue = this.table();
    const operationValue = this.operation();

    const base =
      tableValue === 'random' ? Math.floor(Math.random() * 8) + 2 : parseInt(tableValue, 10);

    if (tableValue === 'random') {
      this.activeOperation.set(Math.random() > 0.5 ? 'multiplication' : 'division');
    } else {
      this.activeOperation.set(operationValue);
    }

    const factor2 = Math.floor(Math.random() * 8) + 2;
    const product = base * factor2;
    const operation = this.activeOperation();

    switch (operation) {
      case 'division':
        this.numberLeft.set(product);
        this.numberRight.set(base);
        this.options.set(this.generateOptions(factor2));
        this.answer.set(factor2);
        break;

      case 'multiplication':
        this.numberLeft.set(base);
        this.numberRight.set(factor2);
        this.options.set(this.generateOptions(product));
        this.answer.set(product);
        break;

      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- Manual exhaustive check
      default: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Manual exhaustive check
        const exhaustiveCheck: never = operation;
      }
    }

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

    const isCorrect = value === this.answer();

    const initialScore = this.statsService.totalScore();

    if (isCorrect) {
      if (this.timeLeft() > 0 || this.timeLimit === 0) {
        this.statsService.updateScore(this.scoreIncrement);
        this.triggerEffect('up');
      }

      this.message.set('⭐ Правильно! Молодец!');
      this.isAnswered.set(true);
      this.correctAnswers.update((prev) => [...prev, value]);
      this.soundService.playSuccess();
      this.stopTimer();
    } else {
      this.statsService.updateScore(-1 * this.scoreIncrement);
      this.triggerEffect('down');

      this.message.set('❌ Ой, почти! Попробуй ещё раз');
      // Add to wrong answers list to disable/dim the button
      this.wrongAnswers.update((prev) => [...prev, value]);
      this.soundService.playFailure();
    }

    // No need to send data if it's training
    if (this.scoreIncrement === 0) return;

    void this.statsService.sendResult({
      leftQuestion: this.activeOperation(),
      rightQuestion: `${this.numberLeft()} ${this.numberRight()}`,
      answer: value,
      isCorrect,
      currentScore: this.statsService.totalScore(),
      scoreChange: this.statsService.totalScore() - initialScore,
    });
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

  private triggerEffect(type: 'up' | 'down'): void {
    this.scoreEffect.set(type);
    // Сбрасываем через 400мс, чтобы класс удалился и анимацию можно было запустить снова
    setTimeout(() => this.scoreEffect.set('none'), 400);
  }
}
