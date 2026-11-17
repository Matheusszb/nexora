import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/format";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = ["", "/produtos", "/sobre", "/contato"].map(p => ({ url: siteUrl(p) }));
  try {
    const products = await db.product.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } });
    return [...base, ...products.map(product => ({ url: siteUrl(`/concursos/${product.slug}`), lastModified: product.updatedAt }))];
  } catch { return base; }
}
