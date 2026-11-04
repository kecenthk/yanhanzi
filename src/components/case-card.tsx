import Image from "next/image";
import Link from "next/link";
import type { CaseItem } from "@/lib/types";
import { Arrow } from "./ui";

export function CaseCard({ project, className = "", note, imageAltSuffix }: { project: CaseItem; className?: string; note: string; imageAltSuffix: string }) {
  const remote = project.image.startsWith("/uploads/") || /^https?:\/\//.test(project.image);
  return <article className={`case-card ${className}`}><Link href={`/cases/${project.slug}`} className="case-image-link" aria-label={`查看${project.name}：${project.title}`}><Image src={project.image} alt={`${project.location}${imageAltSuffix}`} width={project.width} height={project.height} sizes="(max-width: 767px) 94vw, 58vw" className="case-image" unoptimized={remote} /><span className="case-view" aria-hidden="true"><Arrow /></span></Link><div className="case-caption"><p className="text-sm text-muted">{project.location}</p><Link href={`/cases/${project.slug}`} className="group mt-3 flex items-start justify-between gap-6"><h3 className="case-title">{project.title}</h3><Arrow className="mt-2 shrink-0 transition-transform group-hover:translate-x-1" /></Link><p className="mt-4 border-t border-line pt-3 text-xs text-muted">{note}</p></div></article>;
}
