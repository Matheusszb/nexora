import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckoutLink } from "@/components/campaign-capture";
import { getCuratedCheckout } from "@/lib/curated-checkout";
import { curatedProducts } from "@/lib/curated-products";
import { money, siteUrl } from "@/lib/format";
import "./pmsp.css";

export const dynamic = "force-dynamic";
const product = curatedProducts.find(item => item.slug === "pmsp-2026")!;

export const metadata: Metadata = {
  title: "Apostila PM-SP 2026 para Soldado PM",
  description: "Conheça a apostila digital para Soldado PM-SP 2026: 47 aulas, 414 questões e itens objetivos, três simulados e cronogramas de estudo.",
  alternates: { canonical: "/concursos/pmsp-2026" },
  openGraph: { title: "Apostila PM-SP 2026 | Nexora Concursos", description: "Teoria, prática e revisão em uma apostila digital para Soldado PM-SP.", images: [siteUrl(product.imageUrl)], url: siteUrl("/concursos/pmsp-2026"), type: "website" }
};

const subjects = [
  { number: "01", name: "Língua Portuguesa", detail: "Interpretação, gramática, sintaxe e produção de sentido." },
  { number: "02", name: "Matemática", detail: "Operações, porcentagem, equações, geometria e resolução de problemas." },
  { number: "03", name: "Conhecimentos Gerais", detail: "História, geografia e temas de atualidades tratados no material." },
  { number: "04", name: "Informática", detail: "Conceitos, ferramentas digitais, arquivos e segurança." },
  { number: "05", name: "Administração Pública", detail: "Constituição, direitos fundamentais e temas da área pública." },
  { number: "06", name: "Redação", detail: "Estrutura argumentativa, coesão, revisão e treino de escrita." }
];

const previews = [
  { src: "/pmsp-2026/amostra-7.webp", label: "AULA 01", title: "Teoria com aplicação", description: "Conceito, exemplo resolvido e revisão ativa." },
  { src: "/pmsp-2026/amostra-27.webp", label: "AULA 11", title: "Matemática passo a passo", description: "Explicações e treino por assunto." },
  { src: "/pmsp-2026/amostra-155.webp", label: "SIMULADO 01", title: "Treino em formato de prova", description: "Questões para medir seu progresso." }
];

