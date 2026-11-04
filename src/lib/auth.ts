import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "yh_admin_session";
const MAX_AGE_SECONDS = 8 * 60 * 60;

export type AdminSession = { sub: string; exp: number };

function sessionSecret() {
  return process.env.SESSION_SECRET?.trim() || "";
}

export function getAuthStatus() {
  const missing: string[] = [];
  if (!sessionSecret()) missing.push("SESSION_SECRET");
  if (!process.env.ADMIN_PASSWORD_HASH?.trim() && !process.env.ADMIN_PASSWORD?.trim()) missing.push("ADMIN_PASSWORD_HASH");
  return { configured: missing.length === 0, username: process.env.ADMIN_USERNAME?.trim() || "admin", missing };
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function createSessionToken(subject: string) {
  const payload = Buffer.from(JSON.stringify({ sub: subject, exp: Date.now() + MAX_AGE_SECONDS * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | null | undefined): AdminSession | null {
  if (!token || !sessionSecret()) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSession;
    if (!data.sub || !data.exp || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE_NAME)?.value);
}

export async function setAdminCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
}

function safeEqualText(a: string, b: string) {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

export function verifyCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME?.trim() || "admin";
  if (!safeEqualText(username, expectedUser)) return false;
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (hash) {
    const [scheme, saltText, digestText] = hash.split("$");
    if (scheme !== "scrypt" || !saltText || !digestText) return false;
    const salt = Buffer.from(saltText, "base64url");
    const expected = Buffer.from(digestText, "base64url");
    const actual = scryptSync(password, salt, expected.length, { N: 16384, r: 8, p: 1 });
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }
  const plain = process.env.ADMIN_PASSWORD?.trim();
  return Boolean(plain) && safeEqualText(password, plain!);
}

type Attempt = { count: number; resetAt: number };
const attempts = new Map<string, Attempt>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 6;

export function loginAllowed(ip: string) {
  const record = attempts.get(ip);
  if (!record) return true;
  if (record.resetAt < Date.now()) {
    attempts.delete(ip);
    return true;
  }
  return record.count < MAX_ATTEMPTS;
}

export function noteLoginFailure(ip: string) {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || record.resetAt < now) attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  else record.count += 1;
}

export function clearLoginFailures(ip: string) {
  attempts.delete(ip);
}

export function createPasswordHash(password: string) {
  const salt = randomBytes(16);
  const digest = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString("base64url")}$${digest.toString("base64url")}`;
}
