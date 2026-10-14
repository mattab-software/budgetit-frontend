import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from './current-user';

/** Only signed-in users; others are sent to /login and come back afterwards. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  return (
    auth.isAuthenticated() ||
    inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })
  );
};

/** Only anonymous users (the login page); signed-in users go to the start page. */
export const guestGuard: CanActivateFn = () =>
  !inject(AuthService).isAuthenticated() || inject(Router).createUrlTree(['/']);

/** Only users with one of the given roles. The backend enforces the same rules with @PreAuthorize. */
export function roleGuard(...roles: Role[]): CanActivateFn {
  return () => inject(AuthService).hasRole(...roles) || inject(Router).createUrlTree(['/']);
}
