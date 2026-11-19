import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/format";
import { curatedProducts, isLegacyCuratedProduct } from "@/lib/curated-products";
import { articles } from "@/lib/articles";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = ["", "/produtos", "/sobre", "/contato", "/blog", ...curatedProducts.map(product => `/concursos/${product.slug}`)].map(p => ({ url: siteUrl(p) }));
  base.push(...articles.map(article => ({ url: siteUrl(`/blog/${article.slug}`), lastModified: new Date(`${article.date}T12:00:00Z`) })));
  try {
    const products = await db.product.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, name: true, updatedAt: true } });
    return [...base, ...products.filter(product => !isLegacyCuratedProduct(product)).map(product => ({ url: siteUrl(`/concursos/${product.slug}`), lastModified: product.updatedAt }))];
  } catch { return base; }
}
