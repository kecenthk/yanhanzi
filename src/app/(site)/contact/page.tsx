import type { Metadata } from "next";
import { Lines, PageIntro } from "@/components/ui";
import { ProjectForm } from "@/components/project-form";
import { getPageContent, getSiteConfig } from "@/lib/settings-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("contact");
  return { title: content.meta.title, description: content.meta.description };
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const [params, content, config] = await Promise.all([searchParams, getPageContent("contact"), getSiteConfig()]);
  const alliance = params.type === "alliance";
  const aside = content.aside;
  const contact = config.contact;
  return <><PageIntro title={<Lines text={alliance ? content.intro.allianceTitle : content.intro.projectTitle} />} description={alliance ? content.intro.allianceDescription : content.intro.projectDescription} /><section className="wrap contact-layout"><aside><div className="contact-item"><h2>{aside.phoneLabel}</h2>{contact.phone ? <a href={`tel:${contact.phone}`}>{contact.phone}</a> : <p className="text-muted">{aside.placeholder}</p>}</div><div className="contact-item"><h2>{aside.wechatLabel}</h2><p className="text-muted">{contact.wechat || aside.placeholder}</p></div><div className="contact-item"><h2>{aside.emailLabel}</h2>{contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : <p className="text-muted">{aside.placeholder}</p>}</div><div className="contact-item"><h2>{aside.visitLabel}</h2><p className="text-sm text-muted">{contact.address || aside.visitText}</p>{contact.hours ? <p className="mt-2 text-sm text-muted">{contact.hours}</p> : null}</div><p className="mt-5 text-xs leading-loose text-muted">{aside.privacyNote}</p></aside>{alliance ? <div><div className="form-notice"><span className="status-dot" /><div><p>{content.alliancePanel.noticeTitle}</p><p className="mt-3 text-sm text-muted">{content.alliancePanel.noticeText}</p></div></div><h2 className="mt-10 font-serif text-3xl">{content.alliancePanel.title}</h2><div className="mt-7 space-y-6 text-sm text-muted">{content.alliancePanel.questions.map(question => <p key={question}>{question}</p>)}</div></div> : <ProjectForm enabled={config.inquiry.enabled} content={content.form} />}</section></>;
}
