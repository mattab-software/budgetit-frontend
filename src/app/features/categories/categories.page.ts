import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PageHeader } from '../../shared/page-header';

@Component({
  selector: 'app-categories-page',
  imports: [PageHeader, MatCardModule],
  template: `
    <app-page-header title="Categories" />
    <mat-card appearance="outlined">
      <mat-card-content>
        <p>Coming in Phase 5: income and expense categories (name, type, color) with create/edit/archive.</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class CategoriesPage {}
