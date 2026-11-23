import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/lib/db";
import { money, siteUrl } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import { isOptimizableProductImage } from "@/lib/product-image";
import { PurchasePlans } from "@/components/purchase-plans";
import { MetaProductView } from "@/components/meta-product-view";
import { isLegacyBanestesProduct, isLegacyGcmProduct, isLegacyIbgeProduct, isLegacyPcpeProduct, isLegacyPmspProduct, isLegacyTjspProduct } from "@/lib/curated-products";
import "./product-landing.css";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
const getProduct = cache((slug: string) => db.product.findUnique({ where: { slug }, include: { images: { orderBy: { sortOrder: "asc" } } } }));

const lines = (value: string) => value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product || product.status !== "PUBLISHED") return { title: "Produto indisponível", robots: { index: false } };
  if (isLegacyPmspProduct(product)) return { title: product.name, alternates: { canonical: "/concursos/pmsp-2026" }, robots: { index: false } };
  if (isLegacyPcpeProduct(product)) return { title: product.name, alternates: { canonical: "/concursos/pcpe-agente" }, robots: { index: false } };
  if (isLegacyIbgeProduct(product)) return { title: product.name, alternates: { canonical: "/concursos/ibge-recenseador" }, robots: { index: false } };
  if (isLegacyGcmProduct(product)) return { title: product.name, alternates: { canonical: "/concursos/gcm-2026" }, robots: { index: false } };
  if (isLegacyBanestesProduct(product)) return { title: product.name, alternates: { canonical: "/concursos/banestes-tecnico-bancario" }, robots: { index: false } };
  if (isLegacyTjspProduct(product)) return { title: product.name, alternates: { canonical: "/concursos/tjsp-escrevente" }, robots: { index: false } };
  const title = product.seoTitle || product.name;
  const description = product.metaDescription || product.shortDescription;
  const url = `/concursos/${product.slug}`;
  const image = product.socialImageUrl || product.imageUrl || siteUrl("/nexora-logo.png");
  return {
    title, description, alternates: { canonical: url },
    openGraph: { title, description, url: siteUrl(url), images: [image], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [image] }
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    const old = await db.slugRedirect.findUnique({ where: { entity_oldSlug: { entity: "product", oldSlug: slug } } });
    if (old) { const target = await db.product.findUnique({ where: { id: old.targetId } }); if (target?.status === "PUBLISHED") permanentRedirect(`/concursos/${target.slug}`); }
    notFound();
  }
  if (product.status !== "PUBLISHED") notFound();
  if (isLegacyPmspProduct(product)) permanentRedirect("/concursos/pmsp-2026");
  if (isLegacyPcpeProduct(product)) permanentRedirect("/concursos/pcpe-agente");
  if (isLegacyIbgeProduct(product)) permanentRedirect("/concursos/ibge-recenseador");
  if (isLegacyGcmProduct(product)) permanentRedirect("/concursos/gcm-2026");
  if (isLegacyBanestesProduct(product)) permanentRedirect("/concursos/banestes-tecnico-bancario");
  if (isLegacyTjspProduct(product)) permanentRedirect("/concursos/tjsp-escrevente");
  const related = await db.product.findMany({ where: { status: "PUBLISHED", id: { not: product.id } }, take: 3, orderBy: { publishedAt: "desc" } });
  const basicIncluded = lines(product.included);
  const upgradeIncluded = lines(product.upgradeIncluded);
  const upgradeAvailable = Boolean(product.upgradeName && product.upgradeIncluded.trim() && product.upgradePriceCents != null && product.upgradePriceCents > product.priceCents && product.upgradeCheckoutUrl);
  const canBuy = Boolean(product.checkoutUrl || upgradeAvailable);
  const startingPrice = product.checkoutUrl ? product.priceCents : upgradeAvailable ? product.upgradePriceCents! : product.priceCents;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.imageUrl || siteUrl("/nexora-logo.png"),
    brand: { "@type": "Brand", name: "Nexora Concursos" },
    offers: [
      { "@type": "Offer", name: product.name, priceCurrency: "BRL", price: (product.priceCents / 100).toFixed(2), availability: product.checkoutUrl ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: siteUrl(`/concursos/${slug}#planos`) },
      ...(upgradeAvailable ? [{ "@type": "Offer", name: product.upgradeName, priceCurrency: "BRL", price: (product.upgradePriceCents! / 100).toFixed(2), availability: "https://schema.org/InStock", url: siteUrl(`/concursos/${slug}#planos`) }] : [])
    ]
  };
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Início", item: siteUrl() }, { "@type": "ListItem", position: 2, name: "Materiais", item: siteUrl("/produtos") }, { "@type": "ListItem", position: 3, name: product.name, item: siteUrl(`/concursos/${slug}`) }] };
  const questions = [
    product.delivery && { question: "Como recebo o material?", answer: product.delivery },
    product.requirements && { question: "Qual é o formato e quais são os requisitos?", answer: product.requirements },
    product.refundPolicy && { question: "Como funciona o acesso e o reembolso?", answer: product.refundPolicy }
  ].filter((item): item is { question: string; answer: string } => Boolean(item));
  return <main className="product-landing" data-meta-product-id={product.slug} data-meta-product-name={product.name} data-meta-price-cents={product.priceCents} data-meta-combo-price-cents={upgradeAvailable ? product.upgradePriceCents! : undefined}>
    <MetaProductView slug={product.slug} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([schema, breadcrumb]).replace(/</g, "\\u003c") }} />
    <div className="container"><nav className="breadcrumbs product-breadcrumbs" aria-label="Caminho"><Link href="/">Início</Link><span>/</span><Link href="/produtos">Materiais</Link><span>/</span><span>{product.name}</span></nav></div>
    <section className="product-hero">
      <div className="container product-hero-inner">
        <div className="sales-hero-copy"><span className="hero-kicker"><i/> {product.productType}</span><h1>{product.name}</h1><p>{product.shortDescription}</p><Link className="btn btn-primary sales-primary-action" href={canBuy ? "#planos" : "#material"}>{canBuy ? "Quero começar a estudar ↗" : "Conhecer o material ↓"}</Link><div className="product-hero-facts"><span>◇ Conteúdo informado no cadastro</span><span>↗ Checkout oficial</span></div></div>
        <div className="product-hero-media">{product.imageUrl ? <Image src={product.imageUrl} alt={`Capa de ${product.name}`} fill sizes="(max-width: 760px) 90vw, 560px" unoptimized={!isOptimizableProductImage(product.imageUrl)} priority /> : <div className="cover-placeholder"><span>{product.productType}</span><strong>{product.name}</strong><small>NEXORA DIGITAL</small></div>}</div>
      </div>
    </section>
    <section className="section product-story" id="material"><div className="container sales-story-grid">
      <div className="sales-story-media">{product.imageUrl ? <Image src={product.imageUrl} alt={`Apresentação de ${product.name}`} fill sizes="(max-width: 760px) 90vw, 500px" unoptimized={!isOptimizableProductImage(product.imageUrl)} /> : <div className="cover-placeholder"><span>{product.productType}</span><strong>{product.name}</strong><small>NEXORA DIGITAL</small></div>}</div>
      <div><span className="eyebrow">O MATERIAL</span><h2>Conheça o preparatório</h2><p>{product.description || product.shortDescription}</p>{product.delivery && <div className="sales-info-card"><strong>Como funciona</strong><p>{product.delivery}</p></div>}</div>
    </div></section>
    {product.images.length > 0 && <section className="section product-preview"><div className="container"><div className="section-head product-section-center"><div><span className="eyebrow">VEJA POR DENTRO</span><h2>Imagens do material</h2><p>Explore as imagens cadastradas para este produto.</p></div></div><div className="product-preview-grid">{product.images.map(image => <div className="product-preview-image" key={image.id}><Image src={image.url} alt={image.alt} fill sizes="(max-width: 760px) 80vw, 300px" unoptimized={!isOptimizableProductImage(image.url)} /></div>)}</div></div></section>}
    {basicIncluded.length > 0 && <section className="section product-included" id="conteudo"><div className="container"><div className="section-head product-section-center"><div><span className="eyebrow">CONTEÚDO DO PREPARATÓRIO</span><h2>O que está incluído</h2><p>Itens informados no cadastro deste material.</p></div></div><div className="sales-included-grid">{basicIncluded.map((item, index) => <div className="sales-included-card" key={index}><span aria-hidden="true">✓</span><p>{item}</p></div>)}</div></div></section>}
    {product.audience && <section className="section sales-audience"><div className="container sales-audience-inner"><span className="eyebrow">PARA QUEM É INDICADO</span><h2>Este material combina com a sua preparação?</h2><p>{product.audience}</p><Link className="text-link" href="#planos">Conhecer os planos ↗</Link></div></section>}
    <PurchasePlans slug={slug} basicName={product.name} basicPrice={money(product.priceCents)} compareAtPrice={product.compareAtPriceCents ? money(product.compareAtPriceCents) : undefined} basicIncluded={basicIncluded} basicAvailable={Boolean(product.checkoutUrl)} upgradeName={product.upgradeName} upgradeDescription={product.upgradeDescription} upgradeIncluded={upgradeIncluded} upgradePrice={product.upgradePriceCents != null ? money(product.upgradePriceCents) : undefined} upgradeDifference={product.upgradePriceCents != null ? money(product.upgradePriceCents - product.priceCents) : undefined} upgradeAvailable={upgradeAvailable}/>
    {(product.delivery || product.requirements || product.refundPolicy) && <section className="section sales-delivery"><div className="container"><div className="section-head product-section-center"><div><span className="eyebrow">ENTREGA DIGITAL</span><h2>Saiba como funciona o acesso</h2></div></div><div className="sales-delivery-grid">{product.delivery && <article><span>01</span><h3>Entrega</h3><p>{product.delivery}</p></article>}{product.requirements && <article><span>02</span><h3>Formato e requisitos</h3><p>{product.requirements}</p></article>}{product.refundPolicy && <article><span>03</span><h3>Acesso e reembolso</h3><p>{product.refundPolicy}</p></article>}</div></div></section>}
    {questions.length > 0 && <section className="section product-questions"><div className="container"><div className="section-head product-section-center"><div><span className="eyebrow">DÚVIDAS FREQUENTES</span><h2>Antes de começar a estudar</h2></div></div><div className="faq-list">{questions.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div></section>}
    <section className="section sales-final"><div className="container sales-final-inner"><div><span className="eyebrow">SEU PRÓXIMO PASSO</span><h2>Comece sua preparação para {product.name}</h2><p>Confira o conteúdo e as condições do plano escolhido antes de concluir a compra.</p></div><div className="sales-final-action"><strong>{canBuy ? "A partir de " : "Preço cadastrado: "}{money(startingPrice)}</strong><Link className={canBuy ? "btn btn-primary" : "btn btn-outline"} href="#planos">{canBuy ? "Escolher meu plano ↗" : "Ver planos e detalhes ↗"}</Link></div></div></section>
    {related.length > 0 && <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">CONTINUE EXPLORANDO</span><h2>Materiais relacionados</h2></div></div><div className="product-grid">{related.map(p => <ProductCard key={p.id} product={p}/>)}</div></div></section>}
    <div className="product-mobile-cta"><Link className="btn btn-primary" href="#planos">Ver planos e preços ↗</Link></div>
  </main>;
}
