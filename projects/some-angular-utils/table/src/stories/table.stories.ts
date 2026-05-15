import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { SAUTableModule } from '../public-api';
import { CentToEurDisplayDirective } from '../directives/cent-to-eur.directive';

const meta: Meta = {
    title: 'Components/Table',
    component: SAUTableModule,
    decorators: [
        moduleMetadata({
            imports: [CentToEurDisplayDirective],
        }),
    ],
    argTypes: {
        canEdit: { control: false },
        canDelete: { control: false },
        canPrint: { control: false },
        canShow: { control: false },

        deleteEvent: { action: 'deleteEvent' },
        editEvent: { action: 'editEvent' },
        printEvent: { action: 'printEvent' },
        showEvent: { action: 'showEvent' },
    },
};

export default meta;
type Story = StoryObj;

// 1. Historia con datos desde una API (PokeAPI)
export const RemoteData: Story = {
    args: {
        url: 'https://pokeapi.co/api/v2/pokemon',
        contentList: 'results',
        contentTotal: 'count',
        pageParamName: 'offset',
        limitParamName: 'limit',
        sizeBetweenPages: 10,
        limit: 10,
        headers: [
            { name: 'NOMBRE', key: 'name' },
            { name: 'URL', key: 'url', type: 'link', linkName: 'Ver' },
            { name: 'IMG', key: 'name', type: 'image', url: 'https://img.pokemondb.net/artwork/{key}.jpg' }
        ],
    },
    render: (args) => ({
        props: args,
        template: `
      <sau-table 
        [url]="url" 
        [contentList]="contentList" 
        [contentTotal]="contentTotal" 
        [pageParamName]="pageParamName"
        [limitParamName]="limitParamName" 
        [sizeBetweenPages]="sizeBetweenPages" 
        [limit]="limit" 
        [headers]="headers" 
        (deleteEvent)="deleteEvent($event)"
        (editEvent)="editEvent($event)"
        (printEvent)="printEvent($event)"
        (showEvent)="showEvent($event)"
        >
      </sau-table>
    `,
    }),
};

// 2. Historia con datos locales (Headers complejos)
export const LocalData: Story = {
    args: {
        headers: [
            { name: 'NOMBRE', key: 'name' },
            { name: 'BOOLEAN', key: 'isActive', type: 'boolean' },
            { name: 'COLOR', key: 'color', type: 'color' },
            { name: 'DATETIME', key: 'date', type: 'dateTime' },
            { name: 'LINK', key: 'link', type: 'link', linkName: 'Ir a web' },
            { name: 'IMAGE', key: 'image', type: 'image', url: 'https://img.pokemondb.net/artwork/{key}.jpg' },
            {
                name: 'SUBTABLE', key: 'table', type: 'table', headers: [
                    { name: 'NOMBRE', key: 'name' },
                    { name: 'BOOLEAN', key: 'isActive', type: 'boolean' },
                ]
            }
        ],
        fixedContent: [
            {
                name: 'Bulbasaur', isActive: true, color: 'green', date: new Date('2023-01-01 12:00'), link: 'https://pokeapi.co', image: 'bulbasaur', table: [
                    { name: 'Habilidad 1', isActive: true },
                    { name: 'Habilidad 2', isActive: true }
                ]
            },
            {
                name: 'Charmander', isActive: false, color: 'red', date: new Date('2023-01-02 16:00'), link: 'https://pokeapi.co', image: 'charmander', table: [
                    { name: 'Habilidad 3', isActive: true }
                ]
            }
        ]
    },
    render: (args) => ({
        props: args,
        template: `
      <sau-table 
        [headers]="headers" 
        [fixedContent]="fixedContent"
        (deleteEvent)="deleteEvent($event)"
        (editEvent)="editEvent($event)">
      </sau-table>
    `,
    }),
};

export const CustomStyles: Story = {
    args: {
        colorPrimary: 'rgba(35, 163, 31, 1)',
        colorSecondary: 'rgba(35, 163, 31, 1)',
        colorBackground: 'rgb(255, 255, 255)',
        colorEdit: 'rgb(34, 197, 94)',
        colorDelete: 'rgb(239, 68, 68)',
        colorText: 'rgb(31, 41, 55)',
        headers: [
            { name: 'USER', key: 'name' },
            { name: 'STATUS', key: 'status', type: 'boolean' },
        ],
        fixedContent: [
            { name: 'Gemini User', status: true },
            { name: 'Tester', status: false },
        ]
    },
    render: (args) => ({
        props: args,
        template: `
    <div id="custom-container">
        <sau-table 
          [headers]="headers" 
          [fixedContent]="fixedContent"
          (deleteEvent)="deleteEvent($event)"
          (editEvent)="editEvent($event)">
        </sau-table>
    </div>

    <style>
        #custom-container ::ng-deep .sau-table {
            --sau-color-primary: ${args['colorPrimary']} !important;
            --sau-color-secondary: ${args['colorSecondary']} !important;
            --sau-color-background: ${args['colorBackground']} !important;
            --sau-color-edit: ${args['colorEdit']} !important;
            --sau-color-delete: ${args['colorDelete']} !important;
            --sau-color-text: ${args['colorText']} !important;
        }
    </style>

    `,
    }),
};

