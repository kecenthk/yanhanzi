import type { Metadata } from "next";
import Image from "next/image";
import { Lines, PageIntro, TextLink } from "@/components/ui";
import { ContactBand } from "@/components/contact-band";
import { getPageContent } from "@/lib/settings-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("about");
  return { title: content.meta.title, description: content.meta.description };
}

export default async function AboutPage() {
  const content = await getPageContent("about");
  const founder = content.founder;
  return <><PageIntro title={<Lines text={content.intro.title} />} description={content.intro.description} /><section className="wrap section-space founder-layout"><figure className="founder-photo"><Image src={founder.image} alt={founder.imageAlt} width={625} height={625} sizes="(max-width: 600px) 90vw, 35vw" preload /><figcaption className="source-note">{founder.imageNote}</figcaption></figure><div><p className="text-sm text-muted">{founder.label}</p><h2 className="section-title mt-5"><Lines text={founder.title} /></h2><p className="founder-quote">{founder.quote}</p><p className="mt-6 max-w-md text-sm leading-loose text-muted">{founder.note}</p><div className="mt-9"><TextLink href={founder.linkHref}>{founder.linkLabel}</TextLink></div></div></section><section className="question-band"><div className="wrap"><h2 className="section-title max-w-3xl"><Lines text={content.question.title} /></h2></div></section><section className="wrap section-space"><div className="section-heading"><h2 className="section-title"><Lines text={content.team.title} /></h2><p className="max-w-md text-sm text-muted">{content.team.description}</p></div><div className="support-grid">{content.team.items.map(item => <article className="support-item" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div><p className="source-note mt-8!">{content.team.sourceNote}</p></section><ContactBand /></>;
}
