import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PageHeader } from '../../shared/page-header';

@Component({
  selector: 'app-recurring-page',
  imports: [PageHeader, MatCardModule],
  template: `
    <app-page-header title="Recurring items" />
    <mat-card appearance="outlined">
      <mat-card-content>
        <p>
          Coming in Phase 5: templates for constant income and expenses (rent, salaries, subscriptions)
          with frequency, start/end month and planned amount, plus "change amount from month X".
        </p>
      </mat-card-content>
    </mat-card>
  `,
})
export class RecurringPage {}
