import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundManagerService {
  private _soundActive = true;

  beep = new Audio('tick.mp3');
  musicStart = new Audio('MusicStart.mp3');
  musicMiddle = new Audio('MusicMiddle.mp3');
  musicEnd = new Audio('MusicEnd.mp3');

  private _allSounds = new Map<string, HTMLAudioElement>();
  private _allSongs = new Map<string, HTMLAudioElement>();



  constructor() {
    this._allSounds.set('beep', this.beep);


    this._allSongs.set('start', this.musicStart);
    this.musicStart.loop = true;
    this.musicStart.volume = 0.2;
    this._allSongs.set('middle', this.musicMiddle);
    this.musicMiddle.loop = true;
    this.musicMiddle.volume = 0.2;
    this._allSongs.set('end', this.musicEnd);
    this.musicEnd.loop = true;
    this.musicEnd.volume = 0.2;
  }

  public get soundActive(): boolean {
    return this._soundActive;
  }

  public toggleSound() {
    console.log(this.soundActive);
    this._soundActive = !this.soundActive;

    this._allSounds.forEach((sound) => {
      sound.pause();
    });

    this._allSongs.forEach((sound) => {
      sound.pause();
    });
  }

  public playMusic(musicName: string) {
    if(!this.soundActive) {
      return;
    }

    this._allSongs.forEach((sound) => {
      sound.pause();
    });

    const newVar = this._allSongs.get(musicName);
    newVar?.play();
  }

  public playSound(soundName: string) {
    if(!this.soundActive) {
      return;
    }
    this._allSounds.get(soundName)?.play();
  }
}
