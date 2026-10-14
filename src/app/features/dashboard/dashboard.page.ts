import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PageHeader } from '../../shared/page-header';

@Component({
  selector: 'app-dashboard-page',
  imports: [PageHeader, MatCardModule],
  template: `
    <app-page-header title="Dashboard" />
    <mat-card appearance="outlined">
      <mat-card-content>
        <p>
          Coming in Phase 5: planned vs actual balance for the current month, a yearly income/expense
          chart and a breakdown by category.
        </p>
      </mat-card-content>
    </mat-card>
  `,
})
export class DashboardPage {}
