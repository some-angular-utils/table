# @some-angular-utils/table

[![github stars](https://img.shields.io/github/stars/some-angular-utils/table.svg?style=social&label=Star)](https://github.com/some-angular-utils/table)

[![NPM Version](https://img.shields.io/npm/v/@some-angular-utils/table)](https://www.npmjs.com/package/@some-angular-utils/table)
[![NPM Downloads](https://img.shields.io/npm/dm/@some-angular-utils/table)](https://www.npmjs.com/package/@some-angular-utils/table)

[![npm bundle size](https://img.shields.io/bundlephobia/min/@some-angular-utils/table)](https://www.npmjs.com/package/@some-angular-utils/table)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@some-angular-utils/table)](https://www.npmjs.com/package/@some-angular-utils/table)

---

[DEMO](https://some-angular-utils.github.io/table)

[NPM](https://www.npmjs.com/package/@some-angular-utils/table)

---

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

## COLORS

```css
.sau-table{
    --sau-color-primary: rgb(147, 51, 234);
    --sau-color-secondary: var(--sau-color-primary);
    --sau-color-background: rgb(255, 255, 255);
    --sau-color-edit: rgb(34, 197, 94);
    --sau-color-delete: rgb(239, 68, 68);
    --sau-color-text: rgb(31, 41, 55);
}
```
