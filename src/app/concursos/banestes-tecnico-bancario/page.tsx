import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckoutLink } from "@/components/campaign-capture";
import { getCuratedCheckout } from "@/lib/curated-checkout";
import { curatedProducts } from "@/lib/curated-products";
import { money, siteUrl } from "@/lib/format";
import "./banestes.css";

export const dynamic = "force-dynamic";
const product = curatedProducts.find(item => item.slug === "banestes-tecnico-bancario")!;

export const metadata: Metadata = {
  title: "Apostila BANESTES 2026/2027 | Técnico Bancário",
  description: "Apostila digital para Técnico Bancário do BANESTES: 44 aulas, 300 questões de treino, três simulados e cronogramas. R$ 34,00.",
  alternates: { canonical: "/concursos/banestes-tecnico-bancario" },
  openGraph: {
    title: "Apostila BANESTES | Técnico Bancário | Nexora Concursos",
    description: product.shortDescription,
    images: [siteUrl(product.imageUrl)],
    url: siteUrl("/concursos/banestes-tecnico-bancario"),
    type: "website"
  }
};

const topics = [
  { title: "Linguagem e raciocínio", detail: "Língua Portuguesa e Matemática com raciocínio lógico e quantitativo." },
  { title: "Mercado e conduta", detail: "Atualidades do mercado financeiro, ética, compliance e ESG." },
  { title: "Base bancária", detail: "Conhecimentos bancários e securitários, matemática financeira, probabilidade e estatística." },
  { title: "Atendimento digital", detail: "Informática, comportamentos digitais, vendas, negociação e atendimento." }
];

const previews = [
  { number: 4, title: "Trilha da apostila", detail: "Veja as nove disciplinas e a distribuição das aulas." },
  { number: 49, title: "Conhecimentos bancários", detail: "Exemplo de aula sobre o Sistema Financeiro Nacional." },
  { number: 100, title: "Questões de treino", detail: "Confira o formato dos exercícios autorais." },
  { number: 197, title: "Gabaritos comentados", detail: "Entenda como as respostas são explicadas." }
];

