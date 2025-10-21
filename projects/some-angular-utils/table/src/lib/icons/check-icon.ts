import { Component } from '@angular/core';

@Component({
  selector: 'sau-check-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; fill: currentColor;">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-block;
      width: 1em;
      height: 1em;
      vertical-align: middle;
    }
  `]
})
export class CheckIconComponent {}