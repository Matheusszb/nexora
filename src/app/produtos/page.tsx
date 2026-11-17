import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Materiais para concursos", description: "Explore materiais digitais para concursos públicos por carreira e área.", alternates: { canonical: "/produtos" } };

type Params = { q?: string; categoria?: string; ordem?: string; pagina?: string };

export default async function Products({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const q = (params.q || "").trim().slice(0, 100);
  const category = params.categoria || "";
  const order = params.ordem || "recentes";
  const page = Math.max(1, Math.min(1000, Number(params.pagina) || 1));
  const take = 9;
  const where = { status: "PUBLISHED" as const, category: { active: true, ...(category ? { slug: category } : {}) }, ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" as const } }, { shortDescription: { contains: q, mode: "insensitive" as const } }] } : {}) };
  let products: Awaited<ReturnType<typeof db.product.findMany<{ include: { category: true } }>>> = [];
  let categories: Awaited<ReturnType<typeof db.category.findMany>> = [];
  let count = 0, unavailable = false;
  try {
    [products, categories, count] = await Promise.all([
      db.product.findMany({ where, include: { category: true }, orderBy: order === "menor-preco" ? [{ priceCents: "asc" }] : order === "maior-preco" ? [{ priceCents: "desc" }] : order === "destaques" ? [{ featured: "desc" }, { publishedAt: "desc" }] : [{ publishedAt: "desc" }], take, skip: (page - 1) * take }),
      db.category.findMany({ where: { active: true, products: { some: { status: "PUBLISHED" } } }, orderBy: { sortOrder: "asc" } }),
      db.product.count({ where })
    ]);
  } catch { unavailable = true; }
  const link = (changes: Record<string,string>) => { const p = new URLSearchParams(); if (q) p.set("q",q); if (category) p.set("categoria",category); if (order !== "recentes") p.set("ordem",order); Object.entries(changes).forEach(([k,v]) => v ? p.set(k,v) : p.delete(k)); return `/produtos${p.size ? `?${p}` : ""}`; };
  const pages = Math.ceil(count / take);
  return <main className="container page-shell"><div className="page-intro"><span className="eyebrow">MATERIAIS PARA CONCURSOS</span><h1>Encontre materiais para o seu concurso</h1><p>Busque por carreira, órgão ou assunto e confira os detalhes de cada material antes de escolher.</p></div><div className="catalog-layout"><aside className="filter-panel"><h2>Categorias</h2><div className="filter-list"><Link className={!category ? "active" : ""} href={link({categoria:"",pagina:""})}>Todos os materiais</Link>{categories.map(c => <Link key={c.id} className={category === c.slug ? "active" : ""} href={link({categoria:c.slug,pagina:""})}>{c.name}</Link>)}</div></aside><div><div className="catalog-toolbar"><form action="/produtos"><input className="field" type="search" name="q" defaultValue={q} placeholder="Busque por concurso, carreira ou assunto" aria-label="Buscar materiais para concursos"/>{category && <input type="hidden" name="categoria" value={category}/>}<select name="ordem" className="select" defaultValue={order} aria-label="Ordenar produtos"><option value="recentes">Mais recentes</option><option value="destaques">Destaques</option><option value="menor-preco">Menor preço</option><option value="maior-preco">Maior preço</option></select><button className="btn btn-primary" type="submit">Buscar</button></form><span className="catalog-count">{count} {count === 1 ? "material" : "materiais"}</span></div>{products.length ? <div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state"><h2>{unavailable ? "Catálogo indisponível" : "Nenhum material encontrado"}</h2><p>{unavailable ? "Tente novamente em instantes." : "Experimente outra busca ou categoria."}</p>{!unavailable && <Link className="text-link" href="/produtos">Limpar filtros</Link>}</div>}{pages > 1 && <nav className="pagination" aria-label="Páginas do catálogo">{Array.from({length:pages},(_,i) => i+1).map(n => <Link key={n} href={link({pagina:String(n)})} className={n === page ? "active" : ""} aria-current={n === page ? "page" : undefined}>{n}</Link>)}</nav>}</div></div></main>;
}
