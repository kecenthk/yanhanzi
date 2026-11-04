import { cache } from "react";
import { eq } from "drizzle-orm";
import { settings } from "../../db/schema";
import { getDb } from "./db";
import { pageContentDefaults, type PageContentMap, type PageKey } from "./page-content-defaults";
import { siteDefaults } from "./site-defaults";
import type { SiteConfig } from "./types";

function mergeValue(defaultValue: unknown, stored: unknown): unknown {
  if (Array.isArray(defaultValue)) {
    if (!Array.isArray(stored)) return defaultValue.slice();
    const template = defaultValue[0];
    return stored.slice(0, 40).map((item, index) => mergeValue(defaultValue[index] ?? template ?? "", item));
  }
  if (defaultValue && typeof defaultValue === "object") {
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return defaultValue;
    const source = stored as Record<string, unknown>;
    const result: Record<string, unknown> = { ...(defaultValue as Record<string, unknown>) };
    for (const key of Object.keys(defaultValue)) {
      result[key] = mergeValue((defaultValue as Record<string, unknown>)[key], source[key]);
    }
    return result;
  }
  if (typeof defaultValue === "string") return typeof stored === "string" ? stored.slice(0, 8000) : defaultValue;
  if (typeof defaultValue === "number") return typeof stored === "number" && Number.isFinite(stored) ? stored : defaultValue;
  if (typeof defaultValue === "boolean") return typeof stored === "boolean" ? stored : defaultValue;
  return defaultValue;
}

async function readSetting(key: string) {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    return rows[0]?.value ?? null;
  } catch {
    return null;
  }
}

export async function getSettingValue(key: string): Promise<unknown> {
  const raw = await readSetting(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function writeSetting(key: string, value: unknown) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_NOT_CONFIGURED");
  const serialized = JSON.stringify(value);
  await db.insert(settings).values({ key, value: serialized }).onDuplicateKeyUpdate({ set: { value: serialized } });
}

export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const stored = await getSettingValue("site.config");
  return mergeValue(siteDefaults, stored) as SiteConfig;
});

async function loadPageContent<K extends PageKey>(key: K): Promise<PageContentMap[K]> {
  const defaults = pageContentDefaults[key];
  const stored = await getSettingValue(`page.content.${key}`);
  return mergeValue(defaults, stored) as PageContentMap[K];
}

export const getPageContent = cache(loadPageContent) as <K extends PageKey>(key: K) => Promise<PageContentMap[K]>;

export function sanitizePageContent<K extends PageKey>(key: K, value: unknown): PageContentMap[K] {
  return mergeValue(pageContentDefaults[key], value) as PageContentMap[K];
}

export function sanitizeSiteConfig(value: unknown): SiteConfig {
  return mergeValue(siteDefaults, value) as SiteConfig;
}

export async function savePageContent<K extends PageKey>(key: K, value: unknown) {
  const clean = sanitizePageContent(key, value);
  await writeSetting(`page.content.${key}`, clean);
  return clean;
}

export async function saveSiteConfig(value: unknown) {
  const clean = sanitizeSiteConfig(value);
  await writeSetting("site.config", clean);
  return clean;
}

export async function deleteSetting(key: string) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_NOT_CONFIGURED");
  await db.delete(settings).where(eq(settings.key, key));
}

export async function resetPageContent(key: PageKey) {
  await deleteSetting(`page.content.${key}`);
  return pageContentDefaults[key];
}
