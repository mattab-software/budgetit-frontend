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
