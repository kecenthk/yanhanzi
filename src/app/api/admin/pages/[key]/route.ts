import { z } from "zod";
import { fail, guardAdmin, ok, readJson } from "@/lib/api";
import { pageContentDefaults, pageKeys, type PageKey } from "@/lib/page-content-defaults";
import { getPageContent, resetPageContent, savePageContent } from "@/lib/settings-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ content: z.unknown() });

function isPageKey(value: string): value is PageKey {
  return (pageKeys as readonly string[]).includes(value);
}

export async function GET(_request: Request, context: { params: Promise<{ key: string }> }) {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  const { key } = await context.params;
  if (!isPageKey(key)) return fail("页面不存在。", 404, "NOT_FOUND");
  return ok({ content: await getPageContent(key), defaults: pageContentDefaults[key] });
}

export async function PATCH(request: Request, context: { params: Promise<{ key: string }> }) {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  const { key } = await context.params;
  if (!isPageKey(key)) return fail("页面不存在。", 404, "NOT_FOUND");
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail("提交的内容为空。", 400, "INVALID_INPUT");
  try {
    const content = await savePageContent(key, parsed.data.content);
    return ok({ content });
  } catch {
    return fail("保存失败，请确认数据库已启动并完成迁移。", 409, "SAVE_FAILED");
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ key: string }> }) {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  const { key } = await context.params;
  if (!isPageKey(key)) return fail("页面不存在。", 404, "NOT_FOUND");
  try {
    const content = await resetPageContent(key);
    return ok({ content });
  } catch {
    return fail("重置失败，请确认数据库已配置。", 409, "RESET_FAILED");
  }
}
