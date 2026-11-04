import Link from "next/link";
import type { ReactNode } from "react";

export function Arrow({ className = "" }: { className?: string }) {
  return <svg className={className} width="24" height="16" viewBox="0 0 24 16" fill="none" aria-hidden="true"><path d="M1 8h21m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.2" /></svg>;
}

export function ButtonLink({ href, children, light = false, outline = false, className = "" }: { href: string; children: ReactNode; light?: boolean; outline?: boolean; className?: string }) {
  return <Link href={href} className={`button ${light ? "button-light" : ""} ${outline ? "button-outline" : ""} ${className}`}>{children}<Arrow /></Link>;
}

export function TextLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return <Link href={href} className={`text-link ${light ? "text-link-light" : ""}`}>{children}<Arrow /></Link>;
}

export function PageIntro({ title, description, children }: { title: ReactNode; description: string; children?: ReactNode }) {
  return <section className="page-intro wrap"><h1 className="page-title">{title}</h1><div className="page-intro-body"><p>{description}</p>{children}</div></section>;
}

export function Lines({ text }: { text: string }) {
  const parts = text.split("\n");
  return <>{parts.map((part, index) => <span key={index}>{part}{index < parts.length - 1 ? <br /> : null}</span>)}</>;
}
