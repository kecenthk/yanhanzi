import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/case-card";
import { PageIntro, TextLink } from "@/components/ui";
import { ContactBand } from "@/components/contact-band";
import { getCaseBySlug, listCases } from "@/lib/cases-store";
import { getPageContent } from "@/lib/settings-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getCaseBySlug(slug);
  return { title: project ? `${project.name} · ${project.title}` : "项目未找到" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, content, cases] = await Promise.all([getCaseBySlug(slug), getPageContent("cases"), listCases()]);
  if (!project) notFound();
  const other = cases.find(item => item.slug !== slug);
  const detail = content.detail;
  const remote = project.image.startsWith("/uploads/") || /^https?:\/\//.test(project.image);
  return <><PageIntro title={project.title} description={project.description}><p className="mt-5 text-xs">{project.location} / 资料所列项目</p></PageIntro><figure className="wrap project-hero"><Image src={project.image} alt={`${project.location}${detail.imageAltSuffix}`} width={project.width} height={project.height} sizes="94vw" preload unoptimized={remote} /><figcaption className="source-note">{detail.imageCaptionPrefix}</figcaption></figure><section className="wrap project-detail"><aside><div className="project-meta"><span className="text-muted">{detail.metaCityLabel}</span><span>{detail.metaCityValue}</span></div><div className="project-meta"><span className="text-muted">{detail.metaLocationLabel}</span><span>{detail.metaLocationValue}</span></div><div className="project-meta"><span className="text-muted">{detail.metaSourceLabel}</span><span>{detail.metaSourceValue}</span></div><div className="project-meta"><span className="text-muted">{detail.metaContentLabel}</span><span>{detail.metaContentValue}</span></div><p className="mt-5 text-xs leading-loose text-muted">{detail.metaNote}</p></aside><div className="editorial"><h2>{detail.observationTitle}</h2><p>{project.observation}</p>{project.details.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.body}</p></div>)}<div className="mt-10"><TextLink href="/method">{detail.methodLinkLabel}</TextLink></div></div></section><section className="wrap section-space border-t border-line"><div className="section-heading"><h2 className="section-title">{detail.otherTitle}</h2><TextLink href="/cases">{detail.backLabel}</TextLink></div>{other ? <div className="max-w-3xl"><CaseCard project={other} note={detail.cardNote} imageAltSuffix={detail.imageAltSuffix} /></div> : null}</section><ContactBand /></>;
}
