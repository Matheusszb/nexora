import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/format";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = ["", "/produtos", "/sobre", "/contato"].map(p => ({ url: siteUrl(p) }));
  try {
    const products = await db.product.findMany({ where: { status: "PUBLISHED", category: { active: true } }, select: { slug: true, updatedAt: true } });
    const categories = await db.category.findMany({ where: { active: true, products: { some: { status: "PUBLISHED" } } }, select: { slug: true, updatedAt: true } });
    return [...base, ...categories.map(c => ({ url: siteUrl(`/categorias/${c.slug}`), lastModified: c.updatedAt })), ...products.map(p => ({ url: siteUrl(`/produtos/${p.slug}`), lastModified: p.updatedAt }))];
  } catch { return base; }
}
