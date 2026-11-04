"use client";

import { useEffect, useState } from "react";
import type { LeadItem } from "@/lib/types";
import { adminSend, formatDateTime } from "./admin-client";

const sourceLabels: Record<string, string> = {
  contact: "项目沟通",
  alliance: "联盟合作",
};

export function LeadsManager({ initialLeads, databaseReady }: { initialLeads: LeadItem[]; databaseReady: boolean }) {
  const [leads, setLeads] = useState(initialLeads);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selected, setSelected] = useState<LeadItem | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  const keyword = query.trim().toLowerCase();
  const filtered = leads.filter((lead) => {
    if (filter === "unread" && lead.isRead) return false;
    if (!keyword) return true;
    return [lead.name, lead.phone, lead.city, lead.houseType, lead.message].some((value) => value.toLowerCase().includes(keyword));
  });
  const unread = leads.filter((lead) => !lead.isRead).length;

  async function toggleRead(lead: LeadItem) {
    setError("");
    const next = !lead.isRead;
    const result = await adminSend<unknown>(`/api/admin/leads/${lead.id}`, "PATCH", { isRead: next });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setLeads((current) => current.map((item) => (item.id === lead.id ? { ...item, isRead: next } : item)));
    setSelected((current) => (current && current.id === lead.id ? { ...current, isRead: next } : current));
  }

  async function remove(lead: LeadItem) {
    if (!window.confirm(`确定删除「${lead.name}」的咨询记录吗？此操作不可恢复。`)) return;
    setError("");
    const result = await adminSend<unknown>(`/api/admin/leads/${lead.id}`, "DELETE");
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setLeads((current) => current.filter((item) => item.id !== lead.id));
    setSelected((current) => (current && current.id === lead.id ? null : current));
    setNotice("咨询记录已删除。");
  }

  return (
    <>
      {error ? <div className="admin-alert error">{error}</div> : null}
      {notice ? <div className="admin-alert">{notice}</div> : null}

      <div className="admin-toolbar" style={{ marginTop: 18 }}>
        <input
          className="admin-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索称呼、电话、城市或需求"
          aria-label="搜索咨询线索"
        />
        <button
          type="button"
          className={filter === "all" ? "admin-btn-primary" : "admin-btn"}
          onClick={() => setFilter("all")}
        >
          全部 {leads.length}
        </button>
        <button
          type="button"
          className={filter === "unread" ? "admin-btn-primary" : "admin-btn"}
          onClick={() => setFilter("unread")}
        >
          未读 {unread}
        </button>
        <span className="grow" />
        <a className="admin-btn" href="/api/admin/leads/export" download>导出 CSV</a>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            {leads.length === 0 ? "暂无咨询线索。在站点设置中开启咨询接收后，提交内容会显示在这里。" : "没有匹配的线索。"}
          </div>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>提交时间</th>
                <th>称呼与电话</th>
                <th>城市</th>
                <th>项目方向</th>
                <th>来源</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id}>
                  <td className="nowrap">{formatDateTime(lead.createdAt)}</td>
                  <td>
                    <div className="cell-title">{lead.name}</div>
                    <div className="cell-sub">{lead.phone}</div>
                  </td>
                  <td>{lead.city || "—"}</td>
                  <td>{lead.houseType || lead.intent || "—"}</td>
                  <td>{sourceLabels[lead.source] || lead.source}</td>
                  <td className="nowrap">
                    <span className={lead.isRead ? "admin-badge" : "admin-badge unread"}>{lead.isRead ? "已读" : "未读"}</span>
                  </td>
                  <td>
                    <div className="cell-actions">
                      <button type="button" className="admin-btn admin-btn-sm" onClick={() => setSelected(lead)}>查看</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected ? (
        <>
          <div className="admin-drawer-mask" />
          <aside className="admin-drawer" role="dialog" aria-modal="true" aria-label="咨询详情">
            <div className="admin-drawer-head">
              <h2>咨询详情</h2>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setSelected(null)}>关闭</button>
            </div>
            <div className="admin-drawer-body">
              <div className="admin-grid cols-2">
                <div className="admin-detail-row">
                  <div className="row-head"><span>称呼</span></div>
                  <strong>{selected.name}</strong>
                </div>
                <div className="admin-detail-row">
                  <div className="row-head"><span>联系电话</span></div>
                  <a href={`tel:${selected.phone}`} style={{ color: "var(--admin-accent)" }}>{selected.phone}</a>
                </div>
                <div className="admin-detail-row">
                  <div className="row-head"><span>所在城市</span></div>
                  <span>{selected.city || "未填写"}</span>
                </div>
                <div className="admin-detail-row">
                  <div className="row-head"><span>房屋面积</span></div>
                  <span>{selected.area || "未填写"}</span>
                </div>
                <div className="admin-detail-row">
                  <div className="row-head"><span>项目方向</span></div>
                  <span>{selected.houseType || "未填写"}</span>
                </div>
                <div className="admin-detail-row">
                  <div className="row-head"><span>计划时间</span></div>
                  <span>{selected.timing || "未填写"}</span>
                </div>
                <div className="admin-detail-row">
                  <div className="row-head"><span>咨询类型</span></div>
                  <span>{selected.intent || "未填写"}</span>
                </div>
                <div className="admin-detail-row">
                  <div className="row-head"><span>来源</span></div>
                  <span>{sourceLabels[selected.source] || selected.source}</span>
                </div>
                <div className="admin-detail-row span-2">
                  <div className="row-head"><span>提交时间</span></div>
                  <span>{formatDateTime(selected.createdAt)}</span>
                </div>
                <div className="admin-detail-row span-2">
                  <div className="row-head"><span>需求描述</span></div>
                  <p className="admin-lead-message">{selected.message || "未填写"}</p>
                </div>
              </div>
              <div className="admin-alert">
                咨询信息仅用于项目沟通与服务匹配。请勿将联系方式导出到公开渠道或用于未约定的营销推送。
              </div>
            </div>
            <div className="admin-drawer-foot split">
              <button type="button" className="admin-btn admin-btn-danger" onClick={() => remove(selected)} disabled={!databaseReady}>
                删除记录
              </button>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" className="admin-btn" onClick={() => setSelected(null)}>关闭</button>
                <button type="button" className="admin-btn-primary" onClick={() => toggleRead(selected)} disabled={!databaseReady}>
                  {selected.isRead ? "标记为未读" : "标记为已读"}
                </button>
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
