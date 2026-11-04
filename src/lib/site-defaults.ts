import type { SiteConfig } from "./types";

const description = "面向东莞改善家庭，围绕大定制、大家居、大设计与大宅收纳，探索精装升级与旧房整装的整体居住方案。";

export const siteDefaults: SiteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "艳汉子大定制",
  description,
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "",
  seo: {
    defaultTitle: "艳汉子大定制｜让大宅，好看、好用，更好住",
    defaultDescription: description,
    ogImage: "/images/cover-interior.jpg",
  },
  contact: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "",
    wechat: process.env.NEXT_PUBLIC_CONTACT_WECHAT?.trim() || "",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
    address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS?.trim() || "",
    hours: process.env.NEXT_PUBLIC_CONTACT_HOURS?.trim() || "",
  },
  inquiry: {
    enabled: process.env.INQUIRY_ENABLED === "true",
    note: "咨询通道待配置",
  },
};

export function getSiteUrl(config?: SiteConfig) {
  const configured = config?.url?.trim() || process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    try {
      return new URL(configured);
    } catch {
      // 配置值无效时回退到部署环境提供的地址。
    }
  }
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return new URL(host ? `https://${host}` : "http://localhost:3000");
}
