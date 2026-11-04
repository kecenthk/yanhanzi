import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getPageContent, getSiteConfig } from "@/lib/settings-store";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [config, content] = await Promise.all([getSiteConfig(), getPageContent("global")]);
  return (
    <>
      <a href="#main" className="skip-link">跳转到主要内容</a>
      <Header brand={content.brand} nav={content.nav} cta={content.headerCta} />
      <main id="main">{children}</main>
      <Footer config={config} content={content} />
    </>
  );
}
