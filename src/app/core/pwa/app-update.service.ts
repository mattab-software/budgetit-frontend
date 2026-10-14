import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  private readonly updates = inject(SwUpdate);
  private readonly snackBar = inject(MatSnackBar);

  start(): void {
    if (!this.updates.isEnabled) {
      return;
    }

    this.updates.versionUpdates
      .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
      .subscribe(() => {
        this.snackBar
          .open('A new version of BudgetIt is available.', 'Reload')
          .onAction()
          .subscribe(() => document.location.reload());
      });

    this.updates.unrecoverable.subscribe(() => {
      this.snackBar
        .open('BudgetIt needs to reload to keep working.', 'Reload')
        .onAction()
        .subscribe(() => document.location.reload());
    });
  }
}
