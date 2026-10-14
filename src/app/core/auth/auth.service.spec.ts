import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user';

const ALICE: CurrentUser = { id: 1, email: 'alice@example.com', displayName: 'Alice', role: 'EDITOR' };

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('restores the user from an existing session', async () => {
    const restoring = service.restoreSession();
    http.expectOne('/api/auth/me').flush(ALICE);
    await restoring;

    expect(service.user()).toEqual(ALICE);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('stays anonymous when there is no session', async () => {
    const restoring = service.restoreSession();
    http.expectOne('/api/auth/me').flush(null, { status: 401, statusText: 'Unauthorized' });
    await restoring;

    expect(service.user()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('signs in and out', () => {
    service.login({ email: ALICE.email, password: 'secret' }).subscribe();
    const login = http.expectOne('/api/auth/login');
    expect(login.request.method).toBe('POST');
    expect(login.request.body).toEqual({ email: ALICE.email, password: 'secret' });
    login.flush(ALICE);
    expect(service.user()).toEqual(ALICE);

    service.logout().subscribe();
    http.expectOne('/api/auth/logout').flush(null);
    expect(service.user()).toBeNull();
  });

  it('checks roles', () => {
    expect(service.hasRole('EDITOR')).toBe(false);

    service.login({ email: ALICE.email, password: 'secret' }).subscribe();
    http.expectOne('/api/auth/login').flush(ALICE);

    expect(service.hasRole('EDITOR')).toBe(true);
    expect(service.hasRole('ADMIN', 'EDITOR')).toBe(true);
    expect(service.hasRole('ADMIN')).toBe(false);
  });
});
