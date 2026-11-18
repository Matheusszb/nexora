import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckoutLink } from "@/components/campaign-capture";
import { getCuratedCheckout } from "@/lib/curated-checkout";
import { curatedProducts } from "@/lib/curated-products";
import { money, siteUrl } from "@/lib/format";
import "./pcpe.css";

export const dynamic = "force-dynamic";
const product = curatedProducts.find(item => item.slug === "pcpe-agente")!;

export const metadata: Metadata = {
  title: "Apostila PC-PE 2026 para Agente de Polícia",
  description: "Conheça a apostila digital PC-PE para Agente de Polícia: 46 aulas, 497 questões autorais, três simulados, redação e cronogramas de estudo.",
  alternates: { canonical: "/concursos/pcpe-agente" },
  openGraph: {
    title: "Apostila PC-PE 2026 | Agente de Polícia | Nexora Concursos",
    description: "Teoria, questões, simulados e redação em um plano de estudo para Agente da Polícia Civil de Pernambuco.",
    images: [siteUrl(product.imageUrl)],
    url: siteUrl("/concursos/pcpe-agente"),
    type: "website"
  }
};

const subjects = [
  { label: "LEGISLAÇÃO ESTADUAL", amount: "05", detail: "Constituição de Pernambuco, estatutos e leis complementares estaduais." },
  { label: "DIREITO", amount: "18", detail: "Constitucional, Administrativo, Penal e Processo Penal." },
  { label: "PORTUGUÊS E INFORMÁTICA", amount: "09", detail: "Leitura, gramática, ferramentas digitais e segurança." },
  { label: "RACIOCÍNIO, CONTABILIDADE E ESTATÍSTICA", amount: "11", detail: "Lógica, cálculo, registros contábeis e análise de dados." },
  { label: "REDAÇÃO", amount: "03", detail: "Planejamento do texto, argumentação e revisão." }
];

const previews = [
  { src: "/pcpe-agente/amostra-8.webp", label: "AULA 01 · LEGISLAÇÃO", title: "Teoria com aplicação", detail: "Conceito, exemplo guiado e atenção às armadilhas." },
  { src: "/pcpe-agente/amostra-82.webp", label: "AULA 38 · CONTABILIDADE", title: "Explicação por assunto", detail: "O mesmo método em outras frentes do edital." },
  { src: "/pcpe-agente/amostra-102.webp", label: "CADERNO DE QUESTÕES", title: "Treino objetivo", detail: "Questões de cinco alternativas para praticar." },
  { src: "/pcpe-agente/amostra-190.webp", label: "SIMULADO 03", title: "Ritmo de prova", detail: "Uma prévia do bloco de simulados do PDF." }
];

