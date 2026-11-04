import type { MetadataRoute } from "next";
import { listCases } from "@/lib/cases-store";
import { getSiteConfig } from "@/lib/settings-store";
import { getSiteUrl } from "@/lib/site-defaults";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [config, cases] = await Promise.all([getSiteConfig(), listCases()]);
  const paths = ["", "/cases", "/method", "/services", "/about", "/alliance", "/contact", ...cases.map(item => `/cases/${item.slug}`)];
  return paths.map(path => ({ url: new URL(path || "/", getSiteUrl(config)).href, changeFrequency: "monthly", priority: path === "" ? 1 : .7 }));
}
