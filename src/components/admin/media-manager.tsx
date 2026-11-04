"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { MediaItem } from "@/lib/types";
import { adminGet, adminSend, adminUpload, formatBytes, formatDateTime } from "./admin-client";

export function MediaManager({
  initialMedia,
  databaseReady,
  maxBytes,
}: {
  initialMedia: MediaItem[];
  databaseReady: boolean;
  maxBytes: number;
}) {
  const [media, setMedia] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxMb = Math.max(1, Math.round(maxBytes / 1024 / 1024));

  async function refresh() {
    const result = await adminGet<{ media: MediaItem[] }>("/api/admin/media");
    if (result.ok) setMedia(result.data.media);
    else setError(result.message);
  }

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    setNotice("");
    let uploaded = 0;
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      const result = await adminUpload<{ media: MediaItem }>("/api/admin/media", form);
      if (!result.ok) {
        setError(result.message);
        break;
      }
      uploaded += 1;
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    if (uploaded > 0) {
      setNotice(`已上传 ${uploaded} 张图片。`);
      await refresh();
    }
  }

  async function copy(item: MediaItem) {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      setNotice(`已复制：${item.url}`);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setError("复制失败，请手动选择并复制图片地址。");
    }
  }

  async function remove(item: MediaItem) {
    if (!window.confirm(`确定删除「${item.name}」吗？已引用该图片的页面会显示为无图。`)) return;
    setError("");
    const result = await adminSend<unknown>(`/api/admin/media/${item.id}`, "DELETE");
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setMedia((current) => current.filter((entry) => entry.id !== item.id));
    setNotice("素材已删除。");
  }

  return (
    <>
      {error ? <div className="admin-alert error">{error}</div> : null}
      {notice ? <div className="admin-alert">{notice}</div> : null}

      <div className="admin-card" style={{ marginTop: 18 }}>
        <div className="admin-card-head">
          <h2>上传图片</h2>
          <span className="admin-field-hint">支持 JPG、PNG、WebP、GIF、AVIF，单张不超过 {maxMb}MB</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button type="button" className="admin-btn-primary" onClick={() => inputRef.current?.click()} disabled={uploading || !databaseReady}>
            {uploading ? "正在上传…" : "选择图片上传"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            multiple
            hidden
            onChange={(event) => void uploadFiles(event.target.files)}
          />
          <span className="admin-field-hint">上传后可复制站内地址，填入案例图片或页面文案的图片字段。</span>
        </div>
      </div>

      <section style={{ marginTop: 24 }}>
        <div className="admin-card-head">
          <h2>全部素材</h2>
          <span className="admin-field-hint">{media.length} 张</span>
        </div>
        {media.length === 0 ? (
          <div className="admin-card">
            <div className="admin-empty">还没有上传素材。上传图片后可以在这里复制地址。</div>
          </div>
        ) : (
          <div className="admin-media-grid">
            {media.map((item) => (
              <figure className="admin-media-item" key={item.id} style={{ margin: 0 }}>
                <div className="thumb">
                  <Image src={item.url} alt={item.name} fill unoptimized style={{ objectFit: "cover" }} />
                </div>
                <figcaption className="admin-media-meta">
                  <span className="name" title={item.name}>{item.name}</span>
                  <span className="admin-media-name">{item.url}</span>
                  <span className="admin-field-hint">{formatBytes(item.size)} · {formatDateTime(item.createdAt)}</span>
                  <span className="actions">
                    <button type="button" className="admin-btn admin-btn-sm" onClick={() => copy(item)}>
                      {copiedId === item.id ? "已复制" : "复制地址"}
                    </button>
                    <button type="button" className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => remove(item)} disabled={!databaseReady}>
                      删除
                    </button>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
