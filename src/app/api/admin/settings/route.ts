import { z } from "zod";
import { fail, guardAdmin, ok, readJson } from "@/lib/api";
import { getSiteConfig, saveSiteConfig } from "@/lib/settings-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ config: z.unknown() });

export async function GET() {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  return ok({ config: await getSiteConfig() });
}

export async function PATCH(request: Request) {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail("提交的设置为空。", 400, "INVALID_INPUT");
  try {
    const config = await saveSiteConfig(parsed.data.config);
    return ok({ config });
  } catch {
    return fail("保存失败，请确认数据库已启动并完成迁移。", 409, "SAVE_FAILED");
  }
}
