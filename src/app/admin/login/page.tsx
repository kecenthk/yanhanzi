import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, getAuthStatus } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "后台登录" };

export default async function LoginPage() {
  if (await getAdminSession()) redirect("/admin");
  const status = getAuthStatus();
  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <h1>官网后台</h1>
        <p className="lead">登录后可维护案例、页面文案、咨询线索、素材与站点设置。</p>
        {status.configured ? null : (
          <div className="admin-alert error" style={{ marginTop: 18 }}>
            后台尚未配置：缺少 {status.missing.join("、")}。请按 .env.example 配置后重启服务。
          </div>
        )}
        <LoginForm configured={status.configured} />
        <p className="admin-login-hint">
          账号与密码由服务器环境变量配置。连续 6 次输入错误将锁定 10 分钟。
          <br />
          <Link href="/">返回官网</Link>
        </p>
      </div>
    </div>
  );
}
