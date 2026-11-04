import Link from "next/link";
import type { SiteConfig } from "@/lib/types";

type FooterContent = {
  brand: { prefix: string; suffix: string; english: string; tagline: string; location: string };
  nav: readonly { href: string; label: string }[];
  footer: {
    contactTitle: string;
    contactPlaceholder: string;
    requirementLabel: string;
    copyrightName: string;
    copyrightNote: string;
    imageNote: string;
    extraLinks: readonly { href: string; label: string }[];
  };
};

export function Footer({ config, content }: { config: SiteConfig; content: FooterContent }) {
  const year = new Date().getFullYear();
  return <footer className="site-footer wrap"><div className="footer-main"><div><Link href="/" className="brand"><span>{content.brand.prefix}{content.brand.suffix}</span><span className="brand-english">{content.brand.english}</span></Link><p className="mt-5 text-sm text-muted">{content.brand.tagline}</p><p className="mt-3 text-xs tracking-widest text-muted">{content.brand.location}</p></div><nav aria-label="页脚导航" className="footer-links">{content.nav.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}{content.footer.extraLinks.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav><div className="footer-contact"><p className="text-sm">{content.footer.contactTitle}</p>{config.contact.phone ? <a href={`tel:${config.contact.phone}`} className="mt-4 block">{config.contact.phone}</a> : <p className="mt-4 text-xs text-muted">{content.footer.contactPlaceholder}</p>}{config.contact.email ? <a href={`mailto:${config.contact.email}`} className="mt-2 block text-sm">{config.contact.email}</a> : null}<Link href="/contact" className="mt-5 inline-block border-b border-line pb-1 text-sm">{content.footer.requirementLabel}</Link></div></div><div className="footer-bottom"><span>© {year} {content.footer.copyrightName}</span><span>{content.footer.copyrightNote}</span><span>{content.footer.imageNote}</span></div></footer>;
}
