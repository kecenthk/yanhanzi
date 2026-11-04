"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CaseItem } from "@/lib/types";
import { adminGet, adminSend, adminUpload } from "./admin-client";

type Draft = {
  id: number | null;
  slug: string;
  no: string;
  name: string;
  title: string;
  location: string;
  image: string;
  width: string;
  height: string;
  description: string;
  observation: string;
  details: { title: string; body: string }[];
  published: boolean;
  sort: string;
};

function toDraft(item?: CaseItem): Draft {
  return {
    id: item?.id ?? null,
    slug: item?.slug ?? "",
    no: item?.no ?? "",
    name: item?.name ?? "",
    title: item?.title ?? "",
    location: item?.location ?? "",
    image: item?.image ?? "",
    width: String(item?.width ?? 1200),
    height: String(item?.height ?? 800),
    description: item?.description ?? "",
    observation: item?.observation ?? "",
    details: item ? item.details.map((detail) => ({ ...detail })) : [],
    published: item?.published ?? false,
    sort: String(item?.sort ?? 0),
  };
}

export function CasesManager({ initialCases, databaseReady }: { initialCases: CaseItem[]; databaseReady: boolean }) {
  const [cases, setCases] = useState(initialCases);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [baseline, setBaseline] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [listError, setListError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const dirty = draft !== null && JSON.stringify(draft) !== baseline;

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  useEffect(() => {
    if (!draft) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (dirty && !window.confirm("有未保存的修改，确定关闭吗？")) return;
      setDraft(null);
      setFormError("");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [draft, dirty]);

  function openCreate() {
    const next = toDraft();
    setDraft(next);
    setBaseline(JSON.stringify(next));
    setNotice("");
    setFormError("");
  }

  function openEdit(item: CaseItem) {
    const next = toDraft(item);
    setDraft(next);
    setBaseline(JSON.stringify(next));
    setNotice("");
    setFormError("");
  }

  function closeDrawer() {
    if (dirty && !window.confirm("有未保存的修改，确定关闭吗？")) return;
    setDraft(null);
    setFormError("");
  }

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  function updateDetail(index: number, key: "title" | "body", value: string) {
    setDraft((current) =>
      current
        ? { ...current, details: current.details.map((detail, i) => (i === index ? { ...detail, [key]: value } : detail)) }
        : current
    );
  }

  async function refresh() {
    const result = await adminGet<{ cases: CaseItem[] }>("/api/admin/cases");
    if (result.ok) setCases(result.data.cases);
    else setListError(result.message);
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    setFormError("");
    const payload = {
      slug: draft.slug.trim(),
      no: draft.no.trim(),
      name: draft.name.trim(),
      title: draft.title.trim(),
      location: draft.location.trim(),
      image: draft.image.trim(),
      width: Number(draft.width) || 1200,
      height: Number(draft.height) || 800,
      description: draft.description,
      observation: draft.observation,
      details: draft.details.filter((detail) => detail.title.trim() || detail.body.trim()),
      published: draft.published,
      sort: Number(draft.sort) || 0,
    };
    const result = draft.id
      ? await adminSend<unknown>(`/api/admin/cases/${draft.id}`, "PATCH", payload)
      : await adminSend<unknown>("/api/admin/cases", "POST", payload);
    setSaving(false);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    setNotice(draft.id ? "案例已更新。" : "案例已创建。");
    setDraft(null);
    await refresh();
  }

  async function remove(item: CaseItem) {
    if (!window.confirm(`确定删除案例「${item.name}」吗？此操作不可恢复。`)) return;
    setListError("");
    const result = await adminSend<unknown>(`/api/admin/cases/${item.id}`, "DELETE");
    if (!result.ok) {
      setListError(result.message);
      return;
    }
    setNotice("案例已删除。");
    setDraft((current) => (current && current.id === item.id ? null : current));
    await refresh();
  }

  async function togglePublished(item: CaseItem) {
    setListError("");
    const result = await adminSend<unknown>(`/api/admin/cases/${item.id}`, "PATCH", { published: !item.published });
    if (!result.ok) {
      setListError(result.message);
      return;
    }
    setNotice(item.published ? `「${item.name}」已下架。` : `「${item.name}」已发布到前台。`);
    await refresh();
  }

  async function upload(file: File) {
    setUploading(true);
    setFormError("");
    const form = new FormData();
    form.append("file", file);
    const result = await adminUpload<{ media: { url: string } }>("/api/admin/media", form);
    setUploading(false);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    update("image", result.data.media.url);
  }

  const keyword = query.trim().toLowerCase();
  const filtered = cases.filter((item) =>
    keyword ? [item.name, item.title, item.slug, item.location].some((value) => value.toLowerCase().includes(keyword)) : true
  );

  return (
    <>
      {listError ? <div className="admin-alert error">{listError}</div> : null}
      {notice ? <div className="admin-alert">{notice}</div> : null}

      <div className="admin-toolbar" style={{ marginTop: 18 }}>
        <input
          className="admin-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索案例名称、标题或标识"
          aria-label="搜索案例"
        />
        <span className="grow" />
        <button type="button" className="admin-btn-primary" onClick={openCreate} disabled={!databaseReady}>
          新建案例
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">{cases.length === 0 ? "还没有案例。点击「新建案例」开始添加。" : "没有匹配的案例。"}</div>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>案例</th>
                <th>标识</th>
                <th>位置</th>
                <th>状态</th>
                <th>排序</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      {item.image ? (
                        <div className="admin-thumb">
                          <Image src={item.image} alt={item.name} fill unoptimized style={{ objectFit: "cover" }} />
                        </div>
                      ) : (
                        <div className="admin-thumb" />
                      )}
                      <div>
                        <div className="cell-title">{item.name}</div>
                        <div className="cell-sub">{item.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="nowrap">{item.slug}</td>
                  <td>{item.location || "—"}</td>
                  <td className="nowrap">
                    <span className={item.published ? "admin-badge on" : "admin-badge off"}>
                      {item.published ? "已发布" : "草稿"}
                    </span>
                  </td>
                  <td>{item.sort}</td>
                  <td>
                    <div className="cell-actions">
                      <button type="button" className="admin-btn admin-btn-sm" onClick={() => openEdit(item)} disabled={!databaseReady}>
                        编辑
                      </button>
                      <button type="button" className="admin-btn admin-btn-sm" onClick={() => togglePublished(item)} disabled={!databaseReady}>
                        {item.published ? "下架" : "发布"}
                      </button>
                      <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => remove(item)} disabled={!databaseReady}>
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {draft ? (
        <>
          <div className="admin-drawer-mask" />
          <aside className="admin-drawer" role="dialog" aria-modal="true" aria-label={draft.id ? "编辑案例" : "新建案例"}>
            <div className="admin-drawer-head">
              <h2>{draft.id ? "编辑案例" : "新建案例"}</h2>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={closeDrawer}>关闭</button>
            </div>
            <div className="admin-drawer-body">
              {formError ? <div className="admin-alert error">{formError}</div> : null}

              <div className="admin-form-grid">
                <label className="admin-field">
                  <span>案例名称</span>
                  <input value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="例如：南城悦府" />
                </label>
                <label className="admin-field">
                  <span>案例标识（英文与连字符）</span>
                  <input value={draft.slug} onChange={(event) => update("slug", event.target.value)} placeholder="nancheng-yuefu" />
                </label>
                <label className="admin-field">
                  <span>案例标题</span>
                  <input value={draft.title} onChange={(event) => update("title", event.target.value)} placeholder="列表与详情页标题" />
                </label>
                <label className="admin-field">
                  <span>序号</span>
                  <input value={draft.no} onChange={(event) => update("no", event.target.value)} placeholder="01" />
                </label>
                <label className="admin-field">
                  <span>项目位置</span>
                  <input value={draft.location} onChange={(event) => update("location", event.target.value)} placeholder="例如：东莞 · 南城" />
                </label>
                <label className="admin-field">
                  <span>排序（数字越小越靠前）</span>
                  <input value={draft.sort} onChange={(event) => update("sort", event.target.value)} inputMode="numeric" />
                </label>
                <div className="admin-field span-2">
                  <span>案例图片</span>
                  <div className="admin-image-row" style={{ marginTop: 6 }}>
                    {draft.image ? (
                      <div className="admin-thumb">
                        <Image src={draft.image} alt="" fill unoptimized style={{ objectFit: "cover" }} />
                      </div>
                    ) : null}
                    <input
                      className="admin-input"
                      value={draft.image}
                      onChange={(event) => update("image", event.target.value)}
                      placeholder="/uploads/xxx.jpg、/images/xxx.jpg 或 https://…"
                    />
                    <button type="button" className="admin-btn admin-btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                      {uploading ? "上传中…" : "上传"}
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void upload(file);
                        event.currentTarget.value = "";
                      }}
                    />
                  </div>
                  <small>上传后会自动写入地址；也可在素材库复制已有图片地址。</small>
                </div>
                <label className="admin-field">
                  <span>图片宽度（像素）</span>
                  <input value={draft.width} onChange={(event) => update("width", event.target.value)} inputMode="numeric" />
                </label>
                <label className="admin-field">
                  <span>图片高度（像素）</span>
                  <input value={draft.height} onChange={(event) => update("height", event.target.value)} inputMode="numeric" />
                </label>
                <label className="admin-field span-2">
                  <span>案例简述</span>
                  <textarea rows={3} value={draft.description} onChange={(event) => update("description", event.target.value)} />
                </label>
                <label className="admin-field span-2">
                  <span>空间观察</span>
                  <textarea rows={4} value={draft.observation} onChange={(event) => update("observation", event.target.value)} />
                </label>
                <label className="admin-check span-2">
                  <input type="checkbox" checked={draft.published} onChange={(event) => update("published", event.target.checked)} />
                  <span>发布到前台（不勾选则保存为草稿）</span>
                </label>
              </div>

              <div className="admin-editor-group">
                <h3>案例详情段落 <small>{draft.details.length} / 20</small></h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {draft.details.map((detail, index) => (
                    <div className="admin-detail-row" key={index}>
                      <div className="row-head">
                        <span>第 {index + 1} 段</span>
                        <button
                          type="button"
                          className="admin-btn admin-btn-sm admin-btn-danger"
                          onClick={() => update("details", draft.details.filter((_, i) => i !== index))}
                        >
                          删除
                        </button>
                      </div>
                      <label className="admin-field">
                        <span>段落标题</span>
                        <input value={detail.title} onChange={(event) => updateDetail(index, "title", event.target.value)} />
                      </label>
                      <label className="admin-field">
                        <span>段落正文</span>
                        <textarea rows={3} value={detail.body} onChange={(event) => updateDetail(index, "body", event.target.value)} />
                      </label>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-sm"
                  style={{ marginTop: 10 }}
                  onClick={() => update("details", [...draft.details, { title: "", body: "" }])}
                  disabled={draft.details.length >= 20}
                >
                  + 添加段落
                </button>
              </div>
            </div>
            <div className="admin-drawer-foot split">
              <div>
                {draft.id ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger"
                    onClick={() => {
                      const item = cases.find((entry) => entry.id === draft.id);
                      if (item) void remove(item);
                    }}
                    disabled={saving}
                  >
                    删除案例
                  </button>
                ) : null}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" className="admin-btn" onClick={closeDrawer}>取消</button>
                <button type="button" className="admin-btn-primary" onClick={save} disabled={saving || !databaseReady}>
                  {saving ? "保存中…" : draft.id ? "保存修改" : "创建案例"}
                </button>
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
