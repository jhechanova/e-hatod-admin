/**
 * Auth API - mirrors SignInCall from e-hatod / e-hatod-driver
 * Endpoint: www.bohol-emarket.ph/app/api.cf
 * Params: tpl=mobile_login, customer=1, username, password (x-www-form-urlencoded)
 */

const API_BASE_URL = "https://www.bohol-emarket.ph/app/api.cf";

export interface SignInParams {
  username: string;
  password: string;
}

export interface SignInResponse {
  /** HTTP status from fetch */
  statusCode: number;
  /** Response body - API uses status_code and message for errors */
  jsonBody?: Record<string, unknown>;
  error?: string;
}

/** Response body status_code - API returns 200 on success, 404 etc on error */
export function getResponseStatus(response: SignInResponse): number | undefined {
  const code = response.jsonBody?.status_code ?? response.jsonBody?.statusCode;
  return typeof code === "number" ? code : undefined;
}

/** Response body message - e.g. "User not found!" */
export function getResponseMessage(response: SignInResponse): string | undefined {
  return (response.jsonBody?.message as string) ?? undefined;
}

/**
 * Sign in - POST to api.cf with mobile_login template.
 * Matches SignInCall in e-hatod-common-lmz60k/api_calls.dart
 */
export async function signIn({
  username,
  password,
}: SignInParams): Promise<SignInResponse> {
  const params = new URLSearchParams({
    tpl: "mobile_login",
    customer: "1",
    username: username ?? "",
    password: password ?? "",
  });

  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  let jsonBody: Record<string, unknown> | undefined;
  try {
    const data = await response.json();
    jsonBody = typeof data === "object" ? data : undefined;
  } catch {
    jsonBody = undefined;
  }

  return {
    statusCode: response.status,
    jsonBody,
    ...(response.ok ? {} : { error: response.statusText }),
  };
}
