import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, firstValueFrom, Observable, tap } from 'rxjs';
import { skipGlobalErrorHandling } from '../http/http-context';
import { CurrentUser, LoginRequest, Role } from './current-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly currentUser = signal<CurrentUser | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  async restoreSession(): Promise<void> {
    try {
      const user = await firstValueFrom(
        this.http.get<CurrentUser>('/api/auth/me', { context: skipGlobalErrorHandling() }),
      );
      this.currentUser.set(user);
    } catch {
      this.currentUser.set(null);
    }
  }

  login(request: LoginRequest): Observable<CurrentUser> {
    return this.http
      .post<CurrentUser>('/api/auth/login', request, { context: skipGlobalErrorHandling() })
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  logout(): Observable<void> {
    return this.http
      .post<void>('/api/auth/logout', null, { context: skipGlobalErrorHandling() })
      .pipe(finalize(() => this.clearSession()));
  }

  hasRole(...roles: Role[]): boolean {
    const user = this.currentUser();
    return user !== null && roles.includes(user.role);
  }

  clearSession(): void {
    this.currentUser.set(null);
  }
}
