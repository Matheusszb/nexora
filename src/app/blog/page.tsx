import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/articles";
import { siteUrl } from "@/lib/format";
import "./blog.css";

export const metadata: Metadata = {
  title: "Guias de estudo para concursos",
  description: "Guias práticos para estudar para GCM, Escrevente TJSP e BANESTES. Aprenda a usar o edital, questões e revisão na sua preparação.",
  alternates: { canonical: "/blog" },
  openGraph: { title: "Guias de estudo | Nexora Concursos", description: "Orientações práticas para estudar com o edital e escolher materiais digitais.", url: siteUrl("/blog"), type: "website", images: [siteUrl("/nexora-logo.png")] },
  twitter: { card: "summary_large_image", title: "Guias de estudo | Nexora Concursos", description: "Aprenda a usar o edital e organizar sua preparação.", images: [siteUrl("/nexora-logo.png")] }
};

export default function Blog() {
  return <main className="container page-shell blog-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Início", item: siteUrl() }, { "@type": "ListItem", position: 2, name: "Guias de estudo", item: siteUrl("/blog") }] }).replace(/</g, "\\u003c") }} />
    <nav className="breadcrumbs" aria-label="Caminho"><Link href="/">Início</Link><span>/</span><span>Guias de estudo</span></nav>
    <header className="page-intro"><span className="eyebrow">CONTEÚDO PARA ESTUDAR MELHOR</span><h1>Guias de estudo para concursos</h1><p>Orientações para ler o edital, organizar a rotina e escolher uma apostila com clareza. Confira sempre as regras na fonte oficial do concurso.</p></header>
    <div className="blog-grid">{articles.map(article => <article className="blog-card" key={article.slug}><span className="eyebrow">GUIA PRÁTICO</span><h2><Link href={`/blog/${article.slug}`}>{article.title}</Link></h2><p>{article.summary}</p><Link className="text-link" href={`/blog/${article.slug}`}>Ler guia ↗</Link></article>)}</div>
  </main>;
}
