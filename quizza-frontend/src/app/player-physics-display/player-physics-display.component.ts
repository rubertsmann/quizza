import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import Matter from 'matter-js';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-player-physics-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #physicsContainer class="physics-container">
      <!-- Player balls will be rendered here by Matter.js or as DOM elements -->
    </div>
  `,
  styleUrls: ['./player-physics-display.component.css'],
})
export class PlayerPhysicsDisplayComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('physicsContainer')
  physicsContainerRef!: ElementRef<HTMLDivElement>;

  private engine!: Matter.Engine;
  private world!: Matter.World;
  private runner!: Matter.Runner;
  // private renderer!: Matter.Render; // Use if rendering with Matter's canvas

  private playerElements = new Map<string, { body: Matter.Body; element: HTMLDivElement }>();
  private currentPlayersList: string[] = [];
  private subscriptions: Subscription = new Subscription();

  private readonly BALL_RADIUS = 10;

  constructor(
    private socketService: SocketService,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    const playersSub = this.socketService.onPlayers().subscribe((players) => {
      // Run updates outside Angular zone to prevent unnecessary change detection cycles
      // if a lot of DOM manipulation happens inside updatePlayerVisuals
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
      this.addBoundaries();
      // Request initial player list if backend doesn't send on connect immediately
      // or if this component might initialize after the first 'updatePlayers' emit.
      this.socketService.requestPlayerList();

      Matter.Events.on(this.engine, 'afterUpdate', () => {
        this.syncDOMElements();
      });
    });
  }

  private initMatterJS() {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.setFallbackGravity(); // Initial gravity

    // If using Matter's built-in renderer (optional, we are using DOM elements)
    /*
    const container = this.physicsContainerRef.nativeElement;
    this.renderer = Matter.Render.create({
      element: container,
      engine: this.engine,
      options: {
        width: container.clientWidth,
        height: container.clientHeight,
        wireframes: false,
        background: 'transparent' // Or your desired background
      }
    });
    Matter.Render.run(this.renderer);
    */

    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);
  }

  private setFallbackGravity() {
    if (this.engine) {
      this.engine.world.gravity.x = 0;
      this.engine.world.gravity.y = 1; // Standard portrait gravity
    }
  }

  private setupGyroscope() {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (!this.engine) return;

        const beta = event.beta; // X-axis rotation (front to back) [-180, 180]
        const gamma = event.gamma; // Y-axis rotation (side to side) [-90, 90]

        if (beta === null || gamma === null) {
          this.setFallbackGravity();
          return;
        }

        // Normalize and apply sensitivity. Max ~1g for 90deg tilt.
        // Beta influences Y gravity, Gamma influences X gravity in portrait.
        const gravityStrength = 1; // Max gravity force (like 1g)
        this.engine.world.gravity.x =
          Math.max(-1, Math.min(1, gamma / 90)) * gravityStrength;
        this.engine.world.gravity.y =
          Math.max(-1, Math.min(1, beta / 90)) * gravityStrength;
      };

      // @ts-ignore
      const requestPermission = (DeviceOrientationEvent as any)
        .requestPermission;
      if (typeof requestPermission === 'function') {
        requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              window.addEventListener(
                'deviceorientation',
                handleOrientation,
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
        // For browsers that don't require explicit permission
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    } else {
      console.warn(
        'DeviceOrientationEvent not supported. Using fallback gravity.',
      );
      this.setFallbackGravity();
    }
  }

  private addBoundaries() {
    const container = this.physicsContainerRef.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const wallThickness = 100; // Make walls thick and outside view

    Matter.World.add(this.world, [
      // Ground
      Matter.Bodies.rectangle(
        width / 2,
        height + wallThickness / 2 - 1,
        width,
        wallThickness,
        { isStatic: true, render: { visible: false } },
      ),
      // Ceiling
      Matter.Bodies.rectangle(
        width / 2,
        -wallThickness / 2 + 1,
        width,
        wallThickness,
        { isStatic: true, render: { visible: false } },
      ),
      // Left wall
      Matter.Bodies.rectangle(
        -wallThickness / 2 + 1,
        height / 2,
        wallThickness,
        height,
        { isStatic: true, render: { visible: false } },
      ),
      // Right wall
      Matter.Bodies.rectangle(
        width + wallThickness / 2 - 1,
        height / 2,
        wallThickness,
        height,
        { isStatic: true, render: { visible: false } },
      ),
    ]);
  }

  private updatePlayerVisuals(newPlayerNames: string[]) {
    const currentNamesSet = new Set(this.currentPlayersList);
    const newNamesSet = new Set(newPlayerNames);

    // Remove players no longer in the list
    this.currentPlayersList.forEach((name) => {
      if (!newNamesSet.has(name)) {
        this.removePlayerElement(name);
      }
    });

    // Add new players
    newPlayerNames.forEach((name) => {
      if (!currentNamesSet.has(name)) {
        this.addPlayerElement(name);
      }
    });
    this.currentPlayersList = [...newPlayerNames];
  }

  private addPlayerElement(name: string) {
    if (this.playerElements.has(name) || !this.physicsContainerRef) return;

    const container = this.physicsContainerRef.nativeElement;
    const containerWidth = container.clientWidth;
    // const containerHeight = container.clientHeight; // Use if needed for y-positioning

    const x =
      this.BALL_RADIUS +
      Math.random() * (containerWidth - this.BALL_RADIUS * 2);
    const y = this.BALL_RADIUS + Math.random() * 50; // Spawn near top, within bounds

    const body = Matter.Bodies.circle(x, y, this.BALL_RADIUS, {
      restitution: 0.6, // Bounciness
      friction: 0.05, // Surface friction
      frictionAir: 0.01, // Air resistance
      density: 0.001,
      render: {
        // visible: false // if using Matter's renderer and custom DOM overlaps
      },
    });
    Matter.World.add(this.world, body);

    const element = document.createElement('div');
    element.classList.add('player-ball');
    element.innerText = name;
    element.style.width = `${this.BALL_RADIUS * 0.5}rem`;
    element.style.height = `${this.BALL_RADIUS * 0.5}rem`;
    element.style.backgroundColor = "red";
    element.style.fontSize = '1rem';
    element.style.borderRadius = "50%";

    container.appendChild(element);
    this.playerElements.set(name, { body, element });
  }

  private removePlayerElement(name: string) {
    const playerData = this.playerElements.get(name);
    if (playerData) {
      Matter.World.remove(this.world, playerData.body);
      playerData.element.remove();
      this.playerElements.delete(name);
    }
  }

  private syncDOMElements() {
    this.playerElements.forEach((playerData) => {
      const { body, element } = playerData;
      // Center the element on the body's position
      element.style.transform = `translate(
        ${body.position.x - this.BALL_RADIUS}px,
        ${body.position.y - this.BALL_RADIUS}px
      ) rotate(${body.angle}rad)`;
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.ngZone.runOutsideAngular(() => {
      if (this.runner) Matter.Runner.stop(this.runner);
      // if (this.renderer) Matter.Render.stop(this.renderer); // If using Matter's renderer
      if (this.world) Matter.World.clear(this.world, false);
      if (this.engine) Matter.Engine.clear(this.engine);
    });
    window.removeEventListener('deviceorientation', (event) =>
      this.setupGyroscope(),
    ); // Clean up listener
  }
}
