import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckoutLink } from "@/components/campaign-capture";
import { ProductDiscovery, productBreadcrumbSchema } from "@/components/product-discovery";
import { MobileCheckoutBar } from "@/components/mobile-checkout-bar";
import { getCuratedCheckout } from "@/lib/curated-checkout";
import { curatedProducts } from "@/lib/curated-products";
import { money, siteUrl } from "@/lib/format";
import "./gcm.css";

export const dynamic = "force-dynamic";
const product = curatedProducts.find(item => item.slug === "gcm-2026")!;

export const metadata: Metadata = {
  title: "Apostila GCM em PDF | Guarda Civil Municipal 2026",
  description: "Apostila GCM em PDF por R$ 19,00: 37 aulas, 300 questões autorais, 3 simulados e cronogramas. Veja amostras antes de comprar.",
  alternates: { canonical: "/concursos/gcm-2026" },
  openGraph: {
    title: "Apostila GCM 2026 | Guarda Civil Municipal | Nexora Concursos",
    description: "Teoria, legislação, prática, questões e simulados em uma apostila digital de preparação geral para GCM.",
    images: [siteUrl(product.imageUrl)],
    url: siteUrl("/concursos/gcm-2026"),
    type: "website"
  },
  twitter: { card: "summary_large_image", title: "Apostila GCM em PDF | Nexora Concursos", description: product.shortDescription, images: [siteUrl(product.imageUrl)] }
};

const subjects = [
  { number: "01", count: "10 AULAS", title: "Base de prova", detail: "Português e Matemática: interpretação, gramática, porcentagens, lógica e resolução de problemas." },
  { number: "02", count: "10 AULAS", title: "Direito e informática", detail: "Informática, Direito Constitucional e Administrativo, com estudo dos conceitos e sua aplicação." },
  { number: "03", count: "04 AULAS", title: "Penal e processo", detail: "Teoria do crime, excludentes, crimes frequentes, flagrante e garantias processuais." },
  { number: "04", count: "13 AULAS", title: "Legislação e atuação GCM", detail: "Estatuto Geral das Guardas Municipais, SUSP, leis especiais, prevenção e atendimento ao cidadão." }
];

const previews = [
  { src: "/gcm-2026/amostra-11.webp", label: "AULA 01 · PORTUGUÊS", title: "Leitura orientada", detail: "Conceito, exemplo e atenção às armadilhas." },
  { src: "/gcm-2026/amostra-59.webp", label: "AULA 25 · LEGISLAÇÃO", title: "Estatuto das Guardas", detail: "Teoria sobre a Lei 13.022/2014 e aplicação." },
  { src: "/gcm-2026/amostra-77.webp", label: "AULA 34 · PRÁTICA", title: "Atuação cotidiana", detail: "Patrulhamento comunitário e prevenção." },
  { src: "/gcm-2026/amostra-175.webp", label: "SIMULADO 03", title: "Treino geral", detail: "Questões para medir seu progresso." }
];

