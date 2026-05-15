import { Component } from '@angular/core';

@Component({
  selector: 'sau-eye-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-auto">
      <path fill="currentColor"
        d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6.01 7 11 7s9.27-3.11 11-7c-1.73-3.89-6.01-7-11-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8.5c-1.93 0-3.5 1.57-3.5 3.5S10.07 15.5 12 15.5 15.5 13.93 15.5 12 13.93 8.5 12 8.5z" />
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
export class EyeIconComponent { }