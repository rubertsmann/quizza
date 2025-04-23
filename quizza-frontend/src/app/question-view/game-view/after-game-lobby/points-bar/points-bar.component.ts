import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-points-bar',
  imports: [],
  templateUrl: './points-bar.component.html',
  animations: [
    trigger('numberChange', [
      transition('* => *', [
        animate(
          '3500ms ease-out',
          keyframes([
            style({
              width: '0%',
              opacity: 0,
            }),
            style({
              width: '0%',
              opacity: 0.8,
            }),
            style({
              width: '{{width}}%',
              opacity: 1,
            }),
          ]),
        ),
      ]),
    ]),
  ],
  styleUrl: './points-bar.component.css',
})
export class PointsBarComponent {
  @Input() maxPoints!: number;
  @Input() points = 0;
  @Input() playerName!: string;
  @Input() place!: number;
}
