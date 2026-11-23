import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckoutLink } from "@/components/campaign-capture";
import { MetaProductView } from "@/components/meta-product-view";
import { getCuratedCheckout } from "@/lib/curated-checkout";
import { curatedProducts } from "@/lib/curated-products";
import { money, siteUrl } from "@/lib/format";
import "./ibge.css";

export const dynamic = "force-dynamic";
const product = curatedProducts.find(item => item.slug === "ibge-recenseador")!;

export const metadata: Metadata = {
  title: "Apostila IBGE 2026/2027 para Recenseador",
  description: "Conheça a apostila digital para Recenseador IBGE: 34 aulas, 300 questões de treino, três simulados de 60 questões e cronogramas de estudo.",
  alternates: { canonical: "/concursos/ibge-recenseador" },
  openGraph: {
    title: "Apostila IBGE 2026/2027 | Recenseador | Nexora Concursos",
    description: "Português, Matemática e Conhecimentos Técnicos em um plano de estudo com teoria, questões e simulados.",
    images: [siteUrl(product.imageUrl)],
    url: siteUrl("/concursos/ibge-recenseador"),
    type: "website"
  }
};

const subjects = [
  { number: "01", count: "10 AULAS", title: "Língua Portuguesa", detail: "Compreensão e organização de textos, ortografia, pontuação, classes de palavras, concordância e regência." },
  { number: "02", count: "10 AULAS", title: "Matemática", detail: "Operações, frações, razão, proporção, porcentagem, equações, medidas, geometria e leitura de gráficos." },
  { number: "03", count: "14 AULAS", title: "Conhecimentos Técnicos", detail: "Organização do Censo, funções da equipe, setor censitário, mapas, endereços e situações de coleta." }
];

const previews = [
  { src: "/ibge-recenseador/amostra-11.webp", label: "AULA 01 · PORTUGUÊS", title: "Leitura com método", detail: "Conceito, aplicação e revisão ativa." },
  { src: "/ibge-recenseador/amostra-41.webp", label: "AULA 16 · MATEMÁTICA", title: "Matemática aplicada", detail: "Exemplos guiados e atenção aos erros comuns." },
  { src: "/ibge-recenseador/amostra-55.webp", label: "AULA 23 · TÉCNICOS", title: "Conteúdo do campo", detail: "Estrutura censitária e situações práticas." },
  { src: "/ibge-recenseador/amostra-169.webp", label: "SIMULADO 03", title: "Treino de prova", detail: "Questões para praticar a gestão do tempo." }
];

