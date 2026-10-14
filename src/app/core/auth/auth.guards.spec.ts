import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './auth.guards';
import { AuthService } from './auth.service';
import { CurrentUser, Role } from './current-user';

describe('auth guards', () => {
  const user = signal<CurrentUser | null>(null);
  const authStub = {
    isAuthenticated: () => user() !== null,
    hasRole: (...roles: Role[]) => user() !== null && roles.includes(user()!.role),
  } as unknown as AuthService;

  beforeEach(() => {
    user.set(null);
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: authStub }],
    });
  });

  function run(guard: CanActivateFn, url = '/months/2026-10') {
    return TestBed.runInInjectionContext(() =>
      guard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
    );
  }

  function serialize(result: unknown): string {
    expect(result).toBeInstanceOf(UrlTree);
    return TestBed.inject(Router).serializeUrl(result as UrlTree);
  }

  function signInAs(role: Role) {
    user.set({ id: 1, email: 'a@example.com', displayName: 'A', role });
  }

  it('authGuard sends anonymous users to /login with a return URL', () => {
    expect(serialize(run(authGuard))).toBe('/login?returnUrl=%2Fmonths%2F2026-10');
  });

  it('authGuard lets signed-in users through', () => {
    signInAs('VIEWER');
    expect(run(authGuard)).toBe(true);
  });

  it('guestGuard sends signed-in users away from /login', () => {
    signInAs('VIEWER');
    expect(serialize(run(guestGuard))).toBe('/');
  });

  it('roleGuard only allows the listed roles', () => {
    signInAs('EDITOR');
    expect(serialize(run(roleGuard('ADMIN')))).toBe('/');
    expect(run(roleGuard('ADMIN', 'EDITOR'))).toBe(true);
  });
});
