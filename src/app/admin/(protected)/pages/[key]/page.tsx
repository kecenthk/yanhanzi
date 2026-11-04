import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageKeys, pageMeta, type PageKey } from "@/lib/page-content-defaults";
import { getPageContent } from "@/lib/settings-store";
import { hasDatabase } from "@/lib/db";
import { PageEditor } from "@/components/admin/page-editor";

export const dynamic = "force-dynamic";

function isPageKey(value: string): value is PageKey {
  return (pageKeys as readonly string[]).includes(value);
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  return { title: isPageKey(key) ? `${pageMeta[key].label}文案` : "页面文案" };
}

export default async function PageContentPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!isPageKey(key)) notFound();
  const content = await getPageContent(key);
  return (
    <PageEditor
      pageKey={key}
      pageLabel={pageMeta[key].label}
      pagePath={pageMeta[key].path}
      initialContent={content}
      databaseReady={hasDatabase()}
    />
  );
}
