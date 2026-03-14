import type { Meta, StoryObj } from '@storybook/angular';
import { SAUTableModule } from '../public-api';

const meta: Meta = {
    title: 'Components/Table',
    component: SAUTableModule,

    argTypes: {
        deleteEvent: { action: 'deleteEvent' },
        editEvent: { action: 'editEvent' },
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