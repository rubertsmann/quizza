import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundManagerService {
  private _soundActive = true;

  private _allSounds = new Map<string, HTMLAudioElement>();

  beep = new Audio('tick.mp3');

  constructor() {
    this._allSounds.set('beep', this.beep);
  }

  public get soundActive(): boolean {
    return this._soundActive;
  }

  public toggleSound() {
    this._soundActive = !this.soundActive;
  }

  public playSound(soundName: string) {
    if(!this.soundActive) {
      return;
    }
    this._allSounds.get(soundName)?.play();
  }
}