export default async function BanestesPage() {
  const checkout = await getCuratedCheckout(product.slug);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: siteUrl(product.imageUrl),
    brand: { "@type": "Brand", name: "Nexora Concursos" },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: (product.priceCents / 100).toFixed(2),
      availability: checkout ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: siteUrl(`/concursos/${product.slug}#oferta`)
    }
  };

  return <main className="banestes-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="banestes-hero"><div className="container">
      <nav className="banestes-breadcrumb" aria-label="Caminho"><Link href="/">Início</Link><span>/</span><Link href="/produtos">Materiais</Link><span>/</span><span>BANESTES</span></nav>
      <div className="banestes-hero-grid"><div className="banestes-hero-copy">
        <span className="banestes-kicker">APOSTILA DIGITAL · TÉCNICO BANCÁRIO</span>
        <h1>Estude para o <em>BANESTES</em> com um plano claro.</h1>
        <p>Teoria, atividades, questões e simulados em uma apostila digital organizada para sua preparação ao cargo de Técnico Bancário.</p>
        <div className="banestes-hero-actions"><Link href="#oferta" className="banestes-button">Ver oferta de {money(product.priceCents)}</Link><Link href="#amostra" className="banestes-text-link">Ver páginas do material</Link></div>
        <div className="banestes-hero-foot"><span>PDF digital</span><span>44 aulas</span><span>Edição 2026/2027</span></div>
      </div><div className="banestes-cover"><Image src={product.imageUrl} alt="Arte da apostila BANESTES para Técnico Bancário" width={1100} height={1100} priority sizes="(max-width: 760px) 82vw, 430px" /></div></div>
    </div></section>

    <section className="banestes-stats" aria-label="O que contém a apostila"><div className="container banestes-stats-grid"><div><strong>44</strong><span>aulas em nove disciplinas</span></div><div><strong>300</strong><span>questões de treino</span></div><div><strong>03</strong><span>simulados de 70 questões</span></div><div><strong>230</strong><span>páginas no PDF</span></div></div></section>

    <section className="banestes-section banestes-topics" id="conteudo"><div className="container"><span className="banestes-overline">CONTEÚDO DA APOSTILA</span><h2>Nove disciplinas, uma trilha de estudo.</h2><p className="banestes-section-intro">As aulas combinam fundamento, exemplos guiados, atividades de fixação e orientação para corrigir erros.</p><div className="banestes-topic-grid">{topics.map((topic, index) => <article key={topic.title}><span>0{index + 1}</span><h3>{topic.title}</h3><p>{topic.detail}</p></article>)}</div></div></section>

    <section className="banestes-section banestes-method"><div className="container banestes-method-grid"><div><span className="banestes-overline">DO ESTUDO À PRÁTICA</span><h2>Leia, resolva e revise.</h2><p>O material inclui 44 páginas de atividades, um banco de 300 questões, gabaritos comentados e três simulados completos. Os planos de 30, 60 e 90 dias ajudam a distribuir o estudo e a revisão.</p></div><div className="banestes-method-card"><span>UM CICLO PARA CADA ROTINA</span><strong>30 · 60 · 90 dias</strong><p>Escolha o cronograma mais adequado ao seu tempo e acompanhe os assuntos que precisam de nova revisão.</p></div></div></section>

    <section className="banestes-section banestes-preview" id="amostra"><div className="container"><span className="banestes-overline">POR DENTRO DO PDF</span><h2>Veja páginas reais.</h2><p className="banestes-section-intro">Estas prévias foram extraídas da apostila. Abra uma imagem para ler a página em tamanho maior.</p><div className="banestes-preview-grid">{previews.map(preview => <a key={preview.number} href={`/banestes-tecnico-bancario/amostra-${preview.number}.webp`} target="_blank" rel="noopener noreferrer"><div className="banestes-preview-image"><Image src={`/banestes-tecnico-bancario/amostra-${preview.number}.webp`} alt={`Prévia da apostila: ${preview.title}`} width={893} height={1263} sizes="(max-width: 760px) 72vw, 24vw" /></div><div className="banestes-preview-text"><h3>{preview.title}</h3><p>{preview.detail}</p></div></a>)}</div><p className="banestes-preview-note">O PDF completo é entregue conforme as condições do checkout.</p></div></section>

    <section className="banestes-section banestes-offer" id="oferta"><div className="container banestes-offer-grid"><div><span className="banestes-overline">PREPARE SUA PRÓXIMA ETAPA</span><h2>Seu material de estudo em um único PDF.</h2><ul><li>44 aulas com atividades de fixação</li><li>300 questões autorais de treinamento</li><li>Três simulados de 70 questões</li><li>Gabaritos comentados e planos de estudo</li></ul></div><div className="banestes-price-card"><span>APOSTILA DIGITAL · BANESTES</span><strong>{money(product.priceCents)}</strong><p>Pagamento e condições de entrega confirmados na Cakto.</p>{checkout ? <CheckoutLink slug={product.slug} className="banestes-button banestes-buy-button">Quero minha apostila</CheckoutLink> : <button className="banestes-button banestes-buy-button" disabled>Compra disponível em breve</button>}<small>Publicação educacional independente, sem vínculo, autorização ou endosso do BANESTES ou da FCC. Questões autorais para estudo. Não há garantia de aprovação.</small></div></div></section>

    <section className="banestes-section banestes-faq"><div className="container banestes-faq-grid"><div><span className="banestes-overline">DÚVIDAS FREQUENTES</span><h2>Antes de começar.</h2></div><div className="banestes-faq-list"><details><summary>Em qual formato recebo a apostila?</summary><p>O material é digital, em PDF. A forma de acesso e entrega é informada no checkout da Cakto.</p></details><details><summary>As questões são de provas oficiais?</summary><p>Não. As questões e os simulados são exercícios autorais de treinamento, com gabaritos comentados.</p></details><details><summary>O material é oficial do BANESTES ou da FCC?</summary><p>Não. É uma publicação independente da Nexora Concursos, sem vínculo ou endosso dessas instituições.</p></details><details><summary>Como acompanho mudanças no concurso?</summary><p>Consulte o edital, suas retificações e os comunicados nos canais oficiais. Datas, regras e legislação podem mudar após a edição da apostila.</p></details></div></div></section>
  </main>;
}
