import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { db } from "@/lib/db";
import { money, siteUrl } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import { CheckoutLink } from "@/components/campaign-capture";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug }, include: { category: true, images: { orderBy: { sortOrder: "asc" } } } });
  if (!product || product.status !== "PUBLISHED" || !product.category.active) return { title: "Produto indisponível", robots: { index: false } };
  const title = product.seoTitle || product.name;
  const description = product.metaDescription || product.shortDescription;
  return { title, description, alternates: { canonical: `/produtos/${product.slug}` }, openGraph: { title, description, url: siteUrl(`/produtos/${product.slug}`), images: product.socialImageUrl || product.imageUrl ? [product.socialImageUrl || product.imageUrl!] : ["/nexora-logo.png"] } };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug }, include: { category: true, images: { orderBy: { sortOrder: "asc" } } } });
  if (!product) {
    const old = await db.slugRedirect.findUnique({ where: { entity_oldSlug: { entity: "product", oldSlug: slug } } });
    if (old) { const target = await db.product.findUnique({ where: { id: old.targetId } }); if (target?.status === "PUBLISHED") permanentRedirect(`/produtos/${target.slug}`); }
    notFound();
  }
  if (product.status !== "PUBLISHED" || !product.category.active) notFound();
  const related = await db.product.findMany({ where: { status: "PUBLISHED", categoryId: product.categoryId, id: { not: product.id } }, include: { category: true, images: { orderBy: { sortOrder: "asc" } } }, take: 3, orderBy: { publishedAt: "desc" } });
  const schema = { "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.shortDescription, image: product.imageUrl || siteUrl("/nexora-logo.png"), category: product.category.name, brand: { "@type": "Brand", name: "Nexora Digital" }, offers: { "@type": "Offer", priceCurrency: "BRL", price: (product.priceCents / 100).toFixed(2), availability: product.checkoutUrl ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: siteUrl(`/produtos/${slug}`) } };
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Início", item: siteUrl() }, { "@type": "ListItem", position: 2, name: "Produtos", item: siteUrl("/produtos") }, { "@type": "ListItem", position: 3, name: product.name, item: siteUrl(`/produtos/${slug}`) }] };
  return <main className="container page-shell"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([schema,breadcrumb]).replace(/</g, "\\u003c") }}/><nav className="breadcrumbs" aria-label="Caminho"><Link href="/">Início</Link><span>/</span><Link href="/produtos">Produtos</Link><span>/</span><Link href={`/produtos?categoria=${product.category.slug}`}>{product.category.name}</Link><span>/</span><span>{product.name}</span></nav><div className="product-detail"><div className="detail-image">{product.imageUrl ? <Image src={product.imageUrl} alt={`Capa de ${product.name}`} fill sizes="(max-width: 760px) 100vw, 50vw" unoptimized priority/> : <div className="cover-placeholder"><span>{product.productType}</span><strong>{product.name}</strong><small>NEXORA DIGITAL</small></div>}</div><div className="detail-main"><span className="eyebrow">{product.category.name} · {product.productType}</span><h1>{product.name}</h1><p>{product.shortDescription}</p><div className="detail-price">{product.compareAtPriceCents && <s>{money(product.compareAtPriceCents)}</s>}<strong>{money(product.priceCents)}</strong></div>{product.checkoutUrl ? <CheckoutLink className="btn btn-primary detail-buy" slug={product.slug}>Comprar agora ↗</CheckoutLink> : <button className="btn btn-outline detail-buy" disabled>Compra indisponível</button>}<p className="detail-note">{product.checkoutUrl ? "Você será direcionado ao checkout oficial da Kiwify. Consulte as condições antes de finalizar." : "O link de compra ainda não foi configurado para este produto."}</p><ul className="detail-points"><li>Produto digital</li><li>Detalhes de entrega descritos abaixo</li><li>Pagamento no ambiente do provedor</li></ul></div></div>{product.images.length > 0 && <div className="detail-gallery">{product.images.map(image => <div key={image.id}><Image src={image.url} alt={image.alt} fill sizes="(max-width: 760px) 45vw, 220px" unoptimized/></div>)}</div>}<div className="detail-content"><section><span className="eyebrow">CONHEÇA O PRODUTO</span><h2>O que você vai encontrar</h2><p>{product.description || product.shortDescription}</p>{product.included && <div className="detail-block"><h3>O que está incluído</h3><p>{product.included}</p></div>}{product.audience && <div className="detail-block"><h3>Para quem é indicado</h3><p>{product.audience}</p></div>}</section><section><span className="eyebrow">INFORMAÇÕES IMPORTANTES</span><h2>Antes de comprar</h2>{product.requirements && <div className="detail-block"><h3>Formatos e requisitos</h3><p>{product.requirements}</p></div>}{product.delivery && <div className="detail-block"><h3>Como funciona a entrega</h3><p>{product.delivery}</p></div>}{product.refundPolicy && <div className="detail-block"><h3>Acesso e reembolso</h3><p>{product.refundPolicy}</p></div>}{!product.requirements && !product.delivery && !product.refundPolicy && <p>Consulte os detalhes disponíveis no checkout antes de concluir sua compra.</p>}</section></div>{related.length > 0 && <section className="section" style={{paddingBottom:0}}><div className="section-head"><div><span className="eyebrow">CONTINUE EXPLORANDO</span><h2>Produtos relacionados</h2></div></div><div className="product-grid">{related.map(p => <ProductCard key={p.id} product={p}/>)}</div></section>}{product.checkoutUrl && <div className="mobile-buy"><CheckoutLink className="btn btn-primary" slug={product.slug}>Comprar agora · {money(product.priceCents)} ↗</CheckoutLink></div>}</main>;
}
