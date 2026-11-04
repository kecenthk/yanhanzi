import { caseSchema, fail, guardAdmin, ok, readJson, zodMessage } from "@/lib/api";
import { deleteCase, getCaseById, updateCase } from "@/lib/cases-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  const { id: raw } = await context.params;
  const id = parseId(raw);
  if (!id) return fail("案例编号无效。", 400, "INVALID_ID");
  const item = await getCaseById(id);
  if (!item) return fail("案例不存在。", 404, "NOT_FOUND");
  return ok({ case: item });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  const { id: raw } = await context.params;
  const id = parseId(raw);
  if (!id) return fail("案例编号无效。", 400, "INVALID_ID");
  const parsed = caseSchema.partial().safeParse(await readJson(request));
  if (!parsed.success) return fail(zodMessage(parsed.error), 400, "INVALID_INPUT");
  try {
    await updateCase(id, parsed.data);
    return ok({ id });
  } catch {
    return fail("保存失败，请确认数据库已启动并完成迁移。", 409, "SAVE_FAILED");
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  const { id: raw } = await context.params;
  const id = parseId(raw);
  if (!id) return fail("案例编号无效。", 400, "INVALID_ID");
  try {
    await deleteCase(id);
    return ok({ id });
  } catch {
    return fail("删除失败，请稍后再试。", 409, "DELETE_FAILED");
  }
}
