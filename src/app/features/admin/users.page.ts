import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PageHeader } from '../../shared/page-header';

@Component({
  selector: 'app-users-page',
  imports: [PageHeader, MatCardModule],
  template: `
    <app-page-header title="Users" />
    <mat-card appearance="outlined">
      <mat-card-content>
        <p>Coming in Phase 5 (ADMIN only): list users, invite with an initial password, change role, disable.</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class UsersPage {}
