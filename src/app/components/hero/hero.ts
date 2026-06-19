import { Component, signal } from '@angular/core';
import { SAUTableModule } from '@some-angular-utils/table';

@Component({
  selector: 'app-hero',
  imports: [SAUTableModule],
  templateUrl: './hero.html',
})
export class HeroComponent {
  copied = signal(false);

  headers = [
    { name: 'PRODUCT', key: 'name' },
    { name: 'STATUS', key: 'active', type: 'boolean' },
    { name: 'LEVEL', key: 'level', type: 'color' },
  ];

  fixedContent = [
    { name: 'API Gateway', active: true, level: '#22c55e' },
    { name: 'Auth Service', active: true, level: '#3b82f6' },
    { name: 'Legacy Worker', active: false, level: '#ef4444' },
  ];

  copyInstall() {
    navigator.clipboard?.writeText('npm install @some-angular-utils/table');
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }
}
