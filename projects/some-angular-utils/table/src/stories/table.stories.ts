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
        deleteEvent: { action: 'deleteEvent' },
        editEvent: { action: 'editEvent' },

        colorPrimary: { control: 'color' },
        colorSecondary: { control: 'color' },
        colorBackground: { control: 'color' },
        colorEdit: { control: 'color' },
        colorDelete: { control: 'color' },
        colorText: { control: 'color' },
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
        (editEvent)="editEvent($event)">
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

export const ConInputDeMoneda: Story = {
    args: {
        headers: [
            { name: 'PRODUCT', key: 'name' },
            { name: 'PRICE (cents)', key: 'price', type: 'currency' }, // Usamos 'currency' para identificar la columna
        ],
        fixedContent: [
            { name: 'Café', price: 150 },
            { name: 'Té', price: 200 },
        ]
    },
    render: (args) => ({
        props: args,
        template: `
        <sau-table 
            [headers]="headers" 
            [fixedContent]="fixedContent">
            
            <ng-template #customCell let-item="item" let-header="header">
                
                @if (header.type === 'currency') {
                    <span [centToEurDisplay]="item[header.key]" ></span>
                } @else {
                    {{ item[header.key] }}
                }

            </ng-template>

        </sau-table>
        `,
    }),
};