export default async function GcmPage() {
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
      <nav className="gcm-breadcrumb" aria-label="Caminho"><Link href="/">Início</Link><span>/</span><Link href="/produtos">Materiais</Link><span>/</span><span>Guarda Civil Municipal</span></nav>
      <div className="gcm-hero-grid"><div className="gcm-hero-copy">
        <span className="gcm-kicker"><i aria-hidden="true"/> APOSTILA DIGITAL · PREPARAÇÃO GCM 2026</span>
        <h1>Apostila GCM em PDF para <em>Guarda Civil Municipal.</em></h1>
        <p>Preparação geral com 37 aulas, 300 questões autorais e três simulados. Confira o conteúdo e as amostras antes de comprar.</p>
        <div className="gcm-hero-actions"><Link className="gcm-button" href="#oferta">Ver oferta de {money(product.priceCents)} <span aria-hidden="true">↗</span></Link><Link className="gcm-hero-link" href="#amostra">Ver páginas da apostila ↓</Link></div>
        <div className="gcm-hero-foot"><span>PDF digital</span><span>37 aulas</span><span>Preparação geral</span></div>
      </div><div className="gcm-cover-stage"><div className="gcm-cover-frame"><Image src={product.imageUrl} alt="Capa da apostila GCM 2026 para Guarda Civil Municipal" width={1100} height={1100} priority sizes="(max-width: 760px) 88vw, 520px" /></div><span>EDIÇÃO 2026 <b>·</b> NEXORA CONCURSOS</span></div></div>
    </div></section>

    <section className="gcm-stats" aria-label="O que há na apostila"><div className="container gcm-stats-grid"><div><strong>37</strong><span>aulas em oito módulos</span></div><div><strong>300</strong><span>questões no banco de treino</span></div><div><strong>03</strong><span>simulados de 60 questões</span></div><div><strong>229</strong><span>páginas no PDF</span></div></div></section>

    <section className="gcm-section gcm-subjects" id="conteudo"><div className="container"><div className="gcm-heading"><div><span className="gcm-overline">O QUE VOCÊ VAI ESTUDAR</span><h2>Do fundamento à <em>atuação.</em></h2></div><p>Oito módulos organizados em 37 aulas para construir base teórica e levar o estudo a situações práticas.</p></div><div className="gcm-subject-grid">{subjects.map(subject => <article key={subject.number}><div className="gcm-subject-top"><span>{subject.number}</span><b>{subject.count}</b></div><h3>{subject.title}</h3><p>{subject.detail}</p><div className="gcm-subject-rule"/></article>)}</div><p className="gcm-subject-note">Apostila de preparação geral. Cada município define seu próprio edital, disciplinas, etapas e regras; compare o material ao programa da cidade em que pretende concorrer.</p></div></section>

    <section className="gcm-section gcm-method"><div className="container gcm-method-grid"><div><span className="gcm-overline">UM MÉTODO PARA USAR DE VERDADE</span><h2>Leia. Resolva. <em>Volte melhor.</em></h2><p>A cada aula, o PDF propõe explicar o tema com suas palavras, fazer exercícios sem consultar o gabarito e registrar o motivo dos erros. A revisão sugerida retoma os assuntos após 1, 7 e 21 dias.</p><div className="gcm-method-steps"><div><span>01</span><strong>Entenda</strong><p>Conceitos, exemplos guiados e casos de aplicação.</p></div><div><span>02</span><strong>Pratique</strong><p>300 questões autorais e três simulados gerais.</p></div><div><span>03</span><strong>Revise</strong><p>Gabaritos comentados, mapas e caderno de erros.</p></div></div></div><div className="gcm-plan-card"><span>ESTUDO QUE CABE NA ROTINA</span><strong>30, 60 ou 90 dias.</strong><p>Escolha um cronograma adaptável para distribuir matérias, correção e revisões ao longo da sua preparação.</p><div className="gcm-plan-lines"><span><b>30 DIAS</b><i/></span><span><b>60 DIAS</b><i/></span><span><b>90 DIAS</b><i/></span></div></div></div></section>

    <section className="gcm-section gcm-preview" id="amostra"><div className="container"><div className="gcm-heading"><div><span className="gcm-overline">PRÉVIA REAL DO PDF</span><h2>Veja como é por dentro.</h2></div><p>Estas páginas foram extraídas da apostila enviada. Abra uma amostra para ler em tamanho maior.</p></div><div className="gcm-preview-grid">{previews.map(preview => <a key={preview.src} href={preview.src} target="_blank" rel="noopener noreferrer" className="gcm-preview-card"><div className="gcm-preview-image"><Image src={preview.src} alt={`Prévia da apostila GCM: ${preview.title}`} width={923} height={1305} sizes="(max-width: 760px) 72vw, 24vw" /></div><div className="gcm-preview-text"><span>{preview.label}</span><h3>{preview.title}</h3><p>{preview.detail}</p></div></a>)}</div><p className="gcm-preview-foot">O PDF completo é entregue conforme as condições informadas no checkout.</p></div></section>

    <section className="gcm-section gcm-offer" id="oferta"><div className="container gcm-offer-grid"><div><span className="gcm-overline">SEU PRÓXIMO PASSO</span><h2>Organize sua preparação para <em>GCM.</em></h2><p>Uma apostila digital para reunir teoria, prática e ferramentas de revisão em um mesmo plano de estudo.</p><ul><li>37 aulas em oito módulos</li><li>Banco de 300 questões autorais com gabaritos comentados</li><li>Três simulados gerais de 60 questões</li><li>Cronogramas de 30, 60 e 90 dias</li></ul></div><div className="gcm-price-card"><span>APOSTILA DIGITAL · GUARDA CIVIL MUNICIPAL</span><strong>{money(product.priceCents)}</strong><p>Pagamento e condições de entrega confirmados na Cakto.</p>{checkout ? <CheckoutLink slug={product.slug} className="gcm-button gcm-buy-button">Quero minha apostila ↗</CheckoutLink> : <button className="gcm-button gcm-buy-button" disabled>Compra disponível em breve</button>}<small>Publicação educacional independente, sem vínculo oficial com prefeitura, guarda ou banca. Este material é geral e não substitui o edital do município escolhido.</small></div></div></section>

    <section className="gcm-section gcm-faq"><div className="container gcm-faq-grid"><div><span className="gcm-overline">DÚVIDAS FREQUENTES</span><h2>Antes de começar.</h2></div><div className="gcm-faq-list"><details><summary>A apostila serve para qual cidade?</summary><p>É uma preparação geral para GCM. Confira o edital da cidade em que pretende concorrer e compare disciplinas, legislação municipal e etapas exigidas.</p></details><details><summary>Em qual formato recebo o material?</summary><p>O material é digital, em PDF. A forma de acesso e entrega é informada no checkout da Cakto.</p></details><details><summary>As questões são de provas oficiais?</summary><p>Não. O banco de 300 questões e os simulados são exercícios autorais de treinamento, acompanhados de gabaritos comentados.</p></details><details><summary>O conteúdo legal pode mudar?</summary><p>Sim. Consulte sempre as versões oficiais atualizadas das leis e as retificações do edital municipal antes da prova.</p></details></div></div></section>
    <ProductDiscovery slug={product.slug} />
    <MobileCheckoutBar slug={product.slug} priceCents={product.priceCents} available={Boolean(checkout)} />
  </main>;
}
