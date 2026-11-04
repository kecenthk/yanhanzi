import type { Metadata } from "next";
import { hasDatabase } from "@/lib/db";
import { getSiteConfig } from "@/lib/settings-store";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "站点设置" };

export default async function SettingsPage() {
  const config = await getSiteConfig();
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>站点设置</h1>
          <p>维护站点信息、联系渠道与咨询接收开关。保存后前台即时生效。</p>
        </div>
      </div>
      {hasDatabase() ? null : (
        <div className="admin-alert error">尚未配置数据库，当前显示环境变量默认值，无法保存修改。</div>
      )}
      <SettingsForm initialConfig={config} databaseReady={hasDatabase()} />
    </>
  );
}
