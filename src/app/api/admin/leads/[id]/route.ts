import { z } from "zod";
import { fail, guardAdmin, ok, readJson } from "@/lib/api";
import { deleteLeadById, setLeadRead } from "@/lib/leads-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ isRead: z.boolean() });

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  const { id: raw } = await context.params;
  const id = parseId(raw);
  if (!id) return fail("线索编号无效。", 400, "INVALID_ID");
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail("提交的状态无效。", 400, "INVALID_INPUT");
  await setLeadRead(id, parsed.data.isRead);
  return ok({ id, isRead: parsed.data.isRead });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  const { id: raw } = await context.params;
  const id = parseId(raw);
  if (!id) return fail("线索编号无效。", 400, "INVALID_ID");
  await deleteLeadById(id);
  return ok({ id });
}
