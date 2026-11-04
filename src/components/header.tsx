"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./ui";

type Brand = { prefix: string; suffix: string; english: string };
type NavItem = { href: string; label: string };

export function Header({ brand, nav, cta }: { brand: Brand; nav: readonly NavItem[]; cta: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return <header className="site-header"><div className="header-inner wrap">
    <Link href="/" className="brand" aria-label={`${brand.prefix}${brand.suffix}，首页`} onClick={() => setOpen(false)}><span>{brand.prefix}<span className="brand-weight">{brand.suffix}</span></span><span className="brand-english">{brand.english}</span></Link>
    <nav className="desktop-nav" aria-label="主导航">{nav.map(item => <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? "active" : ""} aria-current={pathname.startsWith(item.href) ? "page" : undefined}>{item.label}</Link>)}</nav>
    <Link href="/contact" className="header-contact">{cta}<Arrow /></Link>
    <button ref={menuButton} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "关闭菜单" : "打开菜单"} onClick={() => setOpen(!open)}><span className={open ? "menu-line first open" : "menu-line first"} /><span className={open ? "menu-line last open" : "menu-line last"} /></button>
  </div>{open ? <nav id="mobile-menu" className="mobile-nav" aria-label="手机导航">{nav.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={pathname.startsWith(item.href) ? "page" : undefined}>{item.label}<Arrow /></Link>)}<Link href="/contact" onClick={() => setOpen(false)}>{cta}<Arrow /></Link></nav> : null}</header>;
}
