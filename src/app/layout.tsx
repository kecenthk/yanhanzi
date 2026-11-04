import type { Metadata, Viewport } from "next";
import { getSiteConfig } from "@/lib/settings-store";
import { getSiteUrl } from "@/lib/site-defaults";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f5ef",
};

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return {
    metadataBase: getSiteUrl(config),
    title: { default: config.seo.defaultTitle, template: `%s｜${config.name}` },
    description: config.seo.defaultDescription,
    openGraph: {
      locale: "zh_CN",
      type: "website",
      siteName: config.name,
      title: config.name,
      description: config.seo.defaultDescription,
      images: [{ url: config.seo.ogImage, width: 1920, height: 1080, alt: "品牌商业计划书空间意象图" }],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
