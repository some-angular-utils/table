import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChevronDownIconComponent } from './icons/chevron-down-icon';
import { ChevronLeftIconComponent } from './icons/chevron-left-icon';
import { ChevronRightIconComponent } from './icons/chevron-right-icon';
import { ChevronDoubleLeftIconComponent } from './icons/chevron-double-left-icon';
import { ChevronDoubleRightIconComponent } from './icons/chevron-double-right-icon';
import { PenIconComponent } from './icons/pen-icon';
import { TrashIconComponent } from './icons/trash-icon';
import { InboxIconComponent } from './icons/inbox-icon';
import { CrownIconComponent } from './icons/crown-icon';
import { CheckIconComponent } from './icons/check-icon';
import { XmarkIconComponent } from './icons/xmark-icon';
import { EnvelopeIconComponent } from './icons/envelope-icon';
import { GoogleIconComponent } from './icons/google-icon';

@Component({
  selector: 'sau-table',
  templateUrl: './table.html',
  styleUrls: ['./table.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    DatePipe,
    CommonModule,
    ChevronDownIconComponent,
    ChevronLeftIconComponent,
    ChevronRightIconComponent,
    ChevronDoubleLeftIconComponent,
    ChevronDoubleRightIconComponent,
    PenIconComponent,
    TrashIconComponent,
    InboxIconComponent,
    CrownIconComponent,
    CheckIconComponent,
    XmarkIconComponent,
    EnvelopeIconComponent,
    GoogleIconComponent,
  ]
})
export class TableModule {
  @Input() url?: string;
  @Input() contentList?: string;
  @Input() contentTotal?: string;
  @Input() pageParamName = 'page';
  @Input() limitParamName = 'limit'
  @Input() sizeInitialPage = 0
  @Input() sizeBetweenPages = 1
  @Input() headers?: { name: string, key: string | string[], subKey?: string, type?: string, innerHtml?: boolean, headers?: any }[];
  @Output() editEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter();

  // Getters para verificar si hay suscriptores
  get hasEditSubscription(): boolean {
    return this.editEvent.observed;
  }

  get hasDeleteSubscription(): boolean {
    return this.deleteEvent.observed;
  }

  loading = false

  @Input() items: any = [];

  total: number[] = []

  page = 1

  @Input() limit = 10

  // Getter para obtener las páginas visibles (3 antes y 3 después de la página actual)
  get visiblePages(): number[] {
    const totalPages = this.total.length;
    if (totalPages <= 7) {
      // Si hay 7 páginas o menos, mostrar todas
      return this.total;
    }

    const currentPage = this.page;
    const start = Math.max(1, currentPage - 3);
    const end = Math.min(totalPages, currentPage + 3);

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.url) {
      this.getItems();
    }
  }

  // Método para obtener la página interna (0-based si sizeInitialPage es 0, 1-based si es 1)
  private getInternalPage(): number {
    if (this.sizeInitialPage === 0) {
      return (this.page - 1) * this.sizeBetweenPages;
    }
    return this.page * this.sizeBetweenPages;
  }

  getItems() {
    this.loading = true;
    this.cdr.detectChanges(); // Forzar detección antes de la petición

    const internalPage = this.getInternalPage();
    const filters = `?${this.pageParamName}=${internalPage}&${this.limitParamName}=${this.limit}`;

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

  // Método para ir a la primera página
  goToFirstPage() {
    if (this.page !== 1) {
      this.changePage(1);
    }
  }

  // Método para ir a la última página
  goToLastPage() {
    const lastPage = this.total.length;
    if (this.page !== lastPage && lastPage > 0) {
      this.changePage(lastPage);
    }
  }

  clickEditButton(id?: number) {
    this.editEvent.emit(id)
  }

  clickDeleteButton(id?: number) {
    this.deleteEvent.emit(id);
  }

}
