import { Component } from '@angular/core';

@Component({
  selector: 'sau-chevron-double-left-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; fill: currentColor;">
      <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6 1.41-1.41zM6 6h2v12H6V6z"/>
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
export class ChevronDoubleLeftIconComponent {}