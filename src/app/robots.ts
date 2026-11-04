import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/settings-store";
import { getSiteUrl } from "@/lib/site-defaults";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const config = await getSiteConfig();
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/uploads/"] }, sitemap: new URL("/sitemap.xml", getSiteUrl(config)).href };
}
