import { fail, guardAdmin, ok } from "@/lib/api";
import { hasDatabase } from "@/lib/db";
import { createMedia, listMedia } from "@/lib/leads-store";
import { saveUpload, uploadMaxBytes } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  return ok({ media: await listMedia() });
}

export async function POST(request: Request) {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("上传请求格式不正确。", 400, "INVALID_FORM");
  }
  const file = form.get("file");
  if (!(file instanceof File)) return fail("请选择要上传的图片。", 400, "NO_FILE");
  if (!hasDatabase()) return fail("素材库需要数据库支持，请先完成数据库配置与迁移。", 503, "DATABASE_NOT_CONFIGURED");
  try {
    const saved = await saveUpload(file);
    const id = await createMedia(saved);
    return ok({ media: { id, ...saved, createdAt: new Date().toISOString() } }, 201);
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "UNSUPPORTED_TYPE") return fail("仅支持 JPG、PNG、WebP、GIF、AVIF 图片。", 400, "UNSUPPORTED_TYPE");
    if (code === "FILE_TOO_LARGE") return fail(`图片不能超过 ${Math.round(uploadMaxBytes() / 1024 / 1024)}MB。`, 413, "FILE_TOO_LARGE");
    if (code === "EMPTY_FILE") return fail("图片内容为空。", 400, "EMPTY_FILE");
    return fail("上传失败，请确认数据库与素材目录可写。", 500, "UPLOAD_FAILED");
  }
}
