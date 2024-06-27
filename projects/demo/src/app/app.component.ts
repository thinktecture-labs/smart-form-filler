import { Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor() {
    inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined');
  }

  async ngOnInit() {
    if (!('ai' in window)) {
      return alert('Prompt API is not available. Demo will not work.');
    }

    if (await window.ai!.canCreateTextSession() === 'no') {
      return alert('Prompt API is available, but canCreateTextSession() reported "no". Demo will not work.');
    }
  }
}
