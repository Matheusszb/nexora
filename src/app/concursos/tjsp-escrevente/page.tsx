import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckoutLink } from "@/components/campaign-capture";
import { ProductDiscovery, productBreadcrumbSchema } from "@/components/product-discovery";
import { MobileCheckoutBar } from "@/components/mobile-checkout-bar";
import { getCuratedCheckout } from "@/lib/curated-checkout";
import { curatedProducts } from "@/lib/curated-products";
import { money, siteUrl } from "@/lib/format";
import "./tjsp.css";

export const dynamic = "force-dynamic";
const product = curatedProducts.find(item => item.slug === "tjsp-escrevente")!;

export const metadata: Metadata = {
  title: "Apostila TJSP Escrevente em PDF | 2026/2027",
  description: "Apostila TJSP Escrevente em PDF por R$ 34,00: teoria, exercícios, redação e 3 simulados autorais. Veja páginas reais antes de comprar.",
  alternates: { canonical: "/concursos/tjsp-escrevente" },
  openGraph: {
    title: "Apostila TJSP | Escrevente Técnico Judiciário | Nexora Concursos",
    description: product.shortDescription,
    images: [siteUrl(product.imageUrl)],
    url: siteUrl("/concursos/tjsp-escrevente"),
    type: "website"
  },
  twitter: { card: "summary_large_image", title: "Apostila TJSP Escrevente em PDF | Nexora Concursos", description: product.shortDescription, images: [siteUrl(product.imageUrl)] }
};

const topics = [
  { title: "Língua Portuguesa", detail: "Leitura, interpretação, relações de sentido e construções da norma-padrão." },
  { title: "Conhecimentos em Direito", detail: "Direito Penal, Processual Penal, Processual Civil, Constitucional e Administrativo, além da legislação interna do TJSP." },
  { title: "Conhecimentos gerais", detail: "Atualidades e inclusão, Matemática, Informática e Raciocínio Lógico." },
  { title: "Redação", detail: "Orientações e exercícios de texto dissertativo-argumentativo para treinar a escrita." }
];

const previews = [
  { number: 22, title: "Processo Civil", detail: "Veja o formato das aulas de Direito." },
  { number: 63, title: "Oficina de redação", detail: "Confira a proposta de treino da escrita." },
  { number: 65, title: "Simulado completo", detail: "Conheça um dos três simulados autorais." },
  { number: 79, title: "Gabarito comentado", detail: "Veja como as respostas são explicadas." }
];

