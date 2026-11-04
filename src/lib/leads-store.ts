import { desc, eq } from "drizzle-orm";
import { leads, media } from "../../db/schema";
import { getDb } from "./db";
import type { LeadItem, MediaItem } from "./types";

export type LeadInput = {
  name: string;
  phone: string;
  city: string;
  houseType: string;
  area: string;
  timing: string;
  intent: string;
  message: string;
};

export async function createLead(input: LeadInput, source = "contact") {
  const db = getDb();
  if (!db) throw new Error("DATABASE_NOT_CONFIGURED");
  const result = await db.insert(leads).values({ ...input, source });
  return result[0]?.insertId ?? 0;
}

export async function listLeads(): Promise<LeadItem[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db.select().from(leads).orderBy(desc(leads.id)).catch(() => []);
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    city: row.city,
    houseType: row.houseType,
    area: row.area,
    timing: row.timing,
    intent: row.intent,
    source: row.source,
    message: row.message,
    isRead: row.isRead,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function setLeadRead(id: number, isRead: boolean) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_NOT_CONFIGURED");
  await db.update(leads).set({ isRead }).where(eq(leads.id, id));
}

export async function deleteLeadById(id: number) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_NOT_CONFIGURED");
  await db.delete(leads).where(eq(leads.id, id));
}

export async function listMedia(): Promise<MediaItem[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db.select().from(media).orderBy(desc(media.id)).catch(() => []);
  return rows.map((row) => ({
    id: row.id,
    url: row.url,
    name: row.name,
    type: row.type,
    size: row.size,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function createMedia(input: { url: string; name: string; type: string; size: number }) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_NOT_CONFIGURED");
  const result = await db.insert(media).values(input);
  return result[0]?.insertId ?? 0;
}

export async function getMediaById(id: number) {
  const db = getDb();
  if (!db) return null;
  const rows = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function deleteMediaById(id: number) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_NOT_CONFIGURED");
  await db.delete(media).where(eq(media.id, id));
}
