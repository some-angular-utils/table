import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sau-table',
  templateUrl: './table.html',
  imports: [
    RouterModule,
    DatePipe,
    CommonModule,
  ]
})
export class TableModule {
  @Input() url?: string;
  @Input() contentList?: string;
  @Input() contentTotal?: string;
  @Input() pageParamName = 'page';
  @Input() limitParamName = 'limit'
  @Input() sizeBetweenPages = 1
  @Input() headers?: { name: string, key: string | string[], subKey?: string, type?: string, innerHtml?: boolean, headers?: any }[];
  @Output() editEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter();

  loading = false

  @Input() items: any = [];

  total: number[] = []

  page = 1

  @Input() limit = 10

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.url) {
      this.getItems();
    }
  }

  getItems() {
    this.loading = true;
    this.cdr.detectChanges(); // Forzar detección antes de la petición

    const filters = `?${this.pageParamName}=${this.page * this.sizeBetweenPages}&${this.limitParamName}=${this.limit}`;

    this.http.get(this.url + filters).subscribe({
      next: (data: any) => {

        if (this.contentList && data[this.contentList]) {
          this.items = [...data[this.contentList]]; // Crear nueva referencia del array
        } else {
          this.items = [...data]; // Crear nueva referencia del array
        }

        if (this.contentTotal) {
          this.total = []
          for (let i = 0; i < data[this.contentTotal] / this.limit; i++) {
            this.total.push(i + 1)
          }
        }

        this.loading = false;
        this.cdr.detectChanges(); // Forzar detección después de actualizar datos
      },
      error: (error: any) => {
        console.error('ERROR obtener productos. ' + error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Método simple para refrescar la tabla
  refresh() {
    if (this.url) {
      this.items = []; // Limpiar array primero
      this.cdr.detectChanges(); // Forzar actualización
      this.getItems();
    }
  }

  getLink(pattern: string = '{key}', item: any, value: string | string[]): { url: string, isExternal: boolean } {
    const keyValue = this.getValue(item, value);
    const url = pattern.replace('{key}', keyValue);
    const isExternal = url.startsWith('http://') || url.startsWith('https://')

    return {
      url,
      isExternal
    }
  }

  getValue(item: any, key: string | string[]) {

    let arrayKey = [];

    if (!Array.isArray(key)) {
      arrayKey.push(key);
    } else {
      arrayKey = key.slice();
    }

    let result = ''

    while (arrayKey.length > 0) {

      let keys = arrayKey[0].split('.');
      let value = item;

      if (keys[0].includes('[]')) {
        let arrayKey = keys[0].replace('[]', '');

        value = value[arrayKey].map((element: any) => this.getValue(element, keys.slice(1).join('.'))).join(', ');

      } else {
        let finalValue = item[String(key)]

        let isArray = Array.isArray(finalValue)
        let isBoolean = typeof finalValue === 'boolean'

        if (isArray || isBoolean) {
          return finalValue
        }

        for (let i = 0; value && i < keys.length; i++) {
          value = value[keys[i]];
        }
      }

      arrayKey.shift();

      result += (value ?? '') + (arrayKey.length > 0 ? ' ' : '');

    }

    return result;
  }

  isArray(array: any): boolean {
    return Array.isArray(array)
  }

  changePage(page: number) {
    this.page = page
    this.getItems()
  }

  clickEditButton(id?: number) {
    this.editEvent.emit(id)
  }

  clickDeleteButton(id?: number) {
    this.deleteEvent.emit(id);
  }

}
