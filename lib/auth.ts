/**
 * Auth utilities - cookie-based session for route protection.
 * Use setAuthCookie on login success, clearAuthCookie on logout.
 */

import { clearStoredUser } from "./user";

const AUTH_COOKIE_NAME = "ehatod_auth";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

/** Set auth cookie after successful login (client-side only) */
export function setAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
}

/** Clear auth cookie on logout (client-side only) */
export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

/** Logout: clear cookie, user, and redirect to login. Pass router.push or similar. */
export function logout(redirect: (path: string) => void): void {
  clearAuthCookie();
  clearStoredUser();
  redirect("/login");
}
