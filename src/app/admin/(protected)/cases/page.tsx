import type { Metadata } from "next";
import { hasDatabase } from "@/lib/db";
import { listCases } from "@/lib/cases-store";
import { CasesManager } from "@/components/admin/cases-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "案例管理" };

export default async function CasesPage() {
  const cases = await listCases(true);
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>案例管理</h1>
          <p>维护案例名称、图片、空间观察与段落。草稿不会显示在前台。</p>
        </div>
        <div className="admin-page-actions">
          <a className="admin-btn" href="/cases" target="_blank" rel="noreferrer">查看案例页</a>
        </div>
      </div>
      {hasDatabase() ? null : (
        <div className="admin-alert error">尚未配置数据库，当前显示默认案例且无法保存修改。请先完成 .env 配置与数据库迁移。</div>
      )}
      <CasesManager initialCases={cases} databaseReady={hasDatabase()} />
    </>
  );
}
