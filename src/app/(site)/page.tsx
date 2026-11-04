import Image from "next/image";
import Link from "next/link";
import { ButtonLink, Lines, TextLink } from "@/components/ui";
import { ContactBand } from "@/components/contact-band";
import { CaseCard } from "@/components/case-card";
import { listCases } from "@/lib/cases-store";
import { getPageContent } from "@/lib/settings-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [content, casesContent, methodContent, servicesContent, cases] = await Promise.all([
    getPageContent("home"),
    getPageContent("cases"),
    getPageContent("method"),
    getPageContent("services"),
    listCases(),
  ]);
  return <>
    <section className="hero wrap"><div className="hero-grid"><div className="hero-copy"><h1 className="hero-title"><Lines text={content.hero.title} /></h1><p className="hero-description"><Lines text={content.hero.description} /></p><ButtonLink href={content.hero.ctaHref}>{content.hero.ctaLabel}</ButtonLink></div><div className="hero-photo"><Image src={content.hero.image} alt={content.hero.imageAlt} fill sizes="(max-width: 600px) 94vw, 65vw" preload /></div></div><p className="hero-caption">{content.hero.caption}</p></section>
    <section className="wrap section-space pt-5!" id="cases"><div className="section-heading"><div><h2 className="section-title">{content.cases.title}</h2><p className="mt-4 text-sm text-muted">{content.cases.subtitle}</p></div><TextLink href={content.cases.linkHref}>{content.cases.linkLabel}</TextLink></div><div className="case-grid case-grid-stagger">{cases.map(project => <CaseCard key={project.slug} project={project} note={casesContent.detail.cardNote} imageAltSuffix={casesContent.detail.imageAltSuffix} />)}</div></section>
    <section className="question-band"><div className="wrap question-grid">{content.questions.map(item => <Link key={item.href} href={item.href}><Lines text={item.label} /></Link>)}</div></section>
    <section className="wrap section-space method-section"><div><h2 className="section-title"><Lines text={content.method.title} /></h2><p className="mt-7 max-w-sm text-sm leading-loose text-muted">{content.method.text}</p><div className="mt-9"><TextLink href={content.method.linkHref}>{content.method.linkLabel}</TextLink></div></div><div className="method-grid">{methodContent.methods.map(method => <div key={method.no} className="method-cell"><span className="method-no">{method.no}</span><h3>{method.name}</h3><p>{method.summary}</p></div>)}</div></section>
    <section className="service-preview section-space"><div className="wrap service-layout"><div><div className="service-photo"><Image src={content.service.image} alt={content.service.imageAlt} fill sizes="(max-width: 850px) 94vw, 45vw" /></div><p className="mt-3 text-[10px] text-white/50">{content.service.imageNote}</p></div><div><h2 className="section-title mb-9">{content.service.title}</h2>{servicesContent.steps.map(step => <div className="step-row" key={step.no}><span className="step-no">{step.no}</span><h3>{step.title}</h3><p>{step.body}</p></div>)}<div className="mt-8"><ButtonLink href={content.service.ctaHref} light outline>{content.service.ctaLabel}</ButtonLink></div></div></div></section>
    <section className="wrap section-space founder-layout"><figure className="founder-photo"><Image src={content.founder.image} alt={content.founder.imageAlt} width={625} height={625} sizes="(max-width: 600px) 85vw, 35vw" /><figcaption className="source-note">{content.founder.imageNote}</figcaption></figure><div><h2 className="section-title"><Lines text={content.founder.title} /></h2><p className="founder-quote"><Lines text={content.founder.quote} /></p><div className="mt-9"><TextLink href={content.founder.linkHref}>{content.founder.linkLabel}</TextLink></div></div></section>
    <section className="wrap section-space border-t border-line"><div className="section-heading"><h2 className="section-title"><Lines text={content.faq.title} /></h2><TextLink href={content.faq.linkHref}>{content.faq.linkLabel}</TextLink></div><div className="faq-list">{servicesContent.faq.items.slice(0,3).map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>
    <ContactBand />
    <section className="wrap alliance-home py-12"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-center"><div><h2 className="font-serif text-2xl">{content.alliance.title}</h2><p className="mt-2 text-sm text-muted">{content.alliance.text}</p></div><TextLink href={content.alliance.linkHref}>{content.alliance.linkLabel}</TextLink></div></section>
  </>;
}
