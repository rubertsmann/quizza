import { Injectable } from '@angular/core';

// Define types for clarity
type AudioBuffersMap = Map<string, AudioBuffer>;
type GainNodesMap = Map<string, GainNode>;
interface AudioSourceInfo {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
}

@Injectable({
  providedIn: 'root',
})
export class SoundManagerService {
  private _soundActive = localStorage.getItem('soundActive') === 'true';
  private audioContext: AudioContext | null = null;
  private isContextInitialized = false; // Track if context is running

  private soundBuffers: AudioBuffersMap = new Map();
  private songBuffers: AudioBuffersMap = new Map();
  private soundGainNodes: GainNodesMap = new Map();
  private songGainNodes: GainNodesMap = new Map();

  // Track the currently playing music source node to stop/loop it
  private currentMusicSource: AudioSourceInfo | null = null;
  private _lastPlayedSongKey = ''; // Use key ('start', 'middle', 'end')

  // Define sound/song configurations
  private soundConfigs = [
    { key: 'beep', path: 'tick.mp3', volume: 0.3, loop: false },
  ];
  private songConfigs = [
    { key: 'start', path: 'MusicStart.mp3', volume: 0.2, loop: true },
    { key: 'middle', path: 'MusicMiddle.mp3', volume: 0.2, loop: true },
    { key: 'end', path: 'MusicEnd.mp3', volume: 0.2, loop: true },
  ];

  constructor() {
    this.initializeAudio();
  }

  private async initializeAudio(): Promise<void> {
    if (this.audioContext) return;

    try {
      this.audioContext = new AudioContext();
      await this.loadAllAudio();
      this.setupGainNodes();
      console.log('AudioContext initialized and audio loaded.');
    } catch (error) {
      console.error('Failed to initialize AudioContext or load audio:', error);
      this.audioContext = null;
    }
  }

  private async ensureContextIsRunning(): Promise<boolean> {
    if (!this.audioContext) {
      console.warn('AudioContext not available.');
      return false;
    }

    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.error('Failed to resume AudioContext:', error);
        return false;
      }
    }
    this.isContextInitialized = this.audioContext.state === 'running';
    return this.isContextInitialized;
  }

  private async loadAllAudio(): Promise<void> {
    if (!this.audioContext) return;

    const loadPromises: Promise<void>[] = [];

    this.soundConfigs.forEach((config) => {
      loadPromises.push(
        this.loadAudio(config.path, this.soundBuffers, config.key),
      );
    });

    this.songConfigs.forEach((config) => {
      loadPromises.push(
        this.loadAudio(config.path, this.songBuffers, config.key),
      );
    });

    await Promise.all(loadPromises);
  }

  private async loadAudio(
    url: string,
    bufferMap: AudioBuffersMap,
    key: string,
  ): Promise<void> {
    if (!this.audioContext) throw new Error('AudioContext not initialized');
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(Error(`HTTP error! status: ${response.status} for ${url}`));
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      bufferMap.set(key, audioBuffer);
      console.log(`Loaded audio: ${key}`);
    } catch (error) {
      console.error(`Failed to load or decode audio: ${url}`, error);
    }
  }

  private setupGainNodes(): void {
    if (!this.audioContext) return;

    this.soundConfigs.forEach((config) => {
      const gainNode = this.audioContext!.createGain();
      gainNode.gain.value = config.volume;
      gainNode.connect(this.audioContext!.destination);
      this.soundGainNodes.set(config.key, gainNode);
    });

    this.songConfigs.forEach((config) => {
      const gainNode = this.audioContext!.createGain();
      gainNode.gain.value = config.volume;
      gainNode.connect(this.audioContext!.destination);
      this.songGainNodes.set(config.key, gainNode);
    });
  }

  public get soundActive(): boolean {
    return this._soundActive;
  }

  public async toggleSound(): Promise<void> {
    const contextRunning = await this.ensureContextIsRunning();

    this._soundActive = !this.soundActive;
    localStorage.setItem('soundActive', this._soundActive.toString());

    if (this._soundActive && contextRunning) {
      await this.playLastSong();
    } else {
      this.stopAllSounds();
    }
  }

  private async playLastSong(): Promise<void> {
    if (this._lastPlayedSongKey) {
      await this.playMusic(this._lastPlayedSongKey);
    }
  }

  public stopAllSounds(): void {
    if (this.currentMusicSource) {
      try {
        this.currentMusicSource.source.stop();
      } catch (e) {
        console.error('Error stopping music:', e);
      }
      this.currentMusicSource = null;
    }
  }

  public async playMusic(musicKey: string): Promise<void> {
    this._lastPlayedSongKey = musicKey;

    await this.ensureContextIsRunning();

    if (!this.soundActive || !this.audioContext || !this.isContextInitialized) {
      console.log(
        'Cannot play music: Sound inactive or audio context not ready.',
      );
      return;
    }

    const buffer = this.songBuffers.get(musicKey);
    const gainNode = this.songGainNodes.get(musicKey);
    const config = this.songConfigs.find((c) => c.key === musicKey);

    if (!buffer || !gainNode || !config) {
      console.warn(`Music buffer or gain node not found for key: ${musicKey}`);
      return;
    }

    this.stopAllSounds();

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = config.loop;

    source.connect(gainNode);

    try {
      source.start(0);
      this.currentMusicSource = { source, gainNode };
    } catch (error) {
      console.error(`Error playing music ${musicKey}:`, error);
      this.currentMusicSource = null;
    }
  }

  public async playSound(soundKey: string): Promise<void> {
    await this.ensureContextIsRunning();

    if (!this.soundActive || !this.audioContext || !this.isContextInitialized) {
      console.log(
        'Cannot play sound: Sound inactive or audio context not ready.',
      );
      return;
    }

    const buffer = this.soundBuffers.get(soundKey);
    const gainNode = this.soundGainNodes.get(soundKey);

    if (!buffer || !gainNode) {
      console.warn(`Sound buffer or gain node not found for key: ${soundKey}`);
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = false;
    source.connect(gainNode);

    try {
      source.start(0);
      source.onended = () => {
        source.disconnect();
      };
      console.log(`Playing sound: ${soundKey}`);
    } catch (error) {
      console.error(`Error playing sound ${soundKey}:`, error);
    }
  }
}
