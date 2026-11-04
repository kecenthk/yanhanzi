import { z } from "zod";
import { getAdminSession } from "./auth";

export const NO_STORE = { "Cache-Control": "no-store" };

export function ok(data: unknown, status = 200) {
  return Response.json(data, { status, headers: NO_STORE });
}

export function fail(message: string, status = 400, code?: string) {
  return Response.json({ message, code }, { status, headers: NO_STORE });
}

export async function readJson(request: Request) {
  try {
    return (await request.json()) as unknown;
  } catch {
    return null;
  }
}

export async function guardAdmin() {
  return getAdminSession();
}

export function zodMessage(error: z.ZodError) {
  return error.issues[0]?.message || "提交的数据不完整。";
}

export const mediaUrl = (label: string) =>
  z
    .string()
    .max(500)
    .refine((value) => !value || /^\/uploads\/|^\/images\/|^https?:\/\//.test(value), `${label}仅支持站内路径或 http/https 链接`);

export const caseSchema = z.object({
  slug: z.string().min(1, "请填写案例标识").max(120, "案例标识过长").regex(/^[a-z0-9-]+$/, "案例标识只能使用小写字母、数字和连字符"),
  no: z.string().max(10, "序号过长").default(""),
  name: z.string().min(1, "请填写案例名称").max(200, "案例名称过长"),
  title: z.string().min(1, "请填写案例标题").max(200, "案例标题过长"),
  location: z.string().max(200, "项目位置过长").default(""),
  image: mediaUrl("案例图片"),
  width: z.coerce.number().int().min(1).max(10000).default(1200),
  height: z.coerce.number().int().min(1).max(10000).default(800),
  description: z.string().min(1, "请填写案例简述").max(5000, "案例简述过长"),
  observation: z.string().max(5000, "空间观察过长").default(""),
  details: z
    .array(z.object({ title: z.string().max(200, "段落标题过长"), body: z.string().max(3000, "段落正文过长") }))
    .max(20, "案例段落过多")
    .default([]),
  published: z.boolean().default(false),
  sort: z.coerce.number().int().min(0).max(9999).default(0),
});

export const leadSchema = z.object({
  name: z.string().trim().min(1, "请填写称呼").max(100, "称呼过长"),
  phone: z.string().trim().min(5, "请填写联系电话").max(50, "联系电话过长"),
  city: z.string().trim().max(100, "城市名称过长").default(""),
  houseType: z.string().trim().max(100, "项目方向过长").default(""),
  area: z.string().trim().max(100, "面积信息过长").default(""),
  timing: z.string().trim().max(100, "计划时间过长").default(""),
  intent: z.string().trim().max(100, "咨询类型过长").default(""),
  message: z.string().trim().max(3000, "需求描述过长").default(""),
});
