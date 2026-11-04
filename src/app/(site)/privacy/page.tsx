import type { Metadata } from "next";
import { Lines, PageIntro } from "@/components/ui";
import { getPageContent, getSiteConfig } from "@/lib/settings-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("privacy");
  return { title: content.meta.title, description: content.meta.description, robots: { index: false, follow: true } };
}

export default async function PrivacyPage() {
  const [content, config] = await Promise.all([getPageContent("privacy"), getSiteConfig()]);
  return <><PageIntro title={<Lines text={content.intro.title} />} description={content.intro.description} /><article className="wrap section-space editorial max-w-4xl!"><p className="info-note">当前咨询接收：{config.inquiry.enabled ? "已开启，提交内容保存在官网后台。" : "待配置，暂不接收线上提交。"}</p>{content.sections.map(section => <div key={section.title}><h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>)}</article></>;
}
