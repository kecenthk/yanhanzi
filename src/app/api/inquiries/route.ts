import { z } from "zod";
import { getSiteConfig } from "@/lib/settings-store";
import { createLead } from "@/lib/leads-store";
import { leadSchema, fail, ok, readJson, zodMessage } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const submitSchema = leadSchema.extend({
  source: z.enum(["contact", "alliance"]).default("contact"),
});

export async function POST(request: Request) {
  const config = await getSiteConfig();
  if (!config.inquiry.enabled) {
    return Response.json(
      { code: "CONTACT_NOT_CONFIGURED", message: "咨询接收通道尚未开通，请暂勿提交个人信息。" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
  if (!process.env.DATABASE_URL?.trim()) {
    return fail("咨询通道已开启但数据库尚未配置，请联系网站管理员。", 503, "DATABASE_NOT_CONFIGURED");
  }
  const parsed = submitSchema.safeParse(await readJson(request));
  if (!parsed.success) return fail(zodMessage(parsed.error), 400, "INVALID_INPUT");
  try {
    const id = await createLead(
      {
        name: parsed.data.name,
        phone: parsed.data.phone,
        city: parsed.data.city,
        houseType: parsed.data.houseType,
        area: parsed.data.area,
        timing: parsed.data.timing,
        intent: parsed.data.intent,
        message: parsed.data.message,
      },
      parsed.data.source
    );
    return ok({ ok: true, id }, 201);
  } catch {
    return fail("提交未成功，请稍后再试。", 500, "SUBMIT_FAILED");
  }
}
