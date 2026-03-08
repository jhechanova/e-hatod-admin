/**
 * User storage - persists current user in localStorage for account page.
 */

const USER_STORAGE_KEY = "ehatod_user";

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  middleInitial?: string;
  suffixName?: string;
  email?: string;
  phoneNumber: string;
  address?: string;
  municipalityId: number;
  barangayId: number;
  municipality?: string;
  barangay?: string;
}

function parseUser(data: unknown): User | null {
  if (!data || typeof data !== "object") return null;
  let o = data as Record<string, unknown>;
  if (o.data && typeof o.data === "object") {
    o = o.data as Record<string, unknown>;
  }
  const id = Number(o.id ?? o.user_id ?? 0);
  if (!id) return null;
  return {
    id,
    username: String(o.username ?? ""),
    firstName: String(o.first_name ?? o.firstName ?? ""),
    lastName: String(o.last_name ?? o.lastName ?? ""),
    middleInitial: o.middle_initial ?? o.middleInitial ? String(o.middle_initial ?? o.middleInitial) : undefined,
    suffixName: o.suffix_name ?? o.suffixName ? String(o.suffix_name ?? o.suffixName) : undefined,
    email: o.email ? String(o.email) : undefined,
    phoneNumber: String(o.phone_number ?? o.phoneNumber ?? ""),
    address: o.address ? String(o.address) : undefined,
    municipalityId: Number(o.municipality_id ?? o.municipalityId ?? 0),
    barangayId: Number(o.barangay_id ?? o.barangayId ?? 0),
    municipality: o.municipality ? String(o.municipality) : undefined,
    barangay: o.barangay ? String(o.barangay) : undefined,
  };
}

/** Get stored user (client-side only) */
export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return parseUser(data);
  } catch {
    return null;
  }
}

/** Store user from API response (client-side only) */
export function setStoredUser(data: unknown): void {
  if (typeof window === "undefined") return;
  const user = parseUser(data);
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

/** Clear stored user on logout */
export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_STORAGE_KEY);
}
