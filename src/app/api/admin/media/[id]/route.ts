import { unlink } from "node:fs/promises";
import { fail, guardAdmin, ok } from "@/lib/api";
import { deleteMediaById, getMediaById } from "@/lib/leads-store";
import { safeUploadPath, uploadUrlToSegments } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  const { id: raw } = await context.params;
  const id = parseId(raw);
  if (!id) return fail("素材编号无效。", 400, "INVALID_ID");
  try {
    const item = await getMediaById(id);
    if (item) {
      const segments = uploadUrlToSegments(item.url);
      const target = segments ? safeUploadPath(segments) : null;
      if (target) await unlink(target).catch(() => undefined);
    }
    await deleteMediaById(id);
    return ok({ id });
  } catch {
    return fail("删除失败，请稍后再试。", 409, "DELETE_FAILED");
  }
}
