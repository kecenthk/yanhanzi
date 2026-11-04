"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminSend } from "./admin-client";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!configured) {
      setMessage("请先在服务器配置管理员账号与密钥，然后重启服务。");
      return;
    }
    setPending(true);
    setMessage(null);
    const result = await adminSend<{ ok: boolean }>("/api/admin/login", "POST", { username, password });
    setPending(false);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <label className="admin-field">
        <span>管理员账号</span>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
          placeholder="输入账号"
        />
      </label>
      <label className="admin-field">
        <span>密码</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          placeholder="输入密码"
        />
      </label>
      {message ? <div className="admin-alert error">{message}</div> : null}
      <button type="submit" className="admin-btn-primary" disabled={pending || !configured}>
        {pending ? "正在登录…" : "登录后台"}
      </button>
    </form>
  );
}
