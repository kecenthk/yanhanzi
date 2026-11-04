import type { Metadata } from "next";
import { Lines, PageIntro, TextLink } from "@/components/ui";
import { ContactBand } from "@/components/contact-band";
import { getPageContent } from "@/lib/settings-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("method");
  return { title: content.meta.title, description: content.meta.description };
}

export default async function MethodPage() {
  const content = await getPageContent("method");
  return <><PageIntro title={<Lines text={content.intro.title} />} description={content.intro.description} /><section className="wrap pb-20">{content.methods.map((method, index) => <article id={index === 3 ? "storage" : `dimension-${index + 1}`} className="content-row" key={method.no}><span className="row-no">{method.no}</span><div><h2>{method.name}</h2><p className="mt-4 text-sm text-muted">{method.summary}</p></div><div><h3 className="font-serif text-2xl">{method.question}</h3><p className="mt-5 text-sm leading-loose text-muted">{method.detail}</p><ul>{method.points.map(point => <li key={point}>{point}</li>)}</ul></div></article>)}</section><section className="wrap pb-20"><div className="info-note">{content.note}</div><div className="mt-8"><TextLink href={content.linkHref}>{content.linkLabel}</TextLink></div></section><ContactBand /></>;
}
