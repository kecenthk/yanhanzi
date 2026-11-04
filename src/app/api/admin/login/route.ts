import { z } from "zod";
import {
  clearAdminCookie,
  clearLoginFailures,
  createSessionToken,
  getAuthStatus,
  loginAllowed,
  noteLoginFailure,
  setAdminCookie,
  verifyCredentials,
} from "@/lib/auth";
import { fail, ok, readJson } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
});

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

export async function POST(request: Request) {
  const status = getAuthStatus();
  if (!status.configured) {
    return fail(`后台尚未配置：缺少 ${status.missing.join("、")}。请按 .env.example 配置后重启服务。`, 503, "AUTH_NOT_CONFIGURED");
  }
  const ip = clientIp(request);
  if (!loginAllowed(ip)) return fail("尝试次数过多，请 10 分钟后再试。", 429, "TOO_MANY_ATTEMPTS");
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail("请输入管理员账号和密码。", 400, "INVALID_INPUT");
  if (!verifyCredentials(parsed.data.username, parsed.data.password)) {
    noteLoginFailure(ip);
    return fail("账号或密码不正确。", 401, "INVALID_CREDENTIALS");
  }
  clearLoginFailures(ip);
  await setAdminCookie(createSessionToken(parsed.data.username));
  return ok({ ok: true, username: parsed.data.username });
}

export async function DELETE() {
  await clearAdminCookie();
  return ok({ ok: true });
}
