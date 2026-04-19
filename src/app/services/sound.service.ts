import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private readonly successSound = new Audio('sounds/success.ogg');
  private readonly airBurstSound = new Audio('sounds/air-burst.ogg');
  private readonly failureSound = new Audio('sounds/failure.ogg');
  private readonly tikTakSound = new Audio('sounds/tik-tak.ogg');
  private readonly randomClickSound = new Audio('sounds/random-click.ogg');

  constructor() {
    this.successSound.volume = 0.5;
    this.airBurstSound.volume = 0.4;
    this.failureSound.volume = 0.4;
    this.tikTakSound.volume = 0.3;
    this.randomClickSound.volume = 0.5;
  }

  public playSuccess(): void {
    SoundService.playSound(this.successSound);
  }

  public playRandomClick(): void {
    SoundService.playSound(this.randomClickSound);
  }

  public playAirBurst(): void {
    SoundService.playSound(this.airBurstSound);
  }

  public playFailure(): void {
    SoundService.playSound(this.failureSound);
  }

  public playTikTak(): void {
    this.stopTikTak();

    this.tikTakSound.loop = true;
    this.tikTakSound.play().catch((error: unknown) => {
      // eslint-disable-next-line no-console -- Global log
      console.error('Sound play blocked by browser', error);
    });
  }

  public stopTikTak(): void {
    this.tikTakSound.pause();
    this.tikTakSound.currentTime = 0;
  }

  private static playSound(htmlAudioElement: HTMLAudioElement): void {
    const audio = htmlAudioElement;
    audio.currentTime = 0;
    audio.play().catch((error: unknown) => {
      // eslint-disable-next-line no-console -- Global log
      console.error('Sound play blocked by browser', error);
    });
  }
}
