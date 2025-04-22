import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGameLobbyComponent } from './create-game-lobby.component';

describe('CreateGameLobbyComponent', () => {
  let component: CreateGameLobbyComponent;
  let fixture: ComponentFixture<CreateGameLobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGameLobbyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGameLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
