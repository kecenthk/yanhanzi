import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import { cases, settings } from "./schema";
import { projects } from "../src/lib/content";
import { pageContentDefaults, pageKeys } from "../src/lib/page-content-defaults";
import { siteDefaults } from "../src/lib/site-defaults";

for (const file of [".env", ".env.local"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // 允许直接使用当前进程环境变量。
  }
}

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error("缺少 DATABASE_URL，请参考 .env.example 配置后重试。");
  process.exit(1);
}

const pool = mysql.createPool({ uri: url, connectionLimit: 2 });
const db = drizzle(pool, { mode: "default" });

async function seedSetting(key: string, value: unknown) {
  const existing = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  if (existing.length > 0) {
    console.log(`跳过：${key} 已存在`);
    return;
  }
  await db.insert(settings).values({ key, value: JSON.stringify(value) });
  console.log(`写入：${key}`);
}

async function main() {
  await seedSetting("site.config", siteDefaults);
  for (const key of pageKeys) {
    await seedSetting(`page.content.${key}`, pageContentDefaults[key]);
  }

  const existingCases = await db.select({ slug: cases.slug }).from(cases);
  const known = new Set(existingCases.map((item) => item.slug));
  for (const [index, project] of projects.entries()) {
    if (known.has(project.slug)) {
      console.log(`跳过案例：${project.slug}`);
      continue;
    }
    await db.insert(cases).values({
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
    });
    console.log(`写入案例：${project.slug}`);
  }
}

main()
  .then(async () => {
    await pool.end();
    console.log("种子数据完成。");
  })
  .catch(async (error) => {
    console.error(error);
    await pool.end();
    process.exit(1);
  });
