import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "talksasa_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }
  return secret;
}

function getAdminPassword(): string {
  const password = process.env.LEADS_ADMIN_PASSWORD;
  if (!password || password.length < 8) {
    throw new Error("LEADS_ADMIN_PASSWORD is not configured");
  }
  return password;
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function verifyPassword(input: string): boolean {
  const expected = getAdminPassword();
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isAdminConfigured(): boolean {
  try {
    getSessionSecret();
    getAdminPassword();
    return true;
  } catch {
    return false;
  }
}

export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ sub: "admin", exp: Date.now() + SESSION_TTL_MS, nonce: randomBytes(8).toString("hex") })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      sub?: string;
      exp?: number;
    };
    return data.sub === "admin" && typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function getSessionFromCookies(): string | undefined {
  return cookies().get(ADMIN_COOKIE)?.value;
}

export function isAdminAuthenticated(): boolean {
  if (!isAdminConfigured()) return false;
  return verifySessionToken(getSessionFromCookies());
}

export function sessionCookieOptions(token: string) {
  const secure = process.env.NODE_ENV === "production";
  return {
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    secure,
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export function clearSessionCookieOptions() {
  const secure = process.env.NODE_ENV === "production";
  return {
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    secure,
    sameSite: "strict" as const,
    path: "/",
    maxAge: 0,
  };
}
