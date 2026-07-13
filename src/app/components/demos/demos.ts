import { Component, computed, effect, inject, OnDestroy, Renderer2, signal, WritableSignal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SAUTableModule } from '@some-angular-utils/table';
import { CodeEditorComponent } from '../code-editor/code-editor';

type DemoId = 'remote' | 'filters' | 'filterTypes' | 'types' | 'templates' | 'actions' | 'theme' | 'orientation' | 'mobileTheme' | 'events';
type DemoKind = 'js' | 'css';

interface DemoEntry {
  id: DemoId;
  label: string;
  description: string;
  kind: DemoKind;
  initialCode: string;
  code: WritableSignal<string>;
  parsed: WritableSignal<any>;
  error: WritableSignal<string | null>;
}

function evalConfig(text: string): any {
  return new Function(`"use strict"; return (\n${text}\n);`)();
}

function createDemo(id: DemoId, label: string, description: string, kind: DemoKind, initialCode: string): DemoEntry {
  const initialParsed = kind === 'css' ? { css: initialCode } : evalConfig(initialCode);
  return {
    id,
    label,
    description,
    kind,
    initialCode,
    code: signal(initialCode),
    parsed: signal<any>(initialParsed),
    error: signal<string | null>(null),
  };
}

const REMOTE_CODE = `{
  url: 'https://pokeapi.co/api/v2/pokemon',
  contentList: 'results',
  contentTotal: 'count',
  pageParamName: 'offset',
  limitParamName: 'limit',
  sizeBetweenPages: 10,
  limit: 10,
  showOptions: false,
  headers: [
    { name: 'NAME', key: 'name' },
    { name: 'URL', key: 'url', type: 'link', linkName: 'View' },
    { name: 'SPRITE', key: 'name', type: 'image', url: 'https://img.pokemondb.net/artwork/{key}.jpg' },
  ],
}`;

const FILTERS_CODE = `{
  url: 'https://rickandmortyapi.com/api/character/',
  contentList: 'results',
  contentTotal: 'info.count',
  pageParamName: 'page',
  sizeInitialPage: 1,
  limit: 20,
  showOptions: false,
  filterConfig: {
    order: ['name', 'status'],
    mobile: ['name'],
    form: {
      name: {
        name: 'Character name',
        key: 'name',
        type: 'inputText',
        defaultValue: 'Alien'
      },
      status: {
        name: 'Life status',
        key: 'status',
        type: 'selectSimple',
        dropdowns: [
          { id: 'alive', name: 'Alive' },
          { id: 'dead', name: 'Dead' },
          { id: 'unknown', name: 'Unknown' },
        ],
        defaultValue: 'dead',
      },
    },
  },
  headers: [
    { name: 'AVATAR', key: 'image', type: 'image', url: '{key}' },
    { name: 'NAME', key: 'name' },
    { name: 'STATUS', key: 'status' },
  ],
}`;

const FILTER_TYPES_CODE = `{
  url: 'https://rickandmortyapi.com/api/character/',
  contentList: 'results',
  contentTotal: 'info.count',
  pageParamName: 'page',
  sizeInitialPage: 1,
  limit: 20,
  showOptions: false,
  filterConfig: {
    order: ['name', 'status', 'gender', 'species', 'id', 'alive', 'created', 'createdRange'],
    mobile: ['name'],
    orderParamName: 'sort',
    orderByFields: [
      { field: 'name', label: 'Name', defaultValue: false },
      { field: 'created', label: 'Created' },
    ],
    form: {
      // inputText
      name: {
        name: 'Character name',
        key: 'name',
        type: 'inputText',
        defaultValue: 'Rick',
      },
      // selectSimple (dropdowns accept an optional bindSubLabel)
      status: {
        name: 'Life status',
        key: 'status',
        type: 'selectSimple',
        bindSubLabel: 'code',
        dropdowns: [
          { id: 'alive', name: 'Alive', code: 'ALV' },
          { id: 'dead', name: 'Dead', code: 'DTH' },
          { id: 'unknown', name: 'Unknown', code: '???' },
        ],
      },
      // selectMultiple
      gender: {
        name: 'Genders',
        key: 'gender',
        type: 'selectMultiple',
        dropdowns: [
          { id: 'female', name: 'Female' },
          { id: 'male', name: 'Male' },
          { id: 'genderless', name: 'Genderless' },
          { id: 'unknown', name: 'Unknown' },
        ],
      },
      // a second inputText, just to filter by a different key
      species: {
        name: 'Species',
        key: 'species',
        type: 'inputText',
        defaultValue: '',
      },
      // inputNumber
      id: {
        name: 'Character id',
        key: 'id',
        type: 'inputNumber',
      },
      // inputCheckbox (tri-state: true / false / unset)
      alive: {
        name: 'Confirmed alive',
        key: 'confirmed_alive',
        type: 'inputCheckbox',
      },
      // date
      created: {
        name: 'Created on',
        key: 'created',
        type: 'date',
      },
      // dateRange (needs keyTo)
      createdRange: {
        name: 'Created between',
        key: 'created_from',
        keyTo: 'created_to',
        type: 'dateRange',
      },
    },
  },
  headers: [
    { name: 'AVATAR', key: 'image', type: 'image', url: '{key}' },
    { name: 'NAME', key: 'name' },
    { name: 'STATUS', key: 'status' },
    { name: 'SPECIES', key: 'species' },
    { name: 'GENDER', key: 'gender' },
  ],
}`;

