import type { Metadata } from "next";
import { Lines, PageIntro } from "@/components/ui";
import { ContactBand } from "@/components/contact-band";
import { getPageContent } from "@/lib/settings-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("services");
  return { title: content.meta.title, description: content.meta.description };
}

export default async function ServicesPage() {
  const content = await getPageContent("services");
  return <><PageIntro title={<Lines text={content.intro.title} />} description={content.intro.description} /><section className="wrap section-space service-types">{content.types.map(item => <article className="service-type" id={item.id} key={item.id}><p className="text-xs tracking-widest text-muted mb-4!">{item.no}</p><h2><Lines text={item.title} /></h2><p>{item.summary}</p><ul>{item.points.map(point => <li key={point}>{point}</li>)}</ul></article>)}</section><section className="service-preview section-space"><div className="wrap"><div className="section-heading"><h2 className="section-title">{content.process.title}</h2><p className="max-w-md text-sm text-white/65">{content.process.note}</p></div>{content.steps.map(step => <div className="grid gap-6 border-t border-white/30 py-8 md:grid-cols-[70px_1fr_1.4fr]" key={step.no}><span className="font-serif text-3xl text-white/60">{step.no}</span><h3 className="font-serif text-3xl">{step.title}</h3><div><p className="text-sm leading-loose text-white/75">{step.body}</p><p className="mt-4 text-xs text-white/60">阶段重点 / {step.output}</p></div></div>)}</div></section><section className="wrap section-space"><div className="method-section"><h2 className="section-title"><Lines text={content.budget.title} /></h2><div><p className="text-muted leading-loose">{content.budget.text1}</p><p className="mt-6 text-muted leading-loose">{content.budget.text2}</p><div className="info-note mt-8">{content.budget.note}</div></div></div></section><section className="wrap section-space border-t border-line" id="faq"><h2 className="section-title mb-9">{content.faq.title}</h2><div className="faq-list">{content.faq.items.map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section><ContactBand /></>;
}
