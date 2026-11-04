import type { Metadata } from "next";
import { hasDatabase } from "@/lib/db";
import { listLeads } from "@/lib/leads-store";
import { LeadsManager } from "@/components/admin/leads-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "咨询线索" };

export default async function LeadsPage() {
  const leads = await listLeads();
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>咨询线索</h1>
          <p>查看官网提交的项目需求。线索仅管理员可见，请按实际跟进情况标记已读。</p>
        </div>
      </div>
      {hasDatabase() ? null : (
        <div className="admin-alert error">尚未配置数据库，暂无法读取或保存咨询线索。</div>
      )}
      <LeadsManager initialLeads={leads} databaseReady={hasDatabase()} />
    </>
  );
}
