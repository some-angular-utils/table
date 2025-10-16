# @some-angular-utils/table

![NPM Version](https://img.shields.io/npm/v/%40some-angular-utils%2Ftable)
![NPM Downloads](https://img.shields.io/npm/dm/%40some-angular-utils%2Ftable)

![npm bundle size](https://img.shields.io/bundlephobia/min/%40some-angular-utils%2Ftable)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40some-angular-utils%2Ftable)

## IMPORT
```ts
import { TableModule } from '@some-angular-utils/table';
```

## TYPESCRIPT
```ts
public url = 'https://pokeapi.co/api/v2/pokemon';

public headers = [
    { name: 'NOMBRE', key: 'name' },
    { name: 'URL', key: 'url', type: 'link', linkName: 'Ver' },
    { name: 'IMG', key: 'name', type: 'image', url: 'https://img.pokemondb.net/artwork/{key}.jpg' }
]
```

## HTML
```ts
<sau-table
    [url]="url"
    contentList="results"
    contentTotal="count"
    pageParamName="offset"
    limitParamName="limit"
    [sizeBetweenPages]="10"
    [limit]="10"
    [headers]="headers"
></sau-table>
```