export default async function PmspPage() {
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

  return <main className="pmsp-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="pmsp-hero">
      <div className="container">
        <nav className="pmsp-breadcrumb" aria-label="Caminho"><Link href="/">Início</Link><span>/</span><Link href="/produtos">Materiais</Link><span>/</span><span>PM-SP 2026</span></nav>
        <div className="pmsp-hero-grid">
          <div className="pmsp-hero-copy">
            <span className="pmsp-kicker"><i aria-hidden="true"/> APOSTILA DIGITAL · SOLDADO PM-SP 2026</span>
            <h1>Estude com direção.<br/><em>Chegue mais preparado.</em></h1>
            <p>Uma apostila para transformar conteúdo em prática: aulas por assunto, exercícios, simulados e um plano de revisão para acompanhar seu progresso.</p>
            <div className="pmsp-hero-actions"><Link className="pmsp-button pmsp-button-red" href="#oferta">Conhecer a apostila <span aria-hidden="true">↗</span></Link><Link className="pmsp-text-link" href="#amostra">Ver páginas por dentro ↓</Link></div>
            <div className="pmsp-hero-proof"><span>✓ Arquivo digital em PDF</span><span>✓ Estudo no seu ritmo</span><span>✓ Material independente</span></div>
          </div>
          <div className="pmsp-cover-stage"><div className="pmsp-cover-glow"/><div className="pmsp-cover-frame"><Image src={product.imageUrl} alt="Capa da apostila preparatória PM-SP 2026" width={1100} height={1100} priority sizes="(max-width: 760px) 88vw, 520px"/></div><span className="pmsp-cover-caption">PREPARATÓRIO COMPLETO <b>2026</b></span></div>
        </div>
      </div>
    </section>

    <section className="pmsp-numbers" aria-label="O que há na apostila"><div className="container pmsp-numbers-grid"><div><strong>47</strong><span>aulas temáticas</span></div><div><strong>414</strong><span>questões e itens objetivos</span></div><div><strong>03</strong><span>simulados de 60 questões</span></div><div><strong>213</strong><span>páginas no PDF</span></div></div></section>

    <section className="pmsp-section pmsp-method" id="material"><div className="container pmsp-method-grid"><div><span className="pmsp-overline">UM MATERIAL PARA USAR DE VERDADE</span><h2>Menos estudo solto.<br/>Mais sequência.</h2><p>O conteúdo começa com a explicação, avança para exemplos e termina em prática ativa. Assim, você pode identificar o que já domina e o que precisa revisar.</p><div className="pmsp-method-steps"><div><span>01</span><strong>Entenda</strong><p>Aulas temáticas com conceito e exemplo resolvido.</p></div><div><span>02</span><strong>Pratique</strong><p>Exercícios de fixação, questões e simulados.</p></div><div><span>03</span><strong>Revise</strong><p>Caderno de erros e retomadas em 1, 7 e 21 dias.</p></div></div></div><div className="pmsp-method-feature"><span className="pmsp-feature-mark">N / 26</span><strong>Um plano que cabe na sua rotina.</strong><p>O PDF traz cronogramas de 30, 60 e 90 dias para organizar disciplinas, prática e revisão.</p><div className="pmsp-plan-bars"><span><b>30 DIAS</b><i/></span><span><b>60 DIAS</b><i/></span><span><b>90 DIAS</b><i/></span></div></div></div></section>

    <section className="pmsp-section pmsp-contents"><div className="container"><div className="pmsp-section-heading"><div><span className="pmsp-overline">CONTEÚDO DA APOSTILA</span><h2>Do fundamento ao treino.</h2></div><p>Uma visão das frentes de estudo presentes nas 47 aulas e no caderno de questões.</p></div><div className="pmsp-subjects">{subjects.map(subject => <article key={subject.number}><span>{subject.number}</span><div><h3>{subject.name}</h3><p>{subject.detail}</p></div><b aria-hidden="true">↗</b></article>)}</div><p className="pmsp-contents-note">O PDF também inclui flashcards, orientações para redação, links de apoio e gabaritos comentados. Confira sempre o edital e suas retificações como referência oficial.</p></div></section>

    <section className="pmsp-section pmsp-preview" id="amostra"><div className="container"><div className="pmsp-section-heading"><div><span className="pmsp-overline">VEJA POR DENTRO</span><h2>Uma prévia real do material.</h2></div><p>Estas páginas foram retiradas da apostila enviada. Toque para abrir a amostra em tamanho maior.</p></div><div className="pmsp-preview-grid">{previews.map(preview => <a href={preview.src} target="_blank" rel="noopener noreferrer" className="pmsp-preview-card" key={preview.src}><div className="pmsp-preview-image"><Image src={preview.src} alt={`Prévia da apostila: ${preview.title}`} width={800} height={1132} sizes="(max-width: 720px) 82vw, 30vw"/></div><div className="pmsp-preview-caption"><span>{preview.label}</span><h3>{preview.title}</h3><p>{preview.description}</p></div></a>)}</div><p className="pmsp-preview-note">Amostra ilustrativa. O arquivo completo é disponibilizado conforme as condições apresentadas no checkout.</p></div></section>

    <section className="pmsp-section pmsp-offer" id="oferta"><div className="container pmsp-offer-grid"><div><span className="pmsp-overline">SEU PRÓXIMO PASSO</span><h2>Prepare seu estudo para a PM-SP 2026.</h2><p>Apostila digital com teoria, prática, simulados e ferramentas de revisão em um único PDF.</p><ul><li>47 aulas temáticas com treino ativo</li><li>414 questões e itens objetivos, incluindo três simulados</li><li>Cronogramas de 30, 60 e 90 dias</li><li>Redação, flashcards e gabaritos comentados</li></ul></div><div className="pmsp-price-card"><span>APOSTILA DIGITAL · ACESSO PELO CHECKOUT</span><s>{money(product.compareAtPriceCents)}</s><strong>{money(product.priceCents)}</strong><p>Pagamento e condições de entrega confirmados na Cakto.</p>{checkout ? <CheckoutLink slug={product.slug} className="pmsp-button pmsp-button-red pmsp-buy-button">Quero minha apostila ↗</CheckoutLink> : <button className="pmsp-button pmsp-buy-button" disabled>Compra disponível em breve</button>}<small>Material independente. Não é uma publicação oficial da PM-SP ou da VUNESP e não garante aprovação.</small></div></div></section>

    <section className="pmsp-section pmsp-faq"><div className="container pmsp-faq-grid"><div><span className="pmsp-overline">ANTES DE COMEÇAR</span><h2>Dúvidas frequentes.</h2><p>Confira as informações essenciais antes de seguir para o checkout.</p></div><div className="pmsp-faq-list"><details><summary>Em qual formato recebo a apostila?</summary><p>O material é um arquivo digital em PDF. As condições de entrega e acesso são informadas no checkout da Cakto.</p></details><details><summary>O material é oficial da Polícia Militar?</summary><p>Não. É uma apostila educacional independente da Nexora Concursos, sem vínculo oficial com a PM-SP ou com a VUNESP.</p></details><details><summary>A apostila contém questões e simulados?</summary><p>Sim. O PDF informa 414 questões e itens objetivos no caderno de treinamento, incluindo três simulados autorais de 60 questões.</p></details><details><summary>Como organizar meu estudo?</summary><p>Você encontra cronogramas de 30, 60 e 90 dias, além de uma proposta de revisão ativa e caderno de erros.</p></details></div></div></section>
  </main>;
}
