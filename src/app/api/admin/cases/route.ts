import { caseSchema, fail, guardAdmin, ok, readJson, zodMessage } from "@/lib/api";
import { createCase, listCases } from "@/lib/cases-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  return ok({ cases: await listCases(true) });
}

export async function POST(request: Request) {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  const parsed = caseSchema.safeParse(await readJson(request));
  if (!parsed.success) return fail(zodMessage(parsed.error), 400, "INVALID_INPUT");
  try {
    const id = await createCase(parsed.data);
    return ok({ id }, 201);
  } catch (error) {
    const message = error instanceof Error && error.message.includes("Duplicate") ? "案例标识已存在，请更换。" : "保存失败，请确认数据库已启动并完成迁移。";
    return fail(message, 409, "SAVE_FAILED");
  }
}