export const customColumnTemplate: Story = {
    args: {
        headers: [
            { name: 'PRODUCT', key: 'name' },
            { name: 'PRICE (cents)', key: 'price' },
            { name: 'STATUS', key: 'active', type: 'boolean' }
        ],
        fixedContent: [
            { name: 'Coffee', price: 150, active: true },
            { name: 'Tea', price: 200, active: false },
        ],
    },
    render: (args) => ({
        props: args,
        template: `
        <sau-table 
            [headers]="headers" 
            [fixedContent]="fixedContent"
            [showOptions]="false"
            [customTemplates]="{ 'price': priceTmpl, 'name': nameTmpl }">

            <ng-template #priceTmpl let-item="item" let-header="header">
                <span [centToEurDisplay]="item[header.key]"></span>
            </ng-template>

            <ng-template #nameTmpl let-item="item">
                <strong>{{ item.name }}</strong>
            </ng-template>

        </sau-table>
        `,
    }),
};

export const ConditionalActions: Story = {
    args: {
        headers: [
            { name: 'USER', key: 'name' },
            { name: 'ROLE', key: 'role' },
            { name: 'STATUS', key: 'active', type: 'boolean' }
        ],
        fixedContent: [
            { id: 1, name: 'Alice Admin', role: 'Admin', active: true },
            { id: 2, name: 'Bob Guest', role: 'Guest', active: true },
            { id: 3, name: 'Charlie Inactive', role: 'User', active: false }
        ],
        // Logic functions passed to the component
        canEdit: (item: any) => item.role !== 'Guest', // Guests cannot edit
        canDelete: (item: any) => item.active === false, // Only inactive users can be deleted
        canPrint: () => true, // Everyone can print
        canShow: (item: any) => item.role !== 'Admin'
    },
    render: (args) => ({
        props: args,
        template: `
        <sau-table 
            [headers]="headers" 
            [fixedContent]="fixedContent"
            [canEdit]="canEdit"
            [canDelete]="canDelete"
            [canPrint]="canPrint"
            [canShow]="canShow"
            (editEvent)="editEvent($event)"
            (deleteEvent)="deleteEvent($event)"
            (printEvent)="printEvent($event)"
            (showEvent)="showEvent($event)"
            >
        </sau-table>
        `,
    }),
};

export const WithFilters: Story = {
    args: {
        url: 'https://rickandmortyapi.com/api/character/?status=alive',
        contentList: 'results',
        contentTotal: 'info.count',
        pageParamName: 'page',
        limit: 20,
        sizeInitialPage: 1,
        headers: [
            {
                name: 'AVATAR',
                key: 'image',
                type: 'image',
                url: '{key}'
            },
            { name: 'NOMBRE', key: 'name' },
            { name: 'ESPECIE', key: 'species' },
            {
                name: 'ESTADO',
                key: 'status',
                type: 'boolean'
            },
            { name: 'ORIGEN', key: 'origin.name' },
            {
                name: 'DETALLES',
                key: 'id',
                type: 'link',
                linkName: 'Ver más',
                url: 'https://rickandmortyapi.com/api/character/{key}'
            }
        ],
    },
    render: (args) => ({
        props: args,
        template: `
      <div style="margin-bottom: 1rem;">
        <strong>Filter:</strong> Status alive
      </div>
      <sau-table 
        [url]="url" 
        [contentList]="contentList" 
        [contentTotal]="contentTotal" 
        [pageParamName]="pageParamName"
        [sizeInitialPage]="sizeInitialPage"
        [limit]="limit" 
        [headers]="headers" 
        (showEvent)="showEvent($event)"
        (editEvent)="editEvent($event)"
        >
      </sau-table>
    `,
    }),
};

export const orientations: Story = {
    argTypes: {
        orientation: {
            control: 'radio',
            options: ['vertical', 'horizontal', 'dynamic'],
            description: 'Defines the table layout orientation',
        },
    },
    args: {
        orientation: 'horizontal',
        headers: [
            { name: 'SYSTEM', key: 'system' },
            { name: 'STATUS', key: 'status', type: 'boolean' },
            { name: 'LEVEL', key: 'level', type: 'color' },
            { name: 'LAST UPDATE', key: 'updatedAt', type: 'dateTime' },
        ],
        fixedContent: [
            {
                system: 'Core Engine',
                status: true,
                level: '#22c55e',
                updatedAt: new Date(),
            },
            {
                system: 'Neural Interface',
                status: true,
                level: '#3b82f6',
                updatedAt: new Date(),
            },
            {
                system: 'Legacy Shield',
                status: false,
                level: '#ef4444',
                updatedAt: new Date(),
            }
        ]
    },
    render: (args) => ({
        props: args,
        template: `
      <div style="padding: 1rem; background: #f9fafb; border-radius: 8px;">
        <div style="margin-bottom: 1rem; font-family: sans-serif;">
          <strong>Current Mode:</strong> <code>{{ orientation }}</code>
        </div>
        
        <sau-table 
          [orientation]="orientation"
          [headers]="headers" 
          [fixedContent]="fixedContent"
          (editEvent)="editEvent($event)"
          (deleteEvent)="deleteEvent($event)">
        </sau-table>
      </div>
    `,
    }),
};