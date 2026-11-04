import { defineConfig } from "drizzle-kit";

for (const file of [".env", ".env.local"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // 环境文件不存在时继续，允许通过现有进程环境变量提供配置。
  }
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL?.trim() || "mysql://root@127.0.0.1:3306/yanhanzi",
  },
});
