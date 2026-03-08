/**
 * Tools API - municipalities and barangays.
 * Matches GetMunicipalitiesCall and GetBarangaysByMunicipalityCall from e-hatod.
 */

const API_BASE_URL = "https://www.bohol-emarket.ph/app/api.cf";

export interface Municipality {
  id: number;
  name: string;
}

export interface Barangay {
  id: number;
  name: string;
  municipality?: number;
}

function parseList(data: unknown): { id: number; name: string }[] {
  let arr: unknown[] | undefined;
  if (Array.isArray(data)) {
    arr = data;
  } else if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    arr =
      (obj.data as unknown[]) ??
      (obj.municipalities as unknown[]) ??
      (obj.barangays as unknown[]) ??
      (obj.results as unknown[]);
  }
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((item): item is Record<string, unknown> => item != null && typeof item === "object")
    .map((item) => ({
      id: Number(item.id ?? item.municipality_id ?? item.barangay_id ?? 0),
      name: String(item.name ?? item.municipality ?? item.barangay ?? ""),
    }))
    .filter((item) => item.id > 0 || item.name);
}

/**
 * Get municipalities - matches GetMunicipalitiesCall
 */
export async function getMunicipalities(): Promise<Municipality[]> {
  const params = new URLSearchParams({
    tpl: "mobile_tools",
    tph: "municipalities",
  });

  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await response.json();
  return parseList(data) as Municipality[];
}

/**
 * Get barangays by municipality - matches GetBarangaysByMunicipalityCall
 */
export async function getBarangaysByMunicipality(
  municipalityId: string | number
): Promise<Barangay[]> {
  const params = new URLSearchParams({
    tpl: "mobile_tools",
    tph: "barangaysByMunicipality",
    municipality_id: String(municipalityId),
  });

  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await response.json();
  return parseList(data) as Barangay[];
}
