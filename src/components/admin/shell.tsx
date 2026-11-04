"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { adminSend } from "./admin-client";

const navItems = [
  { href: "/admin", label: "概览" },
  { href: "/admin/cases", label: "案例管理" },
  { href: "/admin/pages", label: "页面文案" },
  { href: "/admin/leads", label: "咨询线索" },
  { href: "/admin/media", label: "素材库" },
  { href: "/admin/settings", label: "站点设置" },
];

export function AdminShell({ username, children }: { username: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    await adminSend("/api/admin/logout", "POST");
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/admin">
          <strong>艳汉子</strong>
          <span>YANHANZI · ADMIN</span>
        </a>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={isActive(item.href) ? "active" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <span>{username}</span>
          <a href="/" target="_blank" rel="noreferrer">查看官网</a>
          <button type="button" onClick={logout} disabled={loggingOut}>
            {loggingOut ? "正在退出…" : "退出登录"}
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-main-inner">{children}</div>
      </main>
    </div>
  );
}
