import path from "node:path";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";

export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export function uploadRoot() {
  const configured = process.env.UPLOAD_DIR?.trim();
  return configured
    ? path.resolve(/*turbopackIgnore: true*/ process.cwd(), configured)
    : path.resolve(/*turbopackIgnore: true*/ process.cwd(), "uploads");
}

export function uploadMaxBytes() {
  const parsed = Number(process.env.UPLOAD_MAX_MB);
  const mb = Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 20) : 5;
  return Math.round(mb * 1024 * 1024);
}

export function safeUploadPath(segments: string[]) {
  const root = uploadRoot();
  const target = path.resolve(root, ...segments);
  if (target !== root && !target.startsWith(root + path.sep)) return null;
  return target;
}

export function uploadUrlToSegments(url: string) {
  if (!url.startsWith("/uploads/")) return null;
  const rest = url.slice("/uploads/".length);
  if (!rest) return null;
  return rest.split("/").filter(Boolean);
}

export async function saveUpload(file: File) {
  const mime = file.type;
  const ext = IMAGE_TYPES[mime];
  if (!ext) throw new Error("UNSUPPORTED_TYPE");
  if (file.size <= 0) throw new Error("EMPTY_FILE");
  if (file.size > uploadMaxBytes()) throw new Error("FILE_TOO_LARGE");
  const name = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  const root = uploadRoot();
  await mkdir(root, { recursive: true });
  await writeFile(path.join(root, name), Buffer.from(await file.arrayBuffer()));
  return {
    url: `/uploads/${name}`,
    name: file.name.slice(0, 200) || name,
    type: "image",
    size: file.size,
  };
}

export function contentTypeFor(filePath: string) {
  return CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? null;
}
