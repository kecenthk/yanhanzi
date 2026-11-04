import type { Metadata } from "next";
import { CaseCard } from "@/components/case-card";
import { Lines, PageIntro } from "@/components/ui";
import { ContactBand } from "@/components/contact-band";
import { listCases } from "@/lib/cases-store";
import { getPageContent } from "@/lib/settings-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("cases");
  return { title: content.meta.title, description: content.meta.description };
}

export default async function CasesPage() {
  const [content, cases] = await Promise.all([getPageContent("cases"), listCases()]);
  const count = String(cases.length).padStart(2, "0");
  return <><PageIntro title={<Lines text={content.intro.title} />} description={content.intro.description} /><section className="wrap section-space"><div className="section-heading"><p className="text-sm text-muted">{content.section.label}</p><span className="font-serif text-2xl text-muted">{count}</span></div><div className="case-grid case-grid-stagger">{cases.map(project => <CaseCard key={project.slug} project={project} note={content.detail.cardNote} imageAltSuffix={content.detail.imageAltSuffix} />)}</div><p className="source-note mt-10!">{content.section.sourceNote}</p></section><ContactBand /></>;
}