export default async function IbgeRecenseadorPage() {
  const checkout = await getCuratedCheckout(product.slug);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: siteUrl(product.imageUrl),
    brand: { "@type": "Brand", name: "Nexora Concursos" },
    offers: { "@type": "Offer", priceCurrency: "BRL", price: (product.priceCents / 100).toFixed(2), availability: checkout ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: siteUrl(`/concursos/${product.slug}#oferta`) }
  };

  return <main className="ibge-page" data-meta-product-id={product.slug} data-meta-product-name={product.name} data-meta-price-cents={product.priceCents}>
    <MetaProductView slug={product.slug} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="ibge-hero">
      <div className="container">
        <nav className="ibge-breadcrumb" aria-label="Caminho"><Link href="/">Início</Link><span>/</span><Link href="/produtos">Materiais</Link><span>/</span><span>Recenseador IBGE</span></nav>
        <div className="ibge-hero-grid">
          <div className="ibge-hero-copy">
            <span className="ibge-kicker"><i aria-hidden="true"/> APOSTILA DIGITAL · RECENSEADOR 2026/2027</span>
            <h1>Prepare-se para o IBGE com <em>um plano claro.</em></h1>
            <p>Teoria por assunto, treino em questões e simulados para estudar com direção — da primeira leitura à revisão final.</p>
            <div className="ibge-hero-actions"><Link className="ibge-button" href="#amostra">Ver a apostila por dentro <span aria-hidden="true">↗</span></Link><Link className="ibge-hero-link" href="#conteudo">Explorar o conteúdo ↓</Link></div>
            <div className="ibge-hero-foot"><span>PDF digital</span><span>Questões autorais</span><span>Estudo no seu ritmo</span></div>
          </div>
          <div className="ibge-cover-stage"><div className="ibge-cover-frame"><Image src={product.imageUrl} alt="Capa da apostila IBGE Recenseador 2026/2027" width={1100} height={1100} priority sizes="(max-width: 760px) 88vw, 520px" /></div><span>EDIÇÃO 2026/2027 <b>·</b> NEXORA CONCURSOS</span></div>
        </div>
      </div>
    </section>

    <section className="ibge-stats" aria-label="O que há na apostila"><div className="container ibge-stats-grid"><div><strong>34</strong><span>aulas organizadas</span></div><div><strong>300</strong><span>questões no banco de treino</span></div><div><strong>03</strong><span>simulados de 60 questões</span></div><div><strong>223</strong><span>páginas no PDF</span></div></div></section>

    <section className="ibge-section ibge-subjects" id="conteudo"><div className="container"><div className="ibge-heading"><div><span className="ibge-overline">TRILHA DE ESTUDO</span><h2>Três matérias. <em>Uma direção.</em></h2></div><p>As 34 aulas percorrem Português, Matemática e Conhecimentos Técnicos, sempre com foco na aplicação do assunto.</p></div><div className="ibge-subject-grid">{subjects.map(subject => <article key={subject.number}><div className="ibge-subject-top"><span>{subject.number}</span><b>{subject.count}</b></div><h3>{subject.title}</h3><p>{subject.detail}</p><div className="ibge-subject-rule"/></article>)}</div><p className="ibge-subject-note">Confira o edital e suas retificações nos canais oficiais. Esta apostila é um material de preparação independente.</p></div></section>

    <section className="ibge-section ibge-method"><div className="container ibge-method-grid"><div><span className="ibge-overline">ESTUDE COM INTENÇÃO</span><h2>Entenda. Pratique. <em>Revise.</em></h2><p>O PDF propõe um ciclo simples: leia, explique o conceito sem consultar, resolva as atividades e registre por que errou. Retome os pontos difíceis depois de 1, 7 e 21 dias.</p><div className="ibge-method-steps"><div><span>01</span><strong>Aprenda</strong><p>Aulas com conceitos, exemplos guiados e casos de aplicação.</p></div><div><span>02</span><strong>Teste</strong><p>300 questões no caderno e três simulados de 60 questões.</p></div><div><span>03</span><strong>Corrija</strong><p>Gabaritos comentados, caderno de erros e revisão ativa.</p></div></div></div><div className="ibge-plan-card"><span>SEU RITMO, SEU PLANO</span><strong>30, 60 ou 90 dias.</strong><p>Escolha um cronograma adaptável para distribuir teoria, exercícios e revisão de acordo com a sua rotina.</p><div className="ibge-plan-lines"><span><b>30 DIAS</b><i/></span><span><b>60 DIAS</b><i/></span><span><b>90 DIAS</b><i/></span></div></div></div></section>

    <section className="ibge-section ibge-preview" id="amostra"><div className="container"><div className="ibge-heading"><div><span className="ibge-overline">PÁGINAS REAIS DO MATERIAL</span><h2>Veja antes de decidir.</h2></div><p>As prévias abaixo foram extraídas do PDF enviado. Abra uma delas para ler em tamanho maior.</p></div><div className="ibge-preview-grid">{previews.map(preview => <a key={preview.src} href={preview.src} target="_blank" rel="noopener noreferrer" className="ibge-preview-card"><div className="ibge-preview-image"><Image src={preview.src} alt={`Prévia da apostila: ${preview.title}`} width={923} height={1305} sizes="(max-width: 760px) 72vw, 24vw" /></div><div className="ibge-preview-text"><span>{preview.label}</span><h3>{preview.title}</h3><p>{preview.detail}</p></div></a>)}</div><p className="ibge-preview-foot">O arquivo completo é disponibilizado conforme as condições apresentadas no checkout.</p></div></section>

    <section className="ibge-section ibge-offer" id="oferta"><div className="container ibge-offer-grid"><div><span className="ibge-overline">COMECE SUA PREPARAÇÃO</span><h2>Seu estudo, <em>em um só lugar.</em></h2><p>Uma apostila digital para transformar conteúdo em prática e acompanhar o progresso até os simulados.</p><ul><li>34 aulas em Português, Matemática e Conhecimentos Técnicos</li><li>300 questões de treino com gabaritos comentados</li><li>Três simulados de 60 questões</li><li>Cronogramas e ferramentas de revisão</li></ul></div><div className="ibge-price-card"><span>APOSTILA DIGITAL · RECENSEADOR IBGE</span><strong>{money(product.priceCents)}</strong><p>Pagamento e condições de entrega confirmados na Cakto.</p>{checkout ? <CheckoutLink slug={product.slug} className="ibge-button ibge-buy-button">Quero minha apostila ↗</CheckoutLink> : <button className="ibge-button ibge-buy-button" disabled>Compra disponível em breve</button>}<small>Material independente da Nexora Concursos, sem vínculo oficial com o IBGE ou a Fundação Cesgranrio. As questões são autorais e não há garantia de aprovação.</small></div></div></section>

    <section className="ibge-section ibge-faq"><div className="container ibge-faq-grid"><div><span className="ibge-overline">DÚVIDAS FREQUENTES</span><h2>Antes de começar.</h2></div><div className="ibge-faq-list"><details><summary>Em qual formato recebo a apostila?</summary><p>É um material digital em PDF. A entrega e o acesso seguem as condições informadas no checkout da Cakto.</p></details><details><summary>As questões são oficiais da banca?</summary><p>Não. O banco de questões e os simulados são exercícios autorais de treinamento, com gabaritos e comentários no material.</p></details><details><summary>O material é oficial do IBGE?</summary><p>Não. É uma publicação educacional independente da Nexora Concursos, sem vínculo oficial com o IBGE ou a Fundação Cesgranrio.</p></details><details><summary>Como acompanho alterações do edital?</summary><p>Consulte os comunicados, o edital e as retificações nos canais oficiais da banca. Datas e regras podem mudar depois da edição da apostila.</p></details></div></div></section>
  </main>;
}
