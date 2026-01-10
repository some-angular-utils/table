import { Component, signal, ViewEncapsulation } from '@angular/core';
import { SAUTableModule } from '@some-angular-utils/table';

@Component({
  selector: 'app-root',
  imports: [
    SAUTableModule
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

  public headers2 = [
    { name: 'NOMBRE', key: 'name' },
    { name: 'BOOLEAN', key: 'isActive', type: 'boolean' },
    { name: 'COLOR', key: 'color', type: 'color' },
    { name: 'DATETIME', key: 'date', type: 'dateTime' },
    { name: 'LINK', key: 'link', type: 'link', linkName: 'linkName' },
    { name: 'IMAGE', key: 'image', type: 'image', url: 'https://img.pokemondb.net/artwork/{key}.jpg' },
    {
      name: 'SUBTABLE', key: 'table', type: 'table', headers: [
        { name: 'NOMBRE', key: 'name' },
        { name: 'BOOLEAN', key: 'isActive', type: 'boolean' },

      ]
    }
  ]

  public content = [
    {
      name: 'Green', isActive: true, color: 'green', date: new Date('2023-01-01 12:00'), link: 'https://listadedeseos.es', image: 'bulbasaur', table: [
        { name: 'name1', isActive: true },
        { name: 'name2', isActive: true }
      ]
    },
    {
      name: 'Red', isActive: false, color: 'red', date: new Date('2023-01-02 16:00'), link: 'https://listadedeseos.es/@admin/demo', image: 'charmander', table: [
        { name: 'name3', isActive: true },
        { name: 'name4', isActive: false }
      ]
    },
    {
      name: 'Yellow', isActive: true, color: 'yellow', date: new Date('2023-01-03 22:00'), link: 'hola/adios', image: 'pikachu', table: [
        { name: 'name5', isActive: 0 },
        { name: 'name6', isActive: 1 }
      ]
    },

    {
      name: 'Orange', isActive: 0, color: 'orange', date: new Date('2023-01-03 22:00'), link: 'hola/adios', image: 'unown'
    },
  ];

  test() { }
}
