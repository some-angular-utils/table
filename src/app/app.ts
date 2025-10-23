import { Component, signal, ViewEncapsulation } from '@angular/core';
import { TableModule } from '@some-angular-utils/table';

@Component({
  selector: 'app-root',
  imports: [
    TableModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  encapsulation: ViewEncapsulation.None,
})
export class App {
  protected readonly title = signal('table');

  public url = 'https://pokeapi.co/api/v2/pokemon';

  public headers = [
    { name: 'NOMBRE', key: 'name' },
    { name: 'URL', key: 'url', type: 'link', linkName: 'Ver' },
    { name: 'IMG', key: 'name', type: 'image', url: 'https://img.pokemondb.net/artwork/{key}.jpg' }
  ]

  test() { }
}
