import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import { CuratedProductCard } from "@/components/curated-product-card";
import { curatedProducts, isLegacyCuratedProduct } from "@/lib/curated-products";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Materiais para concursos",
  description: "Veja todos os materiais digitais para concursos públicos em uma lista contínua.",
  alternates: { canonical: "/produtos" }
};

type Params = { q?: string; ordem?: string };

export default async function Products({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const q = (params.q || "").trim().slice(0, 100);
  const order = params.ordem || "recentes";
  const where = {
    status: "PUBLISHED" as const,
    ...(q ? { OR: [
      { name: { contains: q, mode: "insensitive" as const } },
      { shortDescription: { contains: q, mode: "insensitive" as const } }
    ] } : {})
  };
  let products: Awaited<ReturnType<typeof db.product.findMany>> = [];
  let unavailable = false;
  const curated = curatedProducts.filter(product => !q || `${product.name} ${product.shortDescription} ${product.searchTerms}`.toLowerCase().includes(q.toLowerCase()));
  try {
    products = (await db.product.findMany({
      where,
      orderBy: order === "menor-preco" ? [{ priceCents: "asc" }]
        : order === "maior-preco" ? [{ priceCents: "desc" }]
        : order === "destaques" ? [{ featured: "desc" }, { publishedAt: "desc" }]
        : [{ publishedAt: "desc" }]
    })).filter(product => !isLegacyCuratedProduct(product));
  } catch { unavailable = true; }
  const listing = [
    ...curated.map(product => ({ kind: "curated" as const, product })),
    ...products.map(product => ({ kind: "registered" as const, product }))
  ];
  if (order === "menor-preco") listing.sort((a, b) => (a.product.priceCents ?? Infinity) - (b.product.priceCents ?? Infinity));
  if (order === "maior-preco") listing.sort((a, b) => (b.product.priceCents ?? -Infinity) - (a.product.priceCents ?? -Infinity));

  return <main className="container page-shell" id="materiais">
    <div className="page-intro"><span className="eyebrow">MATERIAIS PARA CONCURSOS</span><h1>Todos os materiais</h1><p>Role a lista e veja os cursos e apostilas disponíveis para a sua preparação.</p></div>
    <div className="catalog-toolbar"><form action="/produtos"><input className="field" type="search" name="q" defaultValue={q} placeholder="Busque por concurso, carreira ou assunto" aria-label="Buscar materiais para concursos"/><select className="select" name="ordem" defaultValue={order} aria-label="Ordenar produtos"><option value="recentes">Mais recentes</option><option value="destaques">Destaques</option><option value="menor-preco">Menor preço</option><option value="maior-preco">Maior preço</option></select><button className="btn btn-primary" type="submit">Buscar</button></form><span className="catalog-count">{listing.length} {listing.length === 1 ? "material" : "materiais"}</span></div>
    {listing.length ? <div className="product-grid course-list">{listing.map(item => item.kind === "curated" ? <CuratedProductCard key={item.product.slug} product={item.product}/> : <ProductCard key={item.product.id} product={item.product}/>)}</div> : <div className="empty-state"><h2>{unavailable ? "Catálogo indisponível" : "Nenhum material encontrado"}</h2><p>{unavailable ? "Tente novamente em instantes." : "Experimente outra busca."}</p>{!unavailable && q && <Link className="text-link" href="/produtos">Limpar busca</Link>}</div>}
  </main>;
}
