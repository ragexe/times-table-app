import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly FORM_URL = `https://docs.google.com/forms/d/e/1FAIpQLSdOYpMrKFxTJgLZumz_w4IV876ow8WptdSLbelyh7pyv4QSEg/formResponse`;
  private readonly USER_NAME_STORAGE_KEY = 'times-table-app_user-name';

  private readonly userName$ = new BehaviorSubject<string | null | undefined>(
    localStorage.getItem(this.USER_NAME_STORAGE_KEY) ?? null,
  );

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
    return this.userName$.value ?? '👺';
  }

  public async sendResult(payload: {
    leftQuestion: number;
    rightQuestion: number;
    answer: number;
    isCorrect: boolean;
    currentScore: number;
    scoreChange: number;
  }): Promise<unknown> {
    const formData = new FormData();
    formData.append(this.ENTRY_IDS.userName, this.userName$.value ?? 'Guest');
    formData.append(this.ENTRY_IDS.leftQuestion, payload.leftQuestion.toString());
    formData.append(this.ENTRY_IDS.rightQuestion, payload.rightQuestion.toString());
    formData.append(this.ENTRY_IDS.answer, payload.answer.toString());
    formData.append(this.ENTRY_IDS.isCorrect, payload.isCorrect.toString());
    formData.append(this.ENTRY_IDS.currentScore, payload.currentScore.toString());
    formData.append(this.ENTRY_IDS.scoreChange, payload.scoreChange.toString());
    formData.append('submissionTimestamp', `${+new Date()}`);

    return await fetch(this.FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    });
  }

  public isLoggedIn(): boolean {
    return !(this.userName$.value === null);
  }

  public setUserName(value: string | null | undefined): void {
    const userName = value?.trim() ?? null;

    if (userName === null) return;

    localStorage.setItem(this.USER_NAME_STORAGE_KEY, userName);
    this.userName$.next(userName);
  }

  public logout(): void {
    localStorage.removeItem(this.USER_NAME_STORAGE_KEY);
    this.userName$.next(null);
  }
}
