import { computed, effect, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly FORM_URL = `https://docs.google.com/forms/d/e/1FAIpQLSdOYpMrKFxTJgLZumz_w4IV876ow8WptdSLbelyh7pyv4QSEg/formResponse`;

  private readonly USER_KEY = 'math_app_current_user';
  private readonly RECORDS_KEY = 'math_app_all_records';

  public readonly userName = signal<string | null>(localStorage.getItem(this.USER_KEY));
  public readonly totalScore = signal<number>(0);

  private readonly ENTRY_IDS = {
    userName: 'entry.86961848',
    leftQuestion: 'entry.1235646845',
    rightQuestion: 'entry.990776794',
    answer: 'entry.1720868441',
    isCorrect: 'entry.80812726',
    currentScore: 'entry.1434686607',
    scoreChange: 'entry.1813684527',
  };

  public get currentUser(): string | null | undefined {
    return this.userName() ?? '👺';
  }

  constructor() {
    this.restoreScoreForUser(this.userName());

    effect(() => {
      const name = this.userName();

      if (name === null) {
        localStorage.removeItem(this.USER_KEY);
      } else {
        localStorage.setItem(this.USER_KEY, name);
      }
    });

    effect(() => {
      const name = this.userName();
      const score = this.totalScore();

      if (name === null) return;

      this.saveScoreToRegistry(name, score);
    });
  }

  public async sendResult(payload: {
    leftQuestion: number;
    rightQuestion: number;
    answer: number;
    isCorrect: boolean;
    currentScore: number;
    scoreChange: number;
    operation: string;
  }): Promise<unknown> {
    const formData = new FormData();
    formData.append(this.ENTRY_IDS.userName, this.userName() ?? 'Guest');
    formData.append(this.ENTRY_IDS.leftQuestion, payload.leftQuestion.toString());
    formData.append(this.ENTRY_IDS.rightQuestion, payload.rightQuestion.toString());
    formData.append(this.ENTRY_IDS.answer, payload.answer.toString());
    formData.append(this.ENTRY_IDS.isCorrect, payload.isCorrect.toString());
    formData.append(this.ENTRY_IDS.currentScore, payload.currentScore.toString());
    formData.append(this.ENTRY_IDS.scoreChange, payload.scoreChange.toString());
    // formData.append(this.ENTRY_IDS.operation, payload.operation.toString());
    formData.append('submissionTimestamp', `${+new Date()}`);

    return await fetch(this.FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    });
  }

  public readonly isLoggedIn = computed(() => !(this.userName() === null));

  public setUserName(name: string | null | undefined): void {
    const trimmed = name?.trim() ?? null;
    if (trimmed === null) return;

    this.userName.set(trimmed);
    this.restoreScoreForUser(trimmed);
  }

  public logout(): void {
    this.userName.set(null);
    this.totalScore.set(0);
  }

  private saveScoreToRegistry(userName: string, score: number): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- TODO: Data validation
    const records = JSON.parse(localStorage.getItem(this.RECORDS_KEY) ?? '{}') as unknown as Record<
      string,
      number
    >;
    records[userName] = score;
    localStorage.setItem(this.RECORDS_KEY, JSON.stringify(records));
  }

  private restoreScoreForUser(name: string | null): void {
    if (name === null) return;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- TODO: Data validation
    const records = JSON.parse(localStorage.getItem(this.RECORDS_KEY) ?? '{}') as unknown as Record<
      string,
      number
    >;

    this.totalScore.set(records[name] ?? 0);
  }

  public updateScore(delta: number): void {
    this.totalScore.update((score) => Math.max(0, score + delta));
  }
}
