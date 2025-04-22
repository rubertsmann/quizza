import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  standalone: true,
  template: `
    <main>
        <router-outlet />
    </main>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent { }
