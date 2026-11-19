import Link from "next/link";
import { articles } from "@/lib/articles";
import { curatedProducts } from "@/lib/curated-products";
import { money, siteUrl } from "@/lib/format";
import "./product-discovery.css";

const officialSources: Record<string, { label: string; url: string }> = {
  "gcm-2026": { label: "Lei nº 13.022/2014 no Planalto", url: "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l13022.htm" },
  "banestes-tecnico-bancario": { label: "Editais e retificações no BANESTES", url: "https://banestes.com.br/publicacoes_legais/concurso2026.htm" },
  "tjsp-escrevente": { label: "Editais e comunicados no TJSP", url: "https://portal.tjsp.jus.br/Noticias/Noticia?codigoNoticia=115772" }
};

export function productBreadcrumbSchema(name: string, slug: string) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: siteUrl() },
    { "@type": "ListItem", position: 2, name: "Apostilas digitais", item: siteUrl("/produtos") },
    { "@type": "ListItem", position: 3, name, item: siteUrl(`/concursos/${slug}`) }
  ] };
}

export function ProductDiscovery({ slug }: { slug: string }) {
  const source = officialSources[slug];
  const article = articles.find(item => item.productSlug === slug);
  const related = curatedProducts.filter(item => item.slug !== slug && ["gcm-2026", "banestes-tecnico-bancario", "tjsp-escrevente"].includes(item.slug));
  if (!source) return null;
  return <section className="product-discovery"><div className="container">
    <div className="product-discovery-grid"><div><span className="eyebrow">CONFIRA NA FONTE</span><h2>Estude com o edital em mãos</h2><p>Datas, disciplinas e regras podem mudar. Use sempre a publicação oficial e suas retificações para conferir o programa do seu concurso.</p><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>{article && <p className="product-discovery-guide">Precisa organizar a rotina? <Link href={`/blog/${article.slug}`}>Leia nosso guia de estudo ↗</Link></p>}</div>
      <div><span className="eyebrow">OUTRAS APOSTILAS</span><h2>Continue explorando</h2><div className="product-discovery-links">{related.map(item => <Link key={item.slug} href={`/concursos/${item.slug}`}><span>{item.name}</span><strong>{money(item.priceCents)} ↗</strong></Link>)}</div></div></div>
  </div></section>;
}
