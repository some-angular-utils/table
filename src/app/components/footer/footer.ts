import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="border-t border-gray-100 py-10">
      <div
        class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-gray-500 sm:flex-row">
        <p>© {{ year }} @some-angular-utils/table — MIT licensed.</p>
        <div class="flex items-center gap-6">
          <a href="https://github.com/some-angular-utils/table" target="_blank" rel="noopener"
            class="transition hover:text-gray-900">GitHub</a>
          <a href="https://www.npmjs.com/package/@some-angular-utils/table" target="_blank" rel="noopener"
            class="transition hover:text-gray-900">npm</a>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