export default async function TjspPage() {
  const checkout = await getCuratedCheckout(product.slug);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: siteUrl(product.imageUrl),
    url: siteUrl(`/concursos/${product.slug}`),
    brand: { "@type": "Brand", name: "Nexora Concursos" },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: (product.priceCents / 100).toFixed(2),
      availability: checkout ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: siteUrl(`/concursos/${product.slug}#oferta`)
    }
  };

  return <main className="tjsp-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([schema, productBreadcrumbSchema(product.name, product.slug)]).replace(/</g, "\\u003c") }} />
    <section className="tjsp-hero"><div className="container">
      <nav className="tjsp-breadcrumb" aria-label="Caminho"><Link href="/">Início</Link><span>/</span><Link href="/produtos">Materiais</Link><span>/</span><span>TJSP</span></nav>
      <div className="tjsp-hero-grid"><div className="tjsp-hero-copy">
        <span className="tjsp-kicker">APOSTILA DIGITAL · ESCREVENTE TJSP</span>
        <h1>Apostila <em>TJSP Escrevente</em> em PDF para estudar com direção.</h1>
        <p>Teoria, exercícios, treino de redação e três simulados autorais em uma apostila digital. Veja uma amostra antes da compra.</p>
        <div className="tjsp-hero-actions"><Link href="#oferta" className="tjsp-button">Ver oferta de {money(product.priceCents)}</Link><Link href="#amostra" className="tjsp-text-link">Ver páginas do material</Link></div>
        <div className="tjsp-hero-foot"><span>PDF digital</span><span>3 simulados</span><span>Edição 2026/2027</span></div>
      </div><div className="tjsp-cover"><Image src={product.imageUrl} alt="Arte da apostila TJSP para Escrevente Técnico Judiciário" width={1100} height={1100} priority sizes="(max-width: 760px) 82vw, 430px" /></div></div>
    </div></section>

    <section className="tjsp-stats" aria-label="O que contém a apostila"><div className="container tjsp-stats-grid"><div><strong>115</strong><span>páginas no PDF</span></div><div><strong>03</strong><span>simulados autorais</span></div><div><strong>70</strong><span>questões por simulado</span></div><div><strong>02</strong><span>planos de estudo</span></div></div></section>

    <section className="tjsp-section tjsp-topics" id="conteudo"><div className="container"><span className="tjsp-overline">CONTEÚDO DA APOSTILA</span><h2>Da teoria ao treino de prova.</h2><p className="tjsp-section-intro">O PDF organiza o conteúdo em aulas curtas, exemplos, exercícios de fixação, redação e simulados.</p><div className="tjsp-topic-grid">{topics.map((topic, index) => <article key={topic.title}><span>0{index + 1}</span><h3>{topic.title}</h3><p>{topic.detail}</p></article>)}</div></div></section>

    <section className="tjsp-section tjsp-method"><div className="container tjsp-method-grid"><div><span className="tjsp-overline">ESTUDO ORGANIZADO</span><h2>Leia, pratique e revise seus erros.</h2><p>A apostila traz cronogramas de 30 e 60 dias, exercícios nas aulas, uma oficina de redação e três simulados completos com gabaritos comentados. Use os resultados para direcionar a revisão.</p></div><div className="tjsp-method-card"><span>ESCOLHA SUA ROTINA</span><strong>30 ou 60 dias</strong><p>Os planos sugerem uma sequência para distribuir matérias, redação, simulados e revisão.</p></div></div></section>

    <section className="tjsp-section tjsp-preview" id="amostra"><div className="container"><span className="tjsp-overline">POR DENTRO DO PDF</span><h2>Veja páginas reais.</h2><p className="tjsp-section-intro">Estas prévias foram extraídas da apostila. Abra uma imagem para ler a página em tamanho maior.</p><div className="tjsp-preview-grid">{previews.map(preview => <a key={preview.number} href={`/tjsp-escrevente/amostra-${preview.number}.webp`} target="_blank" rel="noopener noreferrer"><div className="tjsp-preview-image"><Image src={`/tjsp-escrevente/amostra-${preview.number}.webp`} alt={`Prévia da apostila TJSP: ${preview.title}`} width={893} height={1263} sizes="(max-width: 760px) 72vw, 24vw" /></div><div className="tjsp-preview-text"><h3>{preview.title}</h3><p>{preview.detail}</p></div></a>)}</div><p className="tjsp-preview-note">O PDF completo é entregue conforme as condições do checkout.</p></div></section>

    <section className="tjsp-section tjsp-offer" id="oferta"><div className="container tjsp-offer-grid"><div><span className="tjsp-overline">PREPARE SUA PRÓXIMA ETAPA</span><h2>Seu material de estudo em um único PDF.</h2><ul><li>Aulas com exemplos e exercícios</li><li>Oficina de redação</li><li>Três simulados autorais de 70 questões</li><li>Gabaritos comentados e cronogramas</li></ul></div><div className="tjsp-price-card"><span>APOSTILA DIGITAL · ESCREVENTE TJSP</span><strong>{money(product.priceCents)}</strong><p>Pagamento e condições de entrega confirmados na Cakto.</p>{checkout ? <CheckoutLink slug={product.slug} className="tjsp-button tjsp-buy-button">Quero minha apostila</CheckoutLink> : <button className="tjsp-button tjsp-buy-button" disabled>Compra disponível em breve</button>}<small>Publicação educacional independente, sem vínculo, autorização ou endosso do TJSP ou da Fundação VUNESP. Questões autorais para estudo. Não há garantia de aprovação.</small></div></div></section>

    <section className="tjsp-section tjsp-faq"><div className="container tjsp-faq-grid"><div><span className="tjsp-overline">DÚVIDAS FREQUENTES</span><h2>Antes de começar.</h2></div><div className="tjsp-faq-list"><details><summary>Em qual formato recebo a apostila?</summary><p>O material é digital, em PDF. A forma de acesso e entrega é informada no checkout da Cakto.</p></details><details><summary>As questões são de provas oficiais?</summary><p>Não. Os exercícios e simulados são autorais e foram criados para treinamento.</p></details><details><summary>O material é oficial do TJSP ou da VUNESP?</summary><p>Não. É uma publicação independente da Nexora Concursos, sem vínculo ou endosso dessas instituições.</p></details><details><summary>Como acompanho alterações no concurso?</summary><p>Consulte o edital, as retificações, os atos e a legislação nos canais oficiais. As regras podem mudar após a edição da apostila.</p></details></div></div></section>
    <ProductDiscovery slug={product.slug} />
    <MobileCheckoutBar slug={product.slug} priceCents={product.priceCents} available={Boolean(checkout)} />
  </main>;
}
