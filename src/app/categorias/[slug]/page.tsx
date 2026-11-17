import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ pagina?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await db.category.findUnique({ where: { slug } });
  if (!category || !category.active) return { title: "Categoria indisponível", robots: { index: false } };
  return { title: category.name, description: category.description || `Produtos digitais de ${category.name} na Nexora Digital.`, alternates: { canonical: `/categorias/${slug}` } };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { pagina } = await searchParams;
  const category = await db.category.findUnique({ where: { slug } });
  if (!category) {
    const old = await db.slugRedirect.findUnique({ where: { entity_oldSlug: { entity: "category", oldSlug: slug } } });
    if (old) { const target = await db.category.findUnique({ where: { id: old.targetId } }); if (target?.active) permanentRedirect(`/categorias/${target.slug}`); }
    notFound();
  }
  if (!category.active) notFound();
  const count = await db.product.count({ where: { categoryId: category.id, status: "PUBLISHED" } });
  if (!count) notFound();
  const page = Math.max(1, Math.min(Math.ceil(count / 9), Number(pagina) || 1));
  const products = await db.product.findMany({ where: { categoryId: category.id, status: "PUBLISHED" }, include: { category: true }, orderBy: { publishedAt: "desc" }, take: 9, skip: (page - 1) * 9 });
  return <main className="container page-shell"><nav className="breadcrumbs" aria-label="Caminho"><Link href="/">Início</Link><span>/</span><Link href="/produtos">Produtos</Link><span>/</span><span>{category.name}</span></nav><div className="page-intro"><span className="eyebrow">CATEGORIA</span><h1>{category.name}</h1><p>{category.description || `Explore os produtos digitais disponíveis em ${category.name}.`}</p></div><div className="section-head"><span className="catalog-count">{count} {count === 1 ? "produto disponível" : "produtos disponíveis"}</span><Link className="text-link" href="/produtos">Todo o catálogo ↗</Link></div><div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p}/>)}</div>{count > 9 && <nav className="pagination" aria-label="Páginas da categoria">{Array.from({length:Math.ceil(count/9)},(_,i)=>i+1).map(n => <Link key={n} className={n === page ? "active" : ""} href={`/categorias/${slug}?pagina=${n}`}>{n}</Link>)}</nav>}</main>;
}
