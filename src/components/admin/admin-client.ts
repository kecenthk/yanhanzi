export type AdminResult<T> = { ok: true; data: T } | { ok: false; message: string };

async function request<T>(url: string, init: RequestInit): Promise<AdminResult<T>> {
  try {
    const response = await fetch(url, init);
    if (response.status === 401) {
      if (typeof window !== "undefined") window.location.replace("/admin/login");
      return { ok: false, message: "登录已过期，请重新登录。" };
    }
    const payload = (await response.json().catch(() => null)) as (T & { message?: string }) | null;
    if (!response.ok) {
      return { ok: false, message: payload?.message || `操作未完成（${response.status}）。` };
    }
    return { ok: true, data: (payload ?? {}) as T };
  } catch {
    return { ok: false, message: "网络异常，请稍后再试。" };
  }
}

export function adminGet<T>(url: string) {
  return request<T>(url, { method: "GET", cache: "no-store" });
}

export function adminSend<T>(url: string, method: "POST" | "PATCH" | "DELETE", body?: unknown) {
  return request<T>(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function adminUpload<T>(url: string, form: FormData) {
  return request<T>(url, { method: "POST", body: form });
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatBytes(size: number) {
  if (!size) return "—";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}
