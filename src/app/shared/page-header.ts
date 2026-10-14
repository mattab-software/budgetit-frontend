import { Component, input } from '@angular/core';

/** Page title row; anything placed inside the tag (buttons, pickers) is shown on the right. */
@Component({
  selector: 'app-page-header',
  template: `
    <header class="page-header">
      <h1>{{ title() }}</h1>
      <div class="page-header__actions"><ng-content /></div>
    </header>
  `,
  styles: `
    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    h1 {
      margin: 0;
      flex: 1;
      font: var(--mat-sys-headline-small);
    }
    .page-header__actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `,
})
export class PageHeader {
  readonly title = input.required<string>();
}
