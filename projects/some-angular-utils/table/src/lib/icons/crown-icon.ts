import { Component } from '@angular/core';

@Component({
  selector: 'sau-crown-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; fill: currentColor;">
      <path d="M5 16L3 5l4.5 7L12 4l4.5 8L21 5l-2 11H5zm2.7-2h8.6l.9-5.4-2.1 3.7L12 9l-3.1 3.3-2.1-3.7L7.7 14z"/>
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
export class CrownIconComponent {}