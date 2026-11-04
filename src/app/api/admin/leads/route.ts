import { fail, guardAdmin, ok } from "@/lib/api";
import { listLeads } from "@/lib/leads-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await guardAdmin())) return fail("请先登录后台。", 401, "UNAUTHORIZED");
  return ok({ leads: await listLeads() });
}
