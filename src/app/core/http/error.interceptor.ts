import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { SKIP_GLOBAL_ERROR_HANDLING } from './http-context';

interface ProblemDetail {
  title?: string;
  detail?: string;
  status?: number;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_GLOBAL_ERROR_HANDLING)) {
    return next(req);
  }

  const auth = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          auth.clearSession();
          router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
        } else {
          snackBar.open(errorMessage(err), 'Close', { duration: 6000 });
        }
      }
      return throwError(() => err);
    }),
  );
};

export function errorMessage(err: HttpErrorResponse): string {
  if (err.status === 0) {
    return 'Cannot reach the server. Check your connection.';
  }
  if (err.status === 403) {
    return 'You do not have permission to do that.';
  }
  const problem = (err.error ?? {}) as ProblemDetail;
  return problem.detail ?? problem.title ?? `Request failed (${err.status}).`;
}
