import { Component, signal } from '@angular/core';
import { TableModule } from '@some-angular-utils/table';

@Component({
  selector: 'app-root',
  imports: [
    TableModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('table');

  public url = 'https://pokeapi.co/api/v2/pokemon';

  public headers = [
    { name: 'NOMBRE', key: 'name' },
    { name: 'URL', key: 'url', type: 'link', linkName: 'Ver' },
  ]
}
