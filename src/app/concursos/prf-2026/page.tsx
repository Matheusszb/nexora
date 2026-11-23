import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckoutLink } from "@/components/campaign-capture";
import { ProductDiscovery, productBreadcrumbSchema } from "@/components/product-discovery";
import { MobileCheckoutBar } from "@/components/mobile-checkout-bar";
import { getCuratedCheckout } from "@/lib/curated-checkout";
import { curatedProducts } from "@/lib/curated-products";
import { money, siteUrl } from "@/lib/format";
import "../gcm-2026/gcm.css";

export const dynamic = "force-dynamic";
const product = curatedProducts.find(item => item.slug === "prf-2026")!;

export const metadata: Metadata = {
  title: "Apostila PRF 2026 em PDF | Preparação pré-edital",
  description: "Apostila PRF 2026 por R$ 19,90: 246 páginas, 39 aulas, 195 itens autorais, três simulados de revisão e cronogramas. Veja amostras do PDF.",
  alternates: { canonical: "/concursos/prf-2026" },
  openGraph: {
    title: "Apostila PRF 2026 | Nexora Concursos",
    description: product.shortDescription,
    images: [siteUrl(product.imageUrl)],
    url: siteUrl("/concursos/prf-2026"),
    type: "website"
  },
  twitter: { card: "summary_large_image", title: "Apostila PRF 2026 | Nexora Concursos", description: product.shortDescription, images: [siteUrl(product.imageUrl)] }
};

const subjects = [
  { number: "01", count: "BASE", title: "Linguagens e raciocínio", detail: "Português, redação oficial, raciocínio lógico, matemática, inglês e espanhol instrumental." },
  { number: "02", count: "CIÊNCIAS", title: "Física e informática", detail: "Movimento, frenagem, forças, energia, segurança da informação, redes e ferramentas digitais." },
  { number: "03", count: "TRÂNSITO", title: "Legislação de trânsito", detail: "Circulação, sinalização, infrações, habilitação, veículos, crimes de trânsito e fiscalização." },
  { number: "04", count: "DIREITO", title: "Direito e atuação pública", detail: "Constitucional, Administrativo, Penal, Processo Penal, legislação especial, ética e geopolítica." }
];

const previews = [
  { src: "/prf-2026/amostra-6.webp", label: "AULA 01 · PORTUGUÊS", title: "Teoria e exemplo", detail: "Uma página de aula extraída do PDF." },
  { src: "/prf-2026/amostra-78.webp", label: "AULA 25 · TRÂNSITO", title: "Legislação aplicada", detail: "Conceitos de infrações, penalidades e medidas." },
  { src: "/prf-2026/amostra-202.webp", label: "SIMULADO 01", title: "Treino certo ou errado", detail: "Itens reaplicados para revisão diagnóstica." },
  { src: "/prf-2026/amostra-237.webp", label: "PLANO DE ESTUDO", title: "Cronograma de 30 dias", detail: "Uma das três sugestões de organização." }
];

