import { asc, desc, eq } from "drizzle-orm";
import { cases, type CaseRow } from "../../db/schema";
import { projects } from "./content";
import { getDb } from "./db";
import type { CaseItem } from "./types";

const fallbackCases: CaseItem[] = projects.map((project, index) => ({
  id: index + 1,
  slug: project.slug,
  no: project.no,
  name: project.name,
  title: project.title,
  location: project.location,
  image: project.image,
  width: project.width,
  height: project.height,
  description: project.description,
  observation: project.observation,
  details: project.details.map((detail) => ({ ...detail })),
  published: true,
  sort: index + 1,
}));

function toItem(row: CaseRow): CaseItem {
  return {
    id: row.id,
    slug: row.slug,
    no: row.no,
    name: row.name,
    title: row.title,
    location: row.location,
    image: row.image,
    width: row.width,
    height: row.height,
    description: row.description,
    observation: row.observation,
    details: Array.isArray(row.details) ? row.details : [],
    published: row.published,
    sort: row.sort,
  };
}

export async function listCases(includeDrafts = false): Promise<CaseItem[]> {
  const db = getDb();
  if (!db) return includeDrafts ? fallbackCases : fallbackCases.filter((item) => item.published);
  try {
    const rows = includeDrafts
      ? await db.select().from(cases).orderBy(asc(cases.sort), desc(cases.id))
      : await db.select().from(cases).where(eq(cases.published, true)).orderBy(asc(cases.sort), desc(cases.id));
    return rows.map(toItem);
  } catch {
    return includeDrafts ? fallbackCases : fallbackCases.filter((item) => item.published);
  }
}

export async function getCaseBySlug(slug: string): Promise<CaseItem | null> {
  const db = getDb();
  if (!db) return fallbackCases.find((item) => item.slug === slug && item.published) ?? null;
  try {
    const rows = await db.select().from(cases).where(eq(cases.slug, slug)).limit(1);
    const row = rows[0];
    if (!row || !row.published) return fallbackCases.find((item) => item.slug === slug && item.published) ?? null;
    return toItem(row);
  } catch {
    return fallbackCases.find((item) => item.slug === slug && item.published) ?? null;
  }
}

export type CaseWriteInput = Omit<CaseItem, "id">;

export async function getCaseById(id: number): Promise<CaseItem | null> {
  const db = getDb();
  if (!db) return null;
  const rows = await db.select().from(cases).where(eq(cases.id, id)).limit(1);
  return rows[0] ? toItem(rows[0]) : null;
}

export async function createCase(input: CaseWriteInput) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_NOT_CONFIGURED");
  const result = await db.insert(cases).values({ ...input, details: input.details });
  return result[0]?.insertId ?? 0;
}

export async function updateCase(id: number, input: Partial<CaseWriteInput>) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_NOT_CONFIGURED");
  await db.update(cases).set({ ...input, updatedAt: new Date() }).where(eq(cases.id, id));
}

export async function deleteCase(id: number) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_NOT_CONFIGURED");
  await db.delete(cases).where(eq(cases.id, id));
}

export { fallbackCases };
