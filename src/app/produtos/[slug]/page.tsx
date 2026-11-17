import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { db } from "@/lib/db";
import { money, siteUrl } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import { PurchasePlans } from "@/components/purchase-plans";
import "./product-landing.css";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

const lines = (value: string) => value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug }, include: { category: true } });
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
  const related = await db.product.findMany({ where: { status: "PUBLISHED", categoryId: product.categoryId, id: { not: product.id } }, include: { category: true }, take: 3, orderBy: { publishedAt: "desc" } });
  const basicIncluded = lines(product.included);
  const upgradeIncluded = lines(product.upgradeIncluded);
  const upgradeAvailable = Boolean(product.upgradeName && product.upgradeIncluded.trim() && product.upgradePriceCents != null && product.upgradePriceCents > product.priceCents && product.upgradeCheckoutUrl);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.imageUrl || siteUrl("/nexora-logo.png"),
    category: product.category.name,
    brand: { "@type": "Brand", name: "Nexora Digital" },
    offers: [
      { "@type": "Offer", name: "Plano básico", priceCurrency: "BRL", price: (product.priceCents / 100).toFixed(2), availability: product.checkoutUrl ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: siteUrl(`/produtos/${slug}#planos`) },
      ...(upgradeAvailable ? [{ "@type": "Offer", name: product.upgradeName, priceCurrency: "BRL", price: (product.upgradePriceCents! / 100).toFixed(2), availability: "https://schema.org/InStock", url: siteUrl(`/produtos/${slug}#planos`) }] : [])
    ]
  };
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Início", item: siteUrl() }, { "@type": "ListItem", position: 2, name: "Materiais", item: siteUrl("/produtos") }, { "@type": "ListItem", position: 3, name: product.name, item: siteUrl(`/produtos/${slug}`) }] };
  return <main className="product-landing">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([schema, breadcrumb]).replace(/</g, "\\u003c") }} />
    <div className="container"><nav className="breadcrumbs product-breadcrumbs" aria-label="Caminho"><Link href="/">Início</Link><span>/</span><Link href="/produtos">Materiais</Link><span>/</span><span>{product.name}</span></nav></div>
    <section className="product-hero">
      <div className="container product-hero-inner">
        <span className="hero-kicker"><i/> {product.category.name} · {product.productType}</span>
        <h1>{product.name}</h1>
        <p>{product.shortDescription}</p>
        <div className="product-hero-media">{product.imageUrl ? <Image src={product.imageUrl} alt={`Capa de ${product.name}`} fill sizes="(max-width: 760px) 90vw, 760px" unoptimized priority /> : <div className="cover-placeholder"><span>{product.productType}</span><strong>{product.name}</strong><small>NEXORA DIGITAL</small></div>}</div>
        <div className="product-hero-actions"><Link className="btn btn-primary" href="#conteudo">Conhecer o material ↓</Link><Link className="btn btn-outline" href="#planos">Ver planos e preços ↗</Link></div>
        <div className="product-hero-facts"><span>◇ Conteúdo descrito abaixo</span><span>↗ Checkout externo</span><span>✧ Escolha o plano antes de pagar</span></div>
      </div>
    </section>
    <section className="section product-story" id="conteudo"><div className="container product-story-grid">
      <div><span className="eyebrow">CONHEÇA O MATERIAL</span><h2>O que você vai encontrar</h2><p>{product.description || product.shortDescription}</p></div>
      <div className="product-story-panel"><h3>Para quem é indicado</h3><p>{product.audience || "Confira a descrição e os requisitos deste material para avaliar se ele corresponde à sua preparação."}</p>{product.requirements && <div className="product-story-separator"><h3>Formatos e requisitos</h3><p>{product.requirements}</p></div>}</div>
    </div></section>
    {product.images.length > 0 && <section className="section product-preview"><div className="container"><div className="section-head product-section-center"><div><span className="eyebrow">VEJA POR DENTRO</span><h2>Imagens do material</h2><p>Explore as imagens cadastradas para este produto.</p></div></div><div className="product-preview-grid">{product.images.map(image => <div className="product-preview-image" key={image.id}><Image src={image.url} alt={image.alt} fill sizes="(max-width: 760px) 80vw, 300px" unoptimized /></div>)}</div></div></section>}
    {basicIncluded.length > 0 && <section className="section product-included"><div className="container product-included-inner"><div><span className="eyebrow">CONTEÚDO DO BÁSICO</span><h2>O que está incluído</h2><p>Consulte os itens descritos pelo produtor para este material.</p></div><ul>{basicIncluded.map((item, index) => <li key={index}>{item}</li>)}</ul></div></section>}
    <PurchasePlans slug={slug} basicPrice={money(product.priceCents)} basicIncluded={basicIncluded} basicAvailable={Boolean(product.checkoutUrl)} upgradeName={product.upgradeName} upgradeDescription={product.upgradeDescription} upgradeIncluded={upgradeIncluded} upgradePrice={product.upgradePriceCents != null ? money(product.upgradePriceCents) : undefined} upgradeDifference={product.upgradePriceCents != null ? money(product.upgradePriceCents - product.priceCents) : undefined} upgradeAvailable={upgradeAvailable}/>
    {(product.delivery || product.refundPolicy) && <section className="section product-questions"><div className="container"><div className="section-head product-section-center"><div><span className="eyebrow">ANTES DE COMPRAR</span><h2>Informações importantes</h2></div></div><div className="faq-list">{product.delivery && <details><summary>Como funciona a entrega?</summary><p>{product.delivery}</p></details>}{product.refundPolicy && <details><summary>Quais são as condições de acesso e reembolso?</summary><p>{product.refundPolicy}</p></details>}</div></div></section>}
    {related.length > 0 && <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">CONTINUE EXPLORANDO</span><h2>Materiais relacionados</h2></div></div><div className="product-grid">{related.map(p => <ProductCard key={p.id} product={p}/>)}</div></div></section>}
    <div className="product-mobile-cta"><Link className="btn btn-primary" href="#planos">Ver planos e preços ↗</Link></div>
  </main>;
}
