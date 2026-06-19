# CLAUDE.md

Contexto para trabajar en este repo. Es un workspace de Angular con dos proyectos:

- **`table`** (`src/app`) — la landing page/showcase de la librería. No es un producto real, no tiene backend.
- **`@some-angular-utils/table`** (`projects/some-angular-utils/table`) — la librería Angular publicable de verdad (el componente `<sau-table>`).

## Árbol del código

```
table/
├── CLAUDE.md
├── README.md
├── angular.json
├── package.json
├── tsconfig.json                       # mapea "@some-angular-utils/table" -> dist/some-angular-utils/table
│
├── src/                                 # app showcase (proyecto "table")
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss                      # Tailwind v4 (@import "tailwindcss" + @theme, sin tailwind.config.js)
│   └── app/
│       ├── app.ts / app.html / app.scss / app.config.ts / app.routes.ts
│       └── components/
│           ├── navbar/         navbar.ts                — barra superior fija
│           ├── hero/            hero.ts, hero.html        — sección de portada con tabla de ejemplo
│           ├── features/        features.ts, features.html — grid de características
│           ├── demos/           demos.ts, demos.html       — "See it in action": las 7 demos editables en vivo
│           ├── code-editor/     code-editor.ts/html/scss   — mini editor de código reutilizable (usado por demos)
│           ├── installation/    installation.ts, installation.html — instrucciones de instalación/uso
│           └── footer/          footer.ts                  — pie de página
│
└── projects/some-angular-utils/table/   # la librería publicable
    └── src/
        ├── public-api.ts                 # exports públicos del paquete npm
        ├── directives/cent-to-eur.directive.ts
        └── lib/
            ├── table.ts / table.html / table.scss   # componente principal <sau-table>
            ├── icons/                                # iconos SVG como componentes standalone
            └── components/
                ├── data-template/            # decide si una celda usa template custom o el tipo por defecto
                └── data-type-template/        # renderiza boolean/color/date/link/image/login/default
```

## El orden de build importa

La app importa la librería como `@some-angular-utils/table`, que `tsconfig.json` mapea a `./dist/some-angular-utils/table` — **no** al código fuente. Si editas algo dentro de `projects/some-angular-utils/table/src`, hay que reconstruir antes de que la app lo vea:

```bash
npm run build:lib   # ng-packagr -> dist/some-angular-utils/table
```

`ng serve` (usa Vite) pre-empaqueta dependencias y **no** recoge de forma confiable un `dist/` recién construido. Después de `build:lib`, mata y reinicia `ng serve` (o borra `.angular/cache` antes) — no asumas que el hot-reload lo detectó.

## Storybook fue eliminado

Storybook (`.storybook/`, `src/stories/`, los targets `storybook`/`build-storybook` en `angular.json`, las dependencias `@storybook/*` y el workflow `publishStorybook.yml`) se eliminó a propósito en favor de la app showcase de `src/app`. No lo reintroduzcas a menos que se pida explícitamente.

## Se encontró y corrigió un bug real en la librería

`table.ts`, en `ngAfterViewInit()`, asigna `this.items` directamente cuando se usa `fixedContent` (sin `url`), pero a diferencia del camino de datos remotos (`getItems()`), no llamaba a `this.cdr.detectChanges()`. En modo dev esto lanza `NG0100 ExpressionChangedAfterItHasBeenCheckedError` y la tabla silenciosamente nunca pinta filas (muestra "No hay elementos"). Se corrigió añadiendo `this.cdr.detectChanges()` justo después de asignar `fixedContent`. Si en el futuro se refactoriza ese método, no se debe perder esa llamada.

Detalle relacionado: las APIs con paginación basada en 1 (p. ej. Rick&Morty) necesitan `sizeInitialPage="1"` en `<sau-table>`, o la página 1 pedirá silenciosamente `page=0`. Las APIs con offset basado en 0 (p. ej. PokeAPI) quieren el valor por defecto `sizeInitialPage="0"`. `table.ts` no tiene `ngOnChanges` — `url`/`fixedContent` solo se leen una vez, en `ngAfterViewInit`.

## Cómo funciona el editor de las demos en vivo (`src/app/components/demos`)

Cada pestaña de la sección "See it in action" tiene su propio mini editor de código (`src/app/components/code-editor`), enlazado a un string de configuración. Al editar (con debounce de ~600ms), el texto se evalúa con `new Function('"use strict"; return (' + texto + ');')()` — es un literal JS de objeto/array normal (puede incluir arrow functions, `Date`, etc.), evaluado en el propio navegador del visitante. Sin ida y vuelta al servidor, mismo modelo de confianza que cualquier playground de JS (CodePen/StackBlitz) — es intencional, no un descuido.

Como `table.ts` solo lee `headers`/`fixedContent` una vez (no tiene `ngOnChanges`), enlazar la config parseada directamente no provocaría un nuevo render al editar. La solución es el patrón `@for (cfg of [demo.parsed()]; track cfg)`: trackear por la referencia del objeto mismo fuerza a Angular a destruir y recrear `<sau-table>` cada vez que el evaluador produce un objeto nuevo, lo que vuelve a ejecutar `ngAfterViewInit` con los datos nuevos (y refetch real en las pestañas de remoto/filtros).

**La pestaña de Theming es un caso especial.** El compilador de plantillas de Angular extrae las etiquetas `<style>` literales de las plantillas de componentes en tiempo de compilación (las trata como hojas de estilo estáticas), así que un `<style [textContent]="...">` enlazado por propiedad en una plantilla nunca llega al DOM en tiempo de ejecución — confirmado probando, no es una suposición. El CSS dinámico del tema se inyecta en su lugar de forma imperativa en `demos.ts` vía `Renderer2` + `DOCUMENT` (se crea un único `<style>` en el constructor, se actualiza su `textContent` dentro de un `effect()`, y se elimina en `ngOnDestroy`). No volver a un `<style>` literal en la plantilla para CSS dinámico en tiempo de ejecución — no funciona.

## Tailwind v4

No hay `tailwind.config.js` — v4 se configura con `@import "tailwindcss";` + un bloque `@theme { ... }` directamente en `src/styles.scss`, procesado por `@tailwindcss/postcss` (ver `.postcssrc.json`). La escala de color de marca (`brand-50`...`brand-900`) vive ahí. El IDE puede marcar "Unknown at rule @theme" como advertencia — es solo que el linter no conoce la sintaxis de Tailwind v4, no es un error de build.

## Gotcha de rutas en Windows + git-bash (solo importa al scriptear/probar con la herramienta Bash)

El `/tmp` de git-bash está mapeado a `AppData/Local/Temp`, pero un proceso `node.exe` nativo resuelve un string literal `'/tmp/...'` pasado como argumento JS relativo a la raíz de la unidad actual (`C:\tmp\...`) en su lugar — **no** son el mismo directorio. Si un script de Node escribe archivos en `/tmp/...` y la herramienta Bash no los encuentra después, revisar primero `C:\tmp\...` antes de asumir que la escritura falló.
