/**
 * Hand-written auth contract with the backend (`/api/auth/**`).
 * Domain models (categories, entries, ...) come from the generated client in `src/app/api`.
 */
export type Role = 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface CurrentUser {
  id: number;
  email: string;
  displayName: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}
