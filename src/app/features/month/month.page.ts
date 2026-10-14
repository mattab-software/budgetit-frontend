import { Component, computed, inject, input, LOCALE_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { PageHeader } from '../../shared/page-header';
import { addMonths, currentYearMonth, formatYearMonth, YearMonth } from '../../shared/year-month';

/**
 * The Excel replacement: one month of planned vs actual income and expenses.
 * `ym` is bound from the `:ym` route parameter (withComponentInputBinding).
 */
@Component({
  selector: 'app-month-page',
  imports: [PageHeader, RouterLink, MatButtonModule, MatIconModule, MatTooltipModule, MatCardModule],
  template: `
    <app-page-header [title]="label()">
      <a mat-icon-button [routerLink]="['/months', previous()]" matTooltip="Previous month" aria-label="Previous month">
        <mat-icon>chevron_left</mat-icon>
      </a>
      @if (ym() !== today) {
        <a mat-stroked-button [routerLink]="['/months', today]">Today</a>
      }
      <a mat-icon-button [routerLink]="['/months', next()]" matTooltip="Next month" aria-label="Next month">
        <mat-icon>chevron_right</mat-icon>
      </a>
    </app-page-header>

    <mat-card appearance="outlined">
      <mat-card-content>
        <p>
          The month grid goes here (Phase 5): entries for <strong>{{ ym() }}</strong> grouped by category,
          editable planned/actual amounts, a totals row, and actions to create the month from recurring
          items, add a one-off entry and close the month.
        </p>
      </mat-card-content>
    </mat-card>
  `,
})
export class MonthPage {
  readonly ym = input.required<YearMonth>();

  private readonly locale = inject(LOCALE_ID);

  protected readonly today = currentYearMonth();
  protected readonly label = computed(() => formatYearMonth(this.ym(), this.locale));
  protected readonly previous = computed(() => addMonths(this.ym(), -1));
  protected readonly next = computed(() => addMonths(this.ym(), 1));
}
