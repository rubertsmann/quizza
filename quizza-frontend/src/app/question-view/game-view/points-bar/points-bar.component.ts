import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-points-bar',
  imports: [],
  templateUrl: './points-bar.component.html',
  animations: [
    trigger('numberChange', [
      transition('* => *', [
        animate(
          '500ms ease-out',
          keyframes([
            style({
              width: '0%',
              opacity: 0,
              offset: 0,
            }),
            style({
              width: '{{width}}%',
              opacity: 1,
              offset: 1,
            }),
          ])
        ),
      ]),
    ]),
  ],
  styleUrl: './points-bar.component.css'
})
export class PointsBarComponent {
  @Input() maxPoints!: number;
  @Input() points: number = 0;
  @Input() playerName!: string;
  @Input() place!: number;
}
