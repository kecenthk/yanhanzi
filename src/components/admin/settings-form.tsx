"use client";

import { useEffect, useState } from "react";
import type { SiteConfig } from "@/lib/types";
import { adminSend } from "./admin-client";

export function SettingsForm({ initialConfig, databaseReady }: { initialConfig: SiteConfig; databaseReady: boolean }) {
  const [config, setConfig] = useState(initialConfig);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initialConfig));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const dirty = JSON.stringify(config) !== baseline;

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function setField<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
    setConfig((current) => ({ ...current, [key]: value }));
    setNotice("");
  }

  function setSeo<K extends keyof SiteConfig["seo"]>(key: K, value: string) {
    setConfig((current) => ({ ...current, seo: { ...current.seo, [key]: value } }));
    setNotice("");
  }

  function setContact<K extends keyof SiteConfig["contact"]>(key: K, value: string) {
    setConfig((current) => ({ ...current, contact: { ...current.contact, [key]: value } }));
    setNotice("");
  }

  async function save() {
    setSaving(true);
    setError("");
    setNotice("");
    const result = await adminSend<{ config: SiteConfig }>("/api/admin/settings", "PATCH", { config });
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setConfig(result.data.config);
    setBaseline(JSON.stringify(result.data.config));
    setNotice("站点设置已保存，前台即时生效。");
  }

  function revert() {
    if (!dirty) return;
    if (!window.confirm("放弃当前未保存的修改吗？")) return;
    setConfig(JSON.parse(baseline) as SiteConfig);
    setError("");
    setNotice("已撤销未保存的修改。");
  }

  return (
    <>
      {error ? <div className="admin-alert error">{error}</div> : null}

      <div className="admin-card" style={{ marginTop: 18 }}>
        <div className="admin-card-head"><h2>基本信息</h2></div>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>站点名称</span>
            <input value={config.name} onChange={(event) => setField("name", event.target.value)} />
          </label>
          <label className="admin-field">
            <span>正式网址</span>
            <input value={config.url} onChange={(event) => setField("url", event.target.value)} placeholder="https://example.com" />
          </label>
          <label className="admin-field span-2">
            <span>站点描述</span>
            <textarea rows={3} value={config.description} onChange={(event) => setField("description", event.target.value)} />
          </label>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head"><h2>SEO 与分享</h2></div>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>默认页面标题</span>
            <input value={config.seo.defaultTitle} onChange={(event) => setSeo("defaultTitle", event.target.value)} />
          </label>
          <label className="admin-field">
            <span>分享图地址</span>
            <input value={config.seo.ogImage} onChange={(event) => setSeo("ogImage", event.target.value)} placeholder="/images/… 或 https://…" />
          </label>
          <label className="admin-field span-2">
            <span>默认页面描述</span>
            <textarea rows={3} value={config.seo.defaultDescription} onChange={(event) => setSeo("defaultDescription", event.target.value)} />
          </label>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head"><h2>公开联系方式</h2></div>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>项目咨询电话</span>
            <input value={config.contact.phone} onChange={(event) => setContact("phone", event.target.value)} placeholder="留空则显示待配置" />
          </label>
          <label className="admin-field">
            <span>微信 / 企业微信</span>
            <input value={config.contact.wechat} onChange={(event) => setContact("wechat", event.target.value)} />
          </label>
          <label className="admin-field">
            <span>联系邮箱</span>
            <input value={config.contact.email} onChange={(event) => setContact("email", event.target.value)} />
          </label>
          <label className="admin-field">
            <span>服务时间</span>
            <input value={config.contact.hours} onChange={(event) => setContact("hours", event.target.value)} />
          </label>
          <label className="admin-field span-2">
            <span>接待地址</span>
            <input value={config.contact.address} onChange={(event) => setContact("address", event.target.value)} />
          </label>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head"><h2>咨询接收</h2></div>
        <label className="admin-check">
          <input
            type="checkbox"
            checked={config.inquiry.enabled}
            onChange={(event) => setField("inquiry", { ...config.inquiry, enabled: event.target.checked })}
          />
          <span>开启官网咨询表单提交</span>
        </label>
        <div className="admin-form-grid" style={{ marginTop: 16 }}>
          <label className="admin-field span-2">
            <span>咨询状态说明</span>
            <input value={config.inquiry.note} onChange={(event) => setField("inquiry", { ...config.inquiry, note: event.target.value })} />
          </label>
        </div>
        <div className="admin-alert" style={{ marginTop: 16 }}>
          开启后，联系页会显示提交按钮，提交内容保存到「咨询线索」，仅管理员可见。请先完成数据库迁移，并确认隐私说明、信息处理方式与跟进负责人后再开启。
        </div>
      </div>

      <div className="admin-sticky-actions">
        <span className="status">{dirty ? "有未保存的修改" : notice || "当前设置已保存"}</span>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="admin-btn" onClick={revert} disabled={!dirty || saving}>撤销修改</button>
          <button type="button" className="admin-btn-primary" onClick={save} disabled={!databaseReady || saving}>
            {saving ? "保存中…" : "保存设置"}
          </button>
        </div>
      </div>
    </>
  );
}
