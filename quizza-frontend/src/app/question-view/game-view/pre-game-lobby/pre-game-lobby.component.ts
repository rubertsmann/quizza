import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameStateService } from '../../../services/game-state.service';
import { SoundManagerService } from '../../../services/sound-manager.service';

@Component({
  selector: 'app-pre-game-lobby',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './pre-game-lobby.component.html',
  styleUrl: './pre-game-lobby.component.css',
})
export class PreGameLobbyComponent {

  constructor(protected gameStateService: GameStateService, private soundManger: SoundManagerService) {
    this.soundManger.playMusic('start');
  }

  voteStart: null | boolean = null;

  vote(vote: boolean) {
    this.voteStart = vote;
    this.gameStateService.sendVote(vote);
  }

  shareLink() {
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: 'Join the Game!',
        text: 'Click the link below to join the game:',
        url: url,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      }).catch((error) => console.error('Error copying to clipboard:', error));
    }
  }
}
