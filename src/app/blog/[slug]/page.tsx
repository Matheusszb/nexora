import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/lib/articles";
import { curatedProducts } from "@/lib/curated-products";
import { money, siteUrl } from "@/lib/format";
import "../blog.css";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find(item => item.slug === slug);
  if (!article) return { title: "Guia não encontrado", robots: { index: false } };
  const url = `/blog/${slug}`;
  const image = curatedProducts.find(item => item.slug === article.productSlug)?.imageUrl || "/nexora-logo.png";
  return { title: article.title, description: article.description, alternates: { canonical: url }, openGraph: { title: article.title, description: article.description, url: siteUrl(url), type: "article", images: [siteUrl(image)] }, twitter: { card: "summary_large_image", title: article.title, description: article.description, images: [siteUrl(image)] } };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find(item => item.slug === slug);
  if (!article) notFound();
  const product = curatedProducts.find(item => item.slug === article.productSlug)!;
  const url = siteUrl(`/blog/${slug}`);
  const schema = [
    { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, datePublished: article.date, dateModified: article.date, mainEntityOfPage: url, author: { "@type": "Organization", name: "Nexora Concursos" }, publisher: { "@type": "Organization", name: "Nexora Concursos", url: siteUrl() } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Início", item: siteUrl() }, { "@type": "ListItem", position: 2, name: "Guias de estudo", item: siteUrl("/blog") }, { "@type": "ListItem", position: 3, name: article.title, item: url }] }
  ];
  return <main className="container page-shell blog-page blog-article">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <nav className="breadcrumbs" aria-label="Caminho"><Link href="/">Início</Link><span>/</span><Link href="/blog">Guias</Link><span>/</span><span>{article.title}</span></nav>
    <article><header className="page-intro"><span className="eyebrow">GUIA DE ESTUDO</span><h1>{article.title}</h1><p>{article.summary}</p><small>Publicado em <time dateTime={article.date}>19 de novembro de 2026</time> · Nexora Concursos</small></header>
      <div className="blog-content">{article.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{section.steps && <ol>{section.steps.map(step => <li key={step}>{step}</li>)}</ol>}</section>)}</div>
      <aside className="blog-source"><h2>Fonte oficial para conferir</h2><p>Informações sobre concurso e legislação podem mudar. Consulte a publicação original e suas atualizações.</p><a href={article.source.url} target="_blank" rel="noopener noreferrer">{article.source.label} ↗</a></aside>
      <aside className="blog-product"><span className="eyebrow">MATERIAL RELACIONADO</span><h2>{article.productLabel}</h2><p>Conheça o conteúdo, veja páginas reais do material e confira as condições antes de comprar.</p><strong>{money(product.priceCents)}</strong><Link className="btn btn-primary" href={`/concursos/${product.slug}`}>Ver a apostila ↗</Link></aside>
    </article>
  </main>;
}
