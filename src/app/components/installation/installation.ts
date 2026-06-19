import { Component } from '@angular/core';

@Component({
  selector: 'app-installation',
  templateUrl: './installation.html',
})
export class InstallationComponent {
  installSnippet = `npm install @some-angular-utils/table`;

  importSnippet = `import { SAUTableModule } from '@some-angular-utils/table';

@Component({
  imports: [SAUTableModule],
  // ...
})`;

  usageSnippet = `public headers = [
  { name: 'NAME', key: 'name' },
  { name: 'URL', key: 'url', type: 'link', linkName: 'View' },
];

public url = 'https://pokeapi.co/api/v2/pokemon';`;

  templateSnippet = `<sau-table
  [url]="url"
  contentList="results"
  contentTotal="count"
  pageParamName="offset"
  limitParamName="limit"
  [sizeBetweenPages]="10"
  [limit]="10"
  [headers]="headers">
</sau-table>`;
}
