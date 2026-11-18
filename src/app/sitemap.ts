import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/format";
import { curatedProducts, isLegacyCuratedProduct } from "@/lib/curated-products";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = ["", "/produtos", "/sobre", "/contato", ...curatedProducts.map(product => `/concursos/${product.slug}`)].map(p => ({ url: siteUrl(p) }));
  try {
    const products = await db.product.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, name: true, updatedAt: true } });
    return [...base, ...products.filter(product => !isLegacyCuratedProduct(product)).map(product => ({ url: siteUrl(`/concursos/${product.slug}`), lastModified: product.updatedAt }))];
  } catch { return base; }
}
