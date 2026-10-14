import { HttpContext, HttpContextToken } from '@angular/common/http';

/** Set on a request when the caller handles errors itself (no snackbar, no redirect to /login). */
export const SKIP_GLOBAL_ERROR_HANDLING = new HttpContextToken<boolean>(() => false);

export function skipGlobalErrorHandling(): HttpContext {
  return new HttpContext().set(SKIP_GLOBAL_ERROR_HANDLING, true);
}
