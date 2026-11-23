const BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

let cached: { token: string; exp: number } | null = null;

/** Browser only: fetch (and cache for ~14 min) the JWT for the logged-in user. */
async function getToken(force = false): Promise<string> {
  if (!force && cached && cached.exp > Date.now()) return cached.token;
  const res = await fetch("/api/token", { cache: "no-store" });
  if (!res.ok) throw new ApiError("Please sign in again", 401);
  const data = await res.json();
  cached = { token: data.token, exp: Date.now() + (data.expiresIn - 60) * 1000 };
  return data.token;
}

export function clearToken() {
  cached = null;
}

type Opts = { method?: string; body?: unknown; auth?: boolean; query?: Record<string, string | number | undefined> };

/** Client-side call to the Express API. Adds the Bearer token when auth is true. */
export async function api<T = any>(path: string, opts: Opts = {}): Promise<T> {
  const { method = "GET", body, auth = true, query } = opts;
  const qs = query
    ? "?" +
      Object.entries(query)
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&")
    : "";

  const call = async (token?: string) =>
    fetch(`${BASE}${path}${qs}`, {
      method,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let res = await call(auth ? await getToken() : undefined);
  if (res.status === 401 && auth) {
    // token might have just expired: refresh once and retry
    res = await call(await getToken(true));
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data?.message || "Something went wrong", res.status);
  return data as T;
}

/** Server-side (RSC) fetch for public endpoints. */
export async function publicFetch<T = any>(
  path: string,
  query?: Record<string, string | number | undefined>
): Promise<T> {
  const qs = query
    ? "?" +
      Object.entries(query)
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&")
    : "";
  const res = await fetch(`${BASE}${path}${qs}`, { cache: "no-store" });
  if (!res.ok) throw new ApiError(`Request failed (${res.status})`, res.status);
  return res.json();
}
