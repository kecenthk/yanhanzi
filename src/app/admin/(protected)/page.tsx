import type { Metadata } from "next";
import Link from "next/link";
import { hasDatabase } from "@/lib/db";
import { listCases } from "@/lib/cases-store";
import { listLeads, listMedia } from "@/lib/leads-store";
import { getSiteConfig } from "@/lib/settings-store";
import { formatDateTime } from "@/components/admin/admin-client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "概览" };

export default async function DashboardPage() {
  const [cases, leads, media, config] = await Promise.all([
    listCases(true),
    listLeads(),
    listMedia(),
    getSiteConfig(),
  ]);
  const published = cases.filter((item) => item.published).length;
  const unread = leads.filter((item) => !item.isRead).length;
  const databaseReady = hasDatabase();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>后台概览</h1>
          <p>在这里维护官网内容。保存后前台即时生效。</p>
        </div>
        <div className="admin-page-actions">
          <a className="admin-btn" href="/" target="_blank" rel="noreferrer">查看官网</a>
        </div>
      </div>

      {databaseReady ? null : (
        <div className="admin-alert error">
          尚未配置 DATABASE_URL。当前前台展示默认内容，后台修改无法保存。请按 .env.example 配置数据库并执行迁移与种子后重启服务。
        </div>
      )}

      <div className="admin-grid cols-4" style={{ marginTop: 18 }}>
        <div className="admin-stat">
          <span>案例总数</span>
          <strong>{cases.length}</strong>
          <small>已发布 {published} 个</small>
        </div>
        <div className="admin-stat">
          <span>未读线索</span>
          <strong>{unread}</strong>
          <small>共 {leads.length} 条咨询</small>
        </div>
        <div className="admin-stat">
          <span>素材数量</span>
          <strong>{media.length}</strong>
          <small>本地上传图片</small>
        </div>
        <div className="admin-stat">
          <span>咨询接收</span>
          <strong style={{ fontSize: 20, marginTop: 12 }}>{config.inquiry.enabled ? "已开启" : "待配置"}</strong>
          <small>{config.inquiry.note || "联系页暂不提交"}</small>
        </div>
      </div>

      <div className="admin-grid cols-2" style={{ marginTop: 18 }}>
        <div className="admin-card">
          <div className="admin-card-head">
            <h2>最近咨询</h2>
            <a className="admin-btn admin-btn-sm" href="/admin/leads">全部线索</a>
          </div>
          {leads.length === 0 ? (
            <div className="admin-empty">暂无咨询线索。咨询通道开启后，提交内容会显示在这里。</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table" style={{ minWidth: 0 }}>
                <thead>
                  <tr><th>称呼</th><th>联系方式</th><th>时间</th><th>状态</th></tr>
                </thead>
                <tbody>
                  {leads.slice(0, 5).map((lead) => (
                    <tr key={lead.id}>
                      <td className="cell-title">{lead.name}</td>
                      <td>{lead.phone}</td>
                      <td className="nowrap">{formatDateTime(lead.createdAt)}</td>
                      <td><span className={lead.isRead ? "admin-badge" : "admin-badge unread"}>{lead.isRead ? "已读" : "未读"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-head"><h2>快捷入口</h2></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link className="admin-btn" href="/admin/cases">新建与维护案例</Link>
            <Link className="admin-btn" href="/admin/pages/home">编辑首页文案</Link>
            <Link className="admin-btn" href="/admin/pages/global">编辑导航与页脚</Link>
            <Link className="admin-btn" href="/admin/media">上传与复制素材地址</Link>
            <Link className="admin-btn" href="/admin/settings">配置联系方式与咨询开关</Link>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 18 }}>
        <div className="admin-card-head"><h2>发布提示</h2></div>
        <ul style={{ margin: 0, paddingLeft: 18, color: "var(--admin-muted)", fontSize: 13, lineHeight: 2 }}>
          <li>案例默认保存为草稿。勾选「发布到前台」后才会出现在案例列表与首页。</li>
          <li>页面文案保存后前台立即读取新内容；点击「恢复默认」会覆盖当前已保存的修改。</li>
          <li>咨询接收默认关闭。确认数据库迁移、隐私说明与跟进负责人后再在站点设置中开启。</li>
        </ul>
      </div>
    </>
  );
}
