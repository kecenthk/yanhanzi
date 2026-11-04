import type { Metadata } from "next";
import { ButtonLink, Lines } from "@/components/ui";
import { ContactBand } from "@/components/contact-band";
import { getPageContent } from "@/lib/settings-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("alliance");
  return { title: content.meta.title, description: content.meta.description };
}

export default async function AlliancePage() {
  const content = await getPageContent("alliance");
  return <><section className="alliance-intro"><div className="wrap"><h1 className="page-title"><Lines text={content.intro.title} /></h1><p className="mt-8"><Lines text={content.intro.text} /></p><div className="mt-10"><ButtonLink href="/contact?type=alliance" light outline>{content.intro.ctaLabel}</ButtonLink></div></div></section><section className="wrap section-space"><div className="section-heading"><h2 className="section-title"><Lines text={content.support.title} /></h2><p className="max-w-md text-sm text-muted">{content.support.description}</p></div><div className="support-grid">{content.support.items.map(item => <article className="support-item" key={item.no}><span className="method-no">{item.no}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section><section className="wrap section-space border-t border-line"><div className="method-section"><h2 className="section-title">{content.fit.title}</h2><div className="editorial">{content.fit.items.map((item, index) => <div key={item.title}><h3 className={index === 0 ? "mt-0!" : undefined}>{item.title}</h3><p>{item.body}</p></div>)}</div></div></section><section className="wrap pb-20"><div className="info-note">{content.note}</div><div className="mt-10 grid gap-6 md:grid-cols-3">{content.steps.map((item, index) => <div key={item} className="border-t border-line pt-5"><span className="font-serif text-xl text-muted">0{index + 1}</span><p className="mt-3 text-sm">{item}</p></div>)}</div></section><ContactBand alliance /></>;
}
