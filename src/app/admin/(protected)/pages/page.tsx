import type { Metadata } from "next";
import { pageKeys, pageMeta } from "@/lib/page-content-defaults";
import { hasDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "页面文案" };

export default function PagesPage() {
  const groups = ["全站", "页面文案"] as const;
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>页面文案</h1>
          <p>官网所有页面文案、栏目与链接集中在这里维护。保存后前台即时生效。</p>
        </div>
      </div>
      {hasDatabase() ? null : (
        <div className="admin-alert error">尚未配置数据库，当前展示默认文案且无法保存修改。</div>
      )}
      {groups.map((group) => (
        <section key={group} style={{ marginTop: 24 }}>
          <div className="admin-card-head" style={{ marginBottom: 14 }}>
            <h2>{group}</h2>
          </div>
          <div className="admin-page-grid">
            {pageKeys
              .filter((key) => pageMeta[key].group === group)
              .map((key) => (
                <a key={key} className="admin-card" href={`/admin/pages/${key}`}>
                  <h2>{pageMeta[key].label}</h2>
                  <div className="path">{pageMeta[key].path}</div>
                  <p className="desc">{pageMeta[key].description}</p>
                  <span className="go">编辑文案 →</span>
                </a>
              ))}
          </div>
        </section>
      ))}
    </>
  );
}
