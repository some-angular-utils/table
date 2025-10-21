import { Component } from '@angular/core';

@Component({
  selector: 'sau-chevron-double-right-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; fill: currentColor;">
      <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6-1.41 1.41zM16 6h2v12h-2V6z"/>
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
export class ChevronDoubleRightIconComponent {}