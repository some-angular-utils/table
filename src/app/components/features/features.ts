import { Component } from '@angular/core';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-features',
  templateUrl: './features.html',
})
export class FeaturesComponent {
  features: Feature[] = [
    {
      title: 'Remote & local data',
      description:
        'Point it at a REST endpoint and let it handle pagination params, or hand it a static array — same component, same API.',
      icon: 'M3 3h18M3 9h18M3 15h18M3 21h18',
    },
    {
      title: 'Built-in pagination',
      description:
        'Page size, offset/page params and total counts are computed automatically from the response shape you describe.',
      icon: 'M9 5l7 7-7 7',
    },
    {
      title: 'Declarative filters',
      description:
        'Define a filter form once — text inputs, selects — and let it drive the request URL without extra glue code.',
      icon: 'M6 12h12M3 6h18M9 18h6',
    },
    {
      title: 'Rich cell types',
      description:
        'Booleans, colors, dates, links, images and nested sub-tables render correctly out of the box.',
      icon: 'M4 6h16M4 12h16M4 18h16',
    },
    {
      title: 'Custom templates',
      description:
        'Override any column or action button with your own ng-template — the table stays in charge of layout, you stay in charge of markup.',
      icon: 'M4 4h16v16H4z M4 9h16',
    },
    {
      title: 'Themeable & responsive',
      description:
        'Restyle with CSS custom properties, no rebuild required, and switch between vertical, horizontal or dynamic orientation per breakpoint.',
      icon: 'M12 3v18M3 12h18',
    },
  ];
}