const TYPES_CODE = `{
  headers: [
    { name: 'NAME', key: 'name' },
    { name: 'ACTIVE', key: 'isActive', type: 'boolean' },
    { name: 'COLOR', key: 'color', type: 'color' },
    { name: 'DATE', key: 'date', type: 'dateTime' },
    { name: 'LINK', key: 'link', type: 'link', linkName: 'Visit' },
    { name: 'IMAGE', key: 'image', type: 'image', url: 'https://img.pokemondb.net/artwork/{key}.jpg' },
  ],
  fixedContent: [
    { name: 'Bulbasaur', isActive: true, color: '#22c55e', date: new Date('2023-01-01 12:00'), link: 'https://pokeapi.co', image: 'bulbasaur' },
    { name: 'Charmander', isActive: false, color: '#ef4444', date: new Date('2023-01-02 16:00'), link: 'https://pokeapi.co', image: 'charmander' },
    { name: 'Squirtle', isActive: true, color: '#3b82f6', date: new Date('2023-01-03 09:30'), link: 'https://pokeapi.co', image: 'squirtle' },
  ],
}`;

const TEMPLATES_CODE = `{
  headers: [
    { name: 'PRODUCT', key: 'name' },
    { name: 'PRICE', key: 'price' },
    { name: 'STATUS', key: 'active', type: 'boolean' },
  ],
  fixedContent: [
    { name: 'Coffee', price: 150, active: true },
    { name: 'Tea', price: 200, active: false },
    { name: 'Espresso', price: 180, active: true },
  ],
  // called from the price column's ng-template
  formatPrice: (cents) => (cents / 100).toFixed(2) + ' €',
}`;

const ACTIONS_CODE = `{
  headers: [
    { name: 'USER', key: 'name' },
    { name: 'ROLE', key: 'role' },
    { name: 'STATUS', key: 'active', type: 'boolean' },
  ],
  fixedContent: [
    { id: 1, name: 'Alice Admin', role: 'Admin', active: true },
    { id: 2, name: 'Bob Guest', role: 'Guest', active: true },
    { id: 3, name: 'Charlie Inactive', role: 'User', active: false },
  ],
  canEdit: (item) => item.role !== 'Guest',
  canDelete: (item) => item.active === false,
  canPrint: () => true,
  canShow: (item) => item.role !== 'Admin',
}`;

const THEME_CODE = `--sau-color-primary: rgb(35, 163, 31);
--sau-color-secondary: rgb(35, 163, 31);
--sau-color-edit: rgb(34, 197, 94);
--sau-color-delete: rgb(239, 68, 68);
--sau-color-text: rgb(31, 41, 55);`;

const ORIENTATION_CODE = `{
  orientation: 'horizontal',
  headers: [
    { name: 'SYSTEM', key: 'system' },
    { name: 'STATUS', key: 'status', type: 'boolean' },
    { name: 'LEVEL', key: 'level', type: 'color' },
  ],
  fixedContent: [
    { system: 'Core Engine', status: true, level: '#22c55e' },
    { system: 'Neural Interface', status: true, level: '#3b82f6' },
    { system: 'Legacy Shield', status: false, level: '#ef4444' },
  ],
}`;

const MOBILE_THEME_CODE = `{
  orientation: 'vertical',
  mobileTheme: 'cards',
  headers: [
    { name: 'NÚMERO', key: 'number' },
    { name: 'NOMBRE', key: 'name' },
    { name: 'CIF/NIF', key: 'taxId' },
  ],
  fixedContent: [
    { id: 1, number: 1, name: 'Jose de los Santos', taxId: 'Sin especificar' },
    { id: 2, number: 2, name: 'David Gil', taxId: 'Sin especificar' },
  ],
}`;

const EVENTS_CODE = `{
  headers: [
    { name: 'NAME', key: 'name' },
    { name: 'ROLE', key: 'role' },
  ],
  fixedContent: [
    { name: 'Alice Admin', role: 'Admin' },
    { name: 'Bob Guest', role: 'Guest' },
    { name: 'Charlie Inactive', role: 'User' },
    { name: 'Diana Editor', role: 'Editor' },
  ],
}`;

@Component({
  selector: 'app-demos',
  imports: [SAUTableModule, CodeEditorComponent],
  templateUrl: './demos.html',
})
export class DemosComponent implements OnDestroy {
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private themeStyleEl = this.renderer.createElement('style') as HTMLStyleElement;

  activeTab = signal<DemoId>('remote');
  eventLog = signal<string | null>(null);