export default async function PcpePage() {
  const checkout = await getCuratedCheckout(product.slug);
  const canBuy = Boolean(checkout && product.priceCents != null);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: siteUrl(product.imageUrl),
    brand: { "@type": "Brand", name: "Nexora Concursos" },
    ...(product.priceCents != null ? { offers: { "@type": "Offer", priceCurrency: "BRL", price: (product.priceCents / 100).toFixed(2), availability: canBuy ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: siteUrl(`/concursos/${product.slug}#oferta`) } } : {})
  };

  return <main className="pcpe-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="pcpe-hero">
      <div className="container">
        <nav className="pcpe-breadcrumb" aria-label="Caminho"><Link href="/">Início</Link><span>/</span><Link href="/produtos">Materiais</Link><span>/</span><span>Agente PC-PE</span></nav>
        <div className="pcpe-hero-grid">
          <div className="pcpe-hero-copy">
            <div className="pcpe-kicker"><span/> APOSTILA DIGITAL · PC-PE 2026</div>
            <h1>O seu próximo passo para a <em>Polícia Civil de Pernambuco.</em></h1>
            <p>Um material para estudar com sequência: entenda a matéria, pratique com questões e acompanhe seus erros até chegar aos simulados.</p>
            <div className="pcpe-hero-actions"><Link className="pcpe-button" href="#amostra">Explorar a apostila <span aria-hidden="true">↗</span></Link><Link href="#oferta" className="pcpe-hero-link">Ver a oferta ↓</Link></div>
            <div className="pcpe-hero-notes"><span>PDF digital</span><span>46 aulas organizadas</span><span>Estudo no seu ritmo</span></div>
          </div>
          <div className="pcpe-cover-wrap"><div className="pcpe-cover-frame"><Image src={product.imageUrl} alt="Capa da apostila PC-PE para Agente de Polícia" width={1100} height={1100} priority sizes="(max-width: 760px) 88vw, 520px" /></div><span className="pcpe-cover-caption">NEXORA CONCURSOS / EDIÇÃO NOVEMBRO 2026</span></div>
        </div>
      </div>
    </section>

    <section className="pcpe-stats" aria-label="Números da apostila"><div className="container pcpe-stats-grid"><div><strong>46</strong><span>aulas por assunto</span></div><div><strong>497</strong><span>questões autorais, incluindo simulados</span></div><div><strong>03</strong><span>simulados de 60 questões</span></div><div><strong>229</strong><span>páginas no PDF</span></div></div></section>

    <section className="pcpe-section pcpe-structure" id="conteudo"><div className="container pcpe-structure-grid"><div className="pcpe-structure-intro"><span className="pcpe-overline">UM CAMINHO DE ESTUDO</span><h2>Da leitura ao treino. <em>Sem perder a direção.</em></h2><p>A apostila reúne 11 áreas de estudo. Cada aula apresenta o conceito, uma aplicação prática e pontos que costumam causar confusão. Depois, você avança para atividades, questões e simulados.</p><div className="pcpe-structure-callout"><b>01 / 07 / 21</b><span>Proposta de revisão espaçada, com caderno de erros para registrar o que precisa voltar ao seu plano.</span></div></div><div className="pcpe-structure-list"><div className="pcpe-list-head"><span>DISCIPLINAS</span><span>AULAS</span></div>{subjects.map(subject => <article key={subject.label}><div><h3>{subject.label}</h3><p>{subject.detail}</p></div><strong>{subject.amount}</strong></article>)}</div></div></section>

    <section className="pcpe-section pcpe-method"><div className="container"><div className="pcpe-heading"><div><span className="pcpe-overline">CONSTRUÍDA PARA A ROTINA</span><h2>Um plano para sair da teoria.</h2></div><p>Você pode escolher o ritmo de estudo conforme o tempo disponível e voltar aos pontos que exigem mais atenção.</p></div><div className="pcpe-method-grid"><article><span>01</span><h3>Aprenda com contexto</h3><p>46 aulas em blocos curtos, com explicação, exemplos guiados e atividades de recuperação ativa.</p></article><article><span>02</span><h3>Pratique e corrija</h3><p>Caderno de questões com cinco alternativas, gabaritos explicados e três simulados de 60 questões.</p></article><article><span>03</span><h3>Treine a redação</h3><p>Três aulas sobre texto argumentativo e propostas para planejar, escrever, revisar e reescrever.</p></article><article className="pcpe-method-highlight"><span>30 · 60 · 90</span><h3>Organize seus dias</h3><p>Cronogramas adaptáveis para distribuir leitura, prática, revisão e simulação ao longo da preparação.</p></article></div></div></section>

    <section className="pcpe-section pcpe-preview" id="amostra"><div className="container"><div className="pcpe-heading"><div><span className="pcpe-overline">POR DENTRO DO PDF</span><h2>Veja páginas reais.</h2></div><p>Estas imagens foram extraídas da apostila enviada. Abra uma prévia para ler a página em tamanho maior.</p></div><div className="pcpe-preview-grid">{previews.map(preview => <a key={preview.src} href={preview.src} target="_blank" rel="noopener noreferrer" className="pcpe-preview-card"><div className="pcpe-preview-image"><Image src={preview.src} alt={`Prévia da apostila PC-PE: ${preview.title}`} width={923} height={1305} sizes="(max-width: 760px) 72vw, 24vw" /></div><div className="pcpe-preview-text"><span>{preview.label}</span><h3>{preview.title}</h3><p>{preview.detail}</p></div></a>)}</div><p className="pcpe-preview-foot">As prévias são parte do material; o PDF completo é entregue conforme as condições do checkout.</p></div></section>

    <section className="pcpe-section pcpe-offer" id="oferta"><div className="container pcpe-offer-grid"><div><span className="pcpe-overline">SUA PREPARAÇÃO COMEÇA AQUI</span><h2>Tenha tudo em um único material.</h2><p>Teoria, prática, redação e ferramentas para acompanhar a sua evolução na preparação para Agente da PC-PE.</p><ul><li>46 aulas em 11 áreas de estudo</li><li>497 questões autorais, incluindo três simulados</li><li>Gabaritos explicados e caderno de erros</li><li>Cronogramas de 30, 60 e 90 dias</li></ul></div><div className="pcpe-purchase-card"><span>APOSTILA DIGITAL · AGENTE PC-PE</span>{product.compareAtPriceCents != null && <s>{money(product.compareAtPriceCents)}</s>}<strong>{product.priceCents == null ? "Preço em breve" : money(product.priceCents)}</strong><p>Pagamento e condições de entrega confirmados na Cakto.</p>{canBuy ? <CheckoutLink slug={product.slug} className="pcpe-button pcpe-buy-button">Quero minha apostila ↗</CheckoutLink> : <button className="pcpe-button pcpe-buy-button" disabled>Compra disponível em breve</button>}<small>Publicação educacional independente, sem vínculo oficial com a Polícia Civil de Pernambuco ou a banca Cebraspe. Não há garantia de aprovação.</small></div></div></section>

    <section className="pcpe-section pcpe-faq"><div className="container pcpe-faq-grid"><div><span className="pcpe-overline">DÚVIDAS FREQUENTES</span><h2>Antes de começar.</h2></div><div className="pcpe-faq-list"><details><summary>Em qual formato recebo a apostila?</summary><p>O material é digital, em PDF. A forma de acesso e entrega é informada no checkout da Cakto.</p></details><details><summary>É uma publicação oficial da PC-PE?</summary><p>Não. É uma apostila independente da Nexora Concursos, sem vínculo oficial com a Polícia Civil de Pernambuco ou a banca Cebraspe.</p></details><details><summary>O que há além das aulas?</summary><p>O PDF traz questões autorais, três simulados, gabaritos explicados, atividades de redação, cronogramas e ferramentas de revisão.</p></details><details><summary>Como devo conferir mudanças no concurso?</summary><p>Consulte o edital e suas retificações nos canais oficiais da banca. Regras, legislação e datas podem mudar após a edição do material.</p></details></div></div></section>
  </main>;
}