export default async function PrfPage() {
  const checkout = await getCuratedCheckout(product.slug);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: siteUrl(product.imageUrl),
    url: siteUrl(`/concursos/${product.slug}`),
    brand: { "@type": "Brand", name: "Nexora Concursos" },
    offers: { "@type": "Offer", priceCurrency: "BRL", price: (product.priceCents / 100).toFixed(2), availability: checkout ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: siteUrl(`/concursos/${product.slug}#oferta`) }
  };

  return <main className="gcm-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([schema, productBreadcrumbSchema(product.name, product.slug)]).replace(/</g, "\\u003c") }} />
    <section className="gcm-hero"><div className="container">
      <nav className="gcm-breadcrumb" aria-label="Caminho"><Link href="/">Início</Link><span>/</span><Link href="/produtos">Materiais</Link><span>/</span><span>PRF 2026</span></nav>
      <div className="gcm-hero-grid"><div className="gcm-hero-copy">
        <span className="gcm-kicker"><i aria-hidden="true"/> APOSTILA DIGITAL · PREPARAÇÃO PRÉ-EDITAL</span>
        <h1>Apostila PRF 2026 para uma preparação <em>organizada.</em></h1>
        <p>Estude com 39 aulas, exercícios de certo ou errado, gabaritos comentados e planos de revisão. Conheça o conteúdo e veja páginas reais antes de comprar.</p>
        <div className="gcm-hero-actions"><Link className="gcm-button" href="#oferta">Ver oferta de {money(product.priceCents)} <span aria-hidden="true">↗</span></Link><Link className="gcm-hero-link" href="#amostra">Ver páginas da apostila ↓</Link></div>
        <div className="gcm-hero-foot"><span>PDF digital</span><span>246 páginas</span><span>Edição novembro/2026</span></div>
      </div><div className="gcm-cover-stage"><div className="gcm-cover-frame"><Image src={product.imageUrl} alt="Capa da apostila PRF 2026 da Nexora Concursos" width={1100} height={1100} priority sizes="(max-width: 760px) 88vw, 520px" /></div><span>PRF 2026 <b>·</b> NEXORA CONCURSOS</span></div></div>
    </div></section>

    <section className="gcm-stats" aria-label="O que há na apostila"><div className="container gcm-stats-grid"><div><strong>39</strong><span>aulas em várias disciplinas</span></div><div><strong>195</strong><span>itens autorais de treino</span></div><div><strong>03</strong><span>simulados de revisão</span></div><div><strong>246</strong><span>páginas no PDF</span></div></div></section>

    <section className="gcm-section gcm-subjects" id="conteudo"><div className="container"><div className="gcm-heading"><div><span className="gcm-overline">O QUE VOCÊ VAI ESTUDAR</span><h2>Uma trilha para construir <em>sua base.</em></h2></div><p>As 39 aulas reúnem teoria, exemplos guiados, exercícios de fixação e correções comentadas.</p></div><div className="gcm-subject-grid">{subjects.map(subject => <article key={subject.number}><div className="gcm-subject-top"><span>{subject.number}</span><b>{subject.count}</b></div><h3>{subject.title}</h3><p>{subject.detail}</p><div className="gcm-subject-rule"/></article>)}</div><p className="gcm-subject-note">Material de preparação geral pré-edital. O concurso de 2021 é uma referência histórica; confira disciplinas, requisitos, etapas e normas no próximo edital oficial.</p></div></section>

    <section className="gcm-section gcm-method"><div className="container gcm-method-grid"><div><span className="gcm-overline">COMO USAR O MATERIAL</span><h2>Leia, pratique e <em>revise.</em></h2><p>O PDF propõe revisar os conteúdos após 1, 7 e 21 dias. Os 195 itens-base aparecem nas aulas e retornam no caderno de revisão. Os três simulados selecionam itens desse mesmo banco para diagnóstico.</p><div className="gcm-method-steps"><div><span>01</span><strong>Aprenda</strong><p>Teoria e exemplos guiados por tema.</p></div><div><span>02</span><strong>Resolva</strong><p>Itens de certo ou errado com gabaritos comentados.</p></div><div><span>03</span><strong>Acompanhe</strong><p>Registre erros, acertos e próximas revisões.</p></div></div></div><div className="gcm-plan-card"><span>PLANO QUE CABE NA ROTINA</span><strong>30, 60 ou 90 dias.</strong><p>Use os cronogramas sugeridos para distribuir aulas, questões e revisões. Adapte o plano ao seu tempo e ao edital que vier a ser publicado.</p><div className="gcm-plan-lines"><span><b>30 DIAS</b><i/></span><span><b>60 DIAS</b><i/></span><span><b>90 DIAS</b><i/></span></div></div></div></section>

    <section className="gcm-section gcm-preview" id="amostra"><div className="container"><div className="gcm-heading"><div><span className="gcm-overline">PRÉVIA REAL DO PDF</span><h2>Veja a apostila por dentro.</h2></div><p>Estas quatro páginas foram extraídas do arquivo enviado. Abra cada amostra para ler em tamanho maior.</p></div><div className="gcm-preview-grid">{previews.map(preview => <a key={preview.src} href={preview.src} target="_blank" rel="noopener noreferrer" className="gcm-preview-card"><div className="gcm-preview-image"><Image src={preview.src} alt={`Prévia da apostila PRF: ${preview.title}`} width={923} height={1305} sizes="(max-width: 760px) 72vw, 24vw" /></div><div className="gcm-preview-text"><span>{preview.label}</span><h3>{preview.title}</h3><p>{preview.detail}</p></div></a>)}</div><p className="gcm-preview-foot">O PDF completo é entregue conforme as condições informadas no checkout.</p></div></section>

    <section className="gcm-section gcm-offer" id="oferta"><div className="container gcm-offer-grid"><div><span className="gcm-overline">SUA PREPARAÇÃO</span><h2>Comece a estudar para a <em>PRF.</em></h2><p>Uma apostila digital para reunir as matérias, exercícios e ferramentas de revisão em um único plano pré-edital.</p><ul><li>39 aulas com teoria e exemplos guiados</li><li>195 itens autorais, reaplicados para revisão</li><li>Três simulados diagnósticos de 60 itens</li><li>Cronogramas de 30, 60 e 90 dias</li></ul></div><div className="gcm-price-card"><span>APOSTILA DIGITAL · PRF 2026</span><strong>{money(product.priceCents)}</strong><p>Pagamento e condições de entrega confirmados na Cakto.</p>{checkout ? <CheckoutLink slug={product.slug} className="gcm-button gcm-buy-button">Quero minha apostila ↗</CheckoutLink> : <button className="gcm-button gcm-buy-button" disabled>Compra disponível em breve</button>}<small>Publicação educacional independente, sem vínculo ou endosso da PRF ou do Cebraspe. Preparação pré-edital, sem promessa de aprovação.</small></div></div></section>

    <section className="gcm-section gcm-faq"><div className="container gcm-faq-grid"><div><span className="gcm-overline">DÚVIDAS FREQUENTES</span><h2>Antes de começar.</h2></div><div className="gcm-faq-list"><details><summary>Já existe edital PRF 2026?</summary><p>A apostila é uma preparação geral pré-edital e não afirma a existência de um edital específico de 2026. Consulte os canais oficiais para informações sobre concursos.</p></details><details><summary>Os simulados têm questões inéditas?</summary><p>Não. Os três simulados reorganizam itens autorais já usados nas aulas e no caderno de revisão. Eles servem como diagnóstico de aprendizagem.</p></details><details><summary>Em qual formato recebo a apostila?</summary><p>O material é digital, em PDF. A forma de acesso e entrega é informada no checkout da Cakto.</p></details><details><summary>A legislação pode mudar?</summary><p>Sim. Confira sempre o edital e as versões oficiais atualizadas do CTB, das resoluções e das demais normas antes da prova.</p></details></div></div></section>
    <ProductDiscovery slug={product.slug} />
    <MobileCheckoutBar slug={product.slug} priceCents={product.priceCents} available={Boolean(checkout)} />
  </main>;
}