  demos: DemoEntry[] = [
    createDemo('remote', 'Remote data', 'Point sau-table at any REST endpoint. Edit the URL, headers or pagination params below — it refetches live.', 'js', REMOTE_CODE),
    createDemo('filters', 'Filters', 'Describe a filter form once. Submitted values turn into query params and re-fetch the data automatically.', 'js', FILTERS_CODE),
    createDemo('filterTypes', 'All filter types', 'Every sau-filter field type in one form: inputText, inputNumber, inputCheckbox, date, dateRange, selectSimple, selectMultiple, plus the built-in sort order dropdown.', 'js', FILTER_TYPES_CODE),
    createDemo('types', 'Rich cell types', 'Booleans, colors, dates, links and images are all first-class header types. Try changing a value below.', 'js', TYPES_CODE),
    createDemo('templates', 'Custom templates', 'Hand the table a function for any column and render it however you like.', 'js', TEMPLATES_CODE),
    createDemo('actions', 'Conditional actions', 'Edit, delete, print and show buttons accept a predicate function per row.', 'js', ACTIONS_CODE),
    createDemo('theme', 'Theming', 'Every color is a CSS custom property. Edit the values below and watch the table restyle instantly.', 'css', THEME_CODE),
    createDemo('orientation', 'Orientation', 'Force a vertical, horizontal or dynamic layout — just change the orientation field.', 'js', ORIENTATION_CODE),
    createDemo('mobileTheme', 'Mobile theme', 'Switch the phone layout between the classic label/value rows and the new stacked card look — just flip mobileTheme.', 'js', MOBILE_THEME_CODE),
    createDemo('events', 'Items loaded event', 'sau-table emits itemsLoadedEvent every time it finishes loading rows — from a fetch or from fixedContent.', 'js', EVENTS_CODE),
  ];

  constructor() {
    this.renderer.appendChild(this.document.head, this.themeStyleEl);

    for (const demo of this.demos) {
      let timer: ReturnType<typeof setTimeout> | undefined;

      effect(() => {
        const text = demo.code();

        if (demo.kind === 'css') {
          demo.parsed.set({ css: text });
          demo.error.set(null);
          this.renderer.setProperty(this.themeStyleEl, 'textContent', `.theme-live .sau-table { ${text} }`);
          return;
        }

        clearTimeout(timer);
        timer = setTimeout(() => {
          try {
            demo.parsed.set(evalConfig(text));
            demo.error.set(null);
          } catch (err) {
            demo.error.set(err instanceof Error ? err.message : 'Invalid code');
          }
        }, 600);
      });
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeChild(this.document.head, this.themeStyleEl);
  }

  selectTab(id: DemoId) {
    this.activeTab.set(id);
    this.eventLog.set(null);
  }

  // Lets a toggle button rewrite a single string field in a demo's live code
  // (e.g. orientation: 'horizontal' -> 'vertical') instead of hand-editing it.
  setConfigField(demoId: DemoId, field: string, value: string) {
    const demo = this.demos.find((d) => d.id === demoId);
    if (!demo) return;

    const text = demo.code();
    const regex = new RegExp(`(${field}\\s*:\\s*)'[^']*'`);
    if (!regex.test(text)) return;

    const nextText = text.replace(regex, `$1'${value}'`);
    demo.code.set(nextText);

    try {
      demo.parsed.set(evalConfig(nextText));
      demo.error.set(null);
    } catch (err) {
      demo.error.set(err instanceof Error ? err.message : 'Invalid code');
    }
  }

  log(action: string, item: any) {
    this.eventLog.set(`${action} → ${item?.name ?? JSON.stringify(item)}`);
  }

  logItemsLoaded(items: any) {
    this.eventLog.set(`itemsLoadedEvent → ${items.length} item(s)`);
  }

  eventsSearch = signal('');

  // Recombina headers + el fixedContent ya filtrado en un objeto nuevo:
  // como sau-table no tiene ngOnChanges, el @for "track cfg" del template
  // necesita una referencia nueva para recrear el componente y reemitir itemsLoadedEvent.
  eventsConfig = computed(() => {
    const demo = this.demos.find((d) => d.id === 'events')!;
    const cfg = demo.parsed();
    const term = this.eventsSearch().trim().toLowerCase();
    const fixedContent = term
      ? cfg.fixedContent.filter((item: any) => item.name?.toLowerCase().includes(term))
      : cfg.fixedContent;

    return { ...cfg, fixedContent };
  });

  onEventsSearch(value: string) {
    this.eventsSearch.set(value);
  }

  themeHeaders = [
    { name: 'USER', key: 'name' },
    { name: 'STATUS', key: 'active', type: 'boolean' },
  ];

  themeContent = [
    { name: 'Gemini User', active: true },
    { name: 'Tester', active: false },
  ];

  formatPrice(cfg: any, cents: number): string {
    try {
      return typeof cfg?.formatPrice === 'function' ? cfg.formatPrice(cents) : String(cents);
    } catch {
      return String(cents);
    }
  }
}
