import type { Metadata } from "next";
import { hasDatabase } from "@/lib/db";
import { listMedia } from "@/lib/leads-store";
import { MediaManager } from "@/components/admin/media-manager";
import { uploadMaxBytes } from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "素材库" };

export default async function MediaPage() {
  const media = await listMedia();
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>素材库</h1>
          <p>上传案例与页面图片，复制站内地址后填入案例或页面文案。</p>
        </div>
      </div>
      {hasDatabase() ? null : (
        <div className="admin-alert error">尚未配置数据库，暂无法保存上传记录。请先完成数据库迁移。</div>
      )}
      <MediaManager initialMedia={media} databaseReady={hasDatabase()} maxBytes={uploadMaxBytes()} />
    </>
  );
}
