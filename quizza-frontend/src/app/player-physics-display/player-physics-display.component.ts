import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import Matter from 'matter-js';
import { SocketService } from '../services/socket.service'; // Ensure path is correct

@Component({
  selector: 'app-player-physics-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="toggleVisibility()"
      class="add-border fixed-button gradient-background"
      aria-label="Toggle physics display"
      [attr.aria-pressed]="isHidden"
    >
      {{ isHidden ? 'o' : 'x' }}
    </button>
    <div
      #physicsContainer
      class="physics-container"
      [class.hidden-by-mask]="isHidden"
    ></div>
  `,
  styleUrls: ['./player-physics-display.component.css'],
})
export class PlayerPhysicsDisplayComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('physicsContainer')
  physicsContainerRef!: ElementRef<HTMLDivElement>;
  public isHidden = true;
  private engine!: Matter.Engine;
  private world!: Matter.World;
  private runner!: Matter.Runner;
  private playerElements = new Map<
    string,
    { body: Matter.Body; element: HTMLDivElement }
  >();
  private currentPlayersList: string[] = [];
  private subscriptions: Subscription = new Subscription();
  private deviceOrientationHandler:
    | ((event: DeviceOrientationEvent) => void)
    | null = null;
  private readonly BALL_RADIUS = 60;

  constructor(
    private socketService: SocketService,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    const playersSub = this.socketService.onPlayers().subscribe((players) => {
      this.ngZone.runOutsideAngular(() => {
        this.updatePlayerVisuals(players);
      });
    });
    this.subscriptions.add(playersSub);
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initMatterJS();
      this.setupGyroscope();
      this.addBoundaries(); // Call addBoundaries *after* initMatterJS
      this.socketService.requestPlayerList();

      Matter.Events.on(this.engine, 'afterUpdate', () => {
        this.syncDOMElements();
      });
    });
  }

  toggleVisibility() {
    this.isHidden = !this.isHidden;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.ngZone.runOutsideAngular(() => {
      if (this.runner) Matter.Runner.stop(this.runner);
      if (this.world) Matter.World.clear(this.world, false); // Clear non-static bodies
      if (this.engine) Matter.Engine.clear(this.engine);
    });

    if (this.deviceOrientationHandler) {
      window.removeEventListener(
        'deviceorientation',
        this.deviceOrientationHandler,
        true,
      );
      this.deviceOrientationHandler = null;
    }
  }

  private initMatterJS() {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.setFallbackGravity();

    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);
  }

  private setFallbackGravity() {
    if (this.engine) {
      this.engine.world.gravity.x = 0;
      this.engine.world.gravity.y = 1;
    }
  }

  private setupGyroscope() {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      // Remove previous handler if any
      if (this.deviceOrientationHandler) {
        window.removeEventListener(
          'deviceorientation',
          this.deviceOrientationHandler,
          true,
        );
      }

      this.deviceOrientationHandler = (event: DeviceOrientationEvent) => {
        if (!this.engine) return;

        const beta = event.beta;
        const gamma = event.gamma;

        if (beta === null || gamma === null) {
          this.setFallbackGravity();
          return;
        }

        const gravityStrength = 1;
        this.engine.world.gravity.x =
          Math.max(-1, Math.min(1, gamma / 90)) * gravityStrength;
        this.engine.world.gravity.y =
          Math.max(-1, Math.min(1, beta / 90)) * gravityStrength;
      };

      const requestPermission = (DeviceOrientationEvent as any)
        .requestPermission;
      if (typeof requestPermission === 'function') {
        requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              window.addEventListener(
                'deviceorientation',
                this.deviceOrientationHandler!,
                true,
              );
            } else {
              console.warn('Gyroscope permission denied.');
              this.setFallbackGravity();
            }
          })
          .catch((error: any) => {
            console.error('Error requesting gyroscope permission:', error);
            this.setFallbackGravity();
          });
      } else {
        window.addEventListener(
          'deviceorientation',
          this.deviceOrientationHandler!,
          true,
        );
      }
    } else {
      console.warn(
        'DeviceOrientationEvent not supported. Using fallback gravity.',
      );
      this.setFallbackGravity();
    }
  }

  private addBoundaries() {
    if (!this.physicsContainerRef || !this.world) {
      console.error(
        'Cannot add boundaries: physics container or world not initialized.',
      );
      return;
    }
    const container = this.physicsContainerRef.nativeElement;
    const width = container.clientWidth - 60;
    const height = container.clientHeight - 60;
    const wallThickness = 300;

    Matter.World.add(this.world, [
      Matter.Bodies.rectangle(
        width / 2,
        height + wallThickness / 2 - 1,
        width,
        wallThickness,
        { isStatic: true },
      ),
      Matter.Bodies.rectangle(
        width / 2,
        -wallThickness / 2 + 1,
        width,
        wallThickness,
        { isStatic: true },
      ),
      Matter.Bodies.rectangle(
        -wallThickness / 2 + 1,
        height / 2,
        wallThickness,
        height,
        { isStatic: true },
      ),
      Matter.Bodies.rectangle(
        width + wallThickness / 2 - 1,
        height / 2,
        wallThickness,
        height,
        { isStatic: true },
      ),
    ]);
  }

  private updatePlayerVisuals(newPlayerNames: string[]) {
    const currentNamesSet = new Set(this.currentPlayersList);
    const newNamesSet = new Set(newPlayerNames);

    this.currentPlayersList.forEach((name) => {
      if (!newNamesSet.has(name)) {
        this.removePlayerElement(name);
      }
    });

    newPlayerNames.forEach((name) => {
      if (!currentNamesSet.has(name) && !this.playerElements.has(name)) {
        this.addPlayerElement(name);
      }
    });
    this.currentPlayersList = [...newPlayerNames];
  }

  private addPlayerElement(name: string) {
    if (!this.physicsContainerRef || !this.world) return;

    const container = this.physicsContainerRef.nativeElement;
    // Spawn within the physics world boundaries (which are container.clientWidth - 60)
    const physicsWorldWidth = container.clientWidth - 60;

    const x =
      this.BALL_RADIUS +
      Math.random() * (physicsWorldWidth - this.BALL_RADIUS * 2);
    const y = this.BALL_RADIUS + Math.random() * 50;

    const body = Matter.Bodies.circle(x, y, this.BALL_RADIUS, {
      restitution: 0.6,
      friction: 0.05,
      frictionAir: 0.01,
      density: 0.001,
    });
    Matter.World.add(this.world, body);

    const element = document.createElement('div');
    element.classList.add('player-ball');

    element.innerHTML = this.getPlayerComponent(name);
    element.style.width = `${this.BALL_RADIUS * 2}px`;
    element.style.height = `${this.BALL_RADIUS * 2}px`;

    container.appendChild(element); // Append to visual container
    this.playerElements.set(name, { body, element });
  }

  private removePlayerElement(name: string) {
    const playerData = this.playerElements.get(name);
    if (playerData) {
      if (this.world) Matter.World.remove(this.world, playerData.body);
      playerData.element.remove();
      this.playerElements.delete(name);
    }
  }

  private syncDOMElements() {
    this.playerElements.forEach((playerData) => {
      const { body, element } = playerData;
      // Center the DOM element (whose size is 2 * BALL_RADIUS) on the physics body's position
      element.style.transform = `translate(
        ${body.position.x - this.BALL_RADIUS}px,
        ${body.position.y - this.BALL_RADIUS}px
      ) rotate(${body.angle}rad)`;
    });
  }

  private getPlayerComponent(name: string) {
    const replaceMeWithTheActualStatusOfThePlayerAndPerhapsSwitchStateAtRuntime =
      'o';
    return `<div class="player-ball-container">
  <!--Should display readiness-->
  <span class="player-tag">${replaceMeWithTheActualStatusOfThePlayerAndPerhapsSwitchStateAtRuntime}</span>
  <img src="faces/face2.png" alt="playerPicture" style="height: 100%; width: 100%;" />
  <span class="player-ball">${name}</span>
</div>`;
  }
}
