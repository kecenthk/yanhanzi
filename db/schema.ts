import { boolean, int, json, mysqlTable, serial, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const settings = mysqlTable("settings", {
  key: varchar("key", { length: 160 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const cases = mysqlTable("cases", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  no: varchar("no", { length: 10 }).notNull().default(""),
  name: varchar("name", { length: 200 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  location: varchar("location", { length: 200 }).notNull().default(""),
  image: varchar("image", { length: 500 }).notNull().default(""),
  width: int("width").notNull().default(1200),
  height: int("height").notNull().default(800),
  description: text("description").notNull(),
  observation: text("observation").notNull(),
  details: json("details").$type<{ title: string; body: string }[]>().notNull(),
  published: boolean("published").notNull().default(false),
  sort: int("sort").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const leads = mysqlTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  city: varchar("city", { length: 100 }).notNull().default(""),
  houseType: varchar("house_type", { length: 100 }).notNull().default(""),
  area: varchar("area", { length: 100 }).notNull().default(""),
  timing: varchar("timing", { length: 100 }).notNull().default(""),
  intent: varchar("intent", { length: 100 }).notNull().default(""),
  source: varchar("source", { length: 40 }).notNull().default("contact"),
  message: text("message").notNull().default(""),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const media = mysqlTable("media", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 500 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 20 }).notNull().default("image"),
  size: int("size").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type CaseRow = typeof cases.$inferSelect;
export type LeadRow = typeof leads.$inferSelect;
export type MediaRow = typeof media.$inferSelect;
