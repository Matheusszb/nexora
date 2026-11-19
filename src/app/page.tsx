import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { getHomeData } from "@/lib/catalog-data";
import { ProductCard } from "@/components/product-card";
import { CuratedProductCard } from "@/components/curated-product-card";
import { curatedProducts, isLegacyCuratedProduct } from "@/lib/curated-products";
import { siteUrl } from "@/lib/format";
import type { Metadata } from "next";
import "./home-guides.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "Apostilas digitais para concursos públicos | Nexora Concursos" },
  description: "Encontre apostilas em PDF para GCM, BANESTES, TJSP e outros concursos. Veja o que cada material inclui, confira amostras e preços antes da compra.",
  alternates: { canonical: "/" },
  openGraph: { title: "Apostilas digitais para concursos | Nexora Concursos", description: "Escolha uma apostila em PDF, veja amostras e confira as condições antes de comprar.", url: siteUrl(), type: "website", images: [siteUrl("/nexora-logo.png")] },
  twitter: { card: "summary_large_image", title: "Apostilas digitais para concursos | Nexora Concursos", description: "Veja apostilas em PDF, preços e amostras antes de comprar.", images: [siteUrl("/nexora-logo.png")] }
};

const defaultHeroTitle = "Apostilas digitais para concursos: estude com direção.";
const defaultHeroSubtitle = "Escolha seu concurso, veja páginas reais da apostila e confira preço, conteúdo e entrega antes de comprar.";
const formerHeroTitle = "Sua preparação para concursos começa aqui.";
const formerHeroSubtitle = "Veja todos os cursos e apostilas para concursos, compare os materiais e escolha o que combina com sua preparação.";
const previousHeroTitle = "O próximo passo da sua evolução começa aqui.";
const previousHeroSubtitle = "Explore produtos digitais desenvolvidos para transformar conhecimento em novas possibilidades.";

const fallbackFaq = [
  { question: "Como escolho um material para meu concurso?", answer: "Comece pelo concurso que você quer prestar. Na página de cada produto, confira o conteúdo, o público indicado, o formato e os requisitos antes da compra." },
  { question: "O material acompanha um edital específico?", answer: "Quando houver relação com um edital ou concurso específico, essa informação deve constar na descrição do produto. Confira o conteúdo informado antes de comprar." },
  { question: "Como recebo o material?", answer: "O formato, o acesso e a entrega são descritos na página do produto e no checkout. Leia essas condições antes de finalizar o pedido." },
  { question: "A Nexora é ligada a bancas ou órgãos públicos?", answer: "Os materiais apresentados aqui são produtos digitais de preparação. Uma eventual parceria ou vínculo oficial só será informado quando existir e estiver descrito no produto." }
];

export default async function Home() {
  let products: Awaited<ReturnType<typeof db.product.findMany>> = [];
  let faqs = fallbackFaq;
  let testimonials: Awaited<ReturnType<typeof db.testimonial.findMany>> = [];
  let heroTitle = defaultHeroTitle;
  let heroSubtitle = defaultHeroSubtitle;
  let unavailable = false;
  try {
    const [publishedProducts, customFaq, approvedTestimonials, settings] = await getHomeData();
    products = publishedProducts.filter(product => !isLegacyCuratedProduct(product));
    if (customFaq.length) faqs = customFaq;
    testimonials = approvedTestimonials;
    for (const setting of settings) {
      if (setting.key === "heroTitle" && setting.value && ![previousHeroTitle, formerHeroTitle].includes(setting.value)) heroTitle = setting.value;
      if (setting.key === "heroSubtitle" && setting.value && ![previousHeroSubtitle, formerHeroSubtitle].includes(setting.value)) heroSubtitle = setting.value;
    }
  } catch { unavailable = true; }
  const structured = [
    { "@context": "https://schema.org", "@type": "WebSite", name: "Nexora Concursos", url: siteUrl() },
    { "@context": "https://schema.org", "@type": "Organization", name: "Nexora Concursos", alternateName: "Nexora Digital", url: siteUrl(), logo: siteUrl("/nexora-logo.png") }
  ];
  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    <section className="hero"><div className="container hero-inner">
      <div className="hero-copy">
        <span className="hero-kicker"><i/> PREPARAÇÃO PARA CONCURSOS</span>
        <h1>{heroTitle === defaultHeroTitle ? <>Apostilas digitais para <em>concursos</em>: estude com direção.</> : heroTitle}</h1>
        <p>{heroSubtitle}</p>
        <div className="actions"><Link className="btn btn-primary" href="/#materiais">Explorar materiais <span aria-hidden="true">↗</span></Link><Link className="btn btn-outline" href="/produtos">Buscar um concurso</Link></div>
        <div className="hero-proof"><span><b>◇</b> Escolha por carreira</span><span><b>↗</b> Confira antes de comprar</span><span><b>✦</b> Estude no seu ritmo</span></div>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="art-ring"/><div className="art-card"><div className="art-card-top"><span>NEXORA / DIGITAL</span><span>01 — 04</span></div><Image src="/nexora-symbol.png" alt="" width={350} height={350} className="art-card-logo"/><div className="art-card-bottom"><span>PREPARE-SE COM FOCO</span><span>↗</span></div></div><i className="art-spark one"/><i className="art-spark two"/></div>
    </div></section>
    <div className="trust-strip"><div className="container"><span className="trust-item"><strong>◇</strong> Todos os materiais</span><span className="trust-item"><strong>⌁</strong> Materiais digitais</span><span className="trust-item"><strong>↗</strong> Checkout oficial</span><span className="trust-item"><strong>✧</strong> Detalhes antes da compra</span></div></div>
    <section className="section" id="materiais"><div className="container"><div className="section-head"><div><span className="eyebrow">CATÁLOGO NEXORA</span><h2>Apostilas digitais para concursos</h2></div></div><div className="product-grid course-list">{curatedProducts.map(product => <CuratedProductCard key={product.slug} product={product} hidePrice/>)}{products.map(product => <ProductCard key={product.id} product={product} hidePrice/>)}</div>{unavailable && <p className="catalog-count">Os outros materiais estão temporariamente indisponíveis.</p>}</div></section>
    <section className="section benefits"><div className="container"><div className="section-head"><div><span className="eyebrow">ESCOLHA COM CLAREZA</span><h2>Encontre o material certo para estudar</h2></div></div><div className="benefit-grid"><div className="benefit"><span className="benefit-icon">◇</span><h3>Explore todos os materiais</h3><p>Role a lista de materiais e encontre o curso ou apostila para o concurso que você quer prestar.</p></div><div className="benefit"><span className="benefit-icon">⌘</span><h3>Confira o conteúdo</h3><p>Veja o que está incluído, para quem é indicado e quais são os requisitos de cada produto.</p></div><div className="benefit"><span className="benefit-icon">↗</span><h3>Compra com informações</h3><p>Confira preço, entrega e condições antes de seguir para o checkout oficial.</p></div><div className="benefit"><span className="benefit-icon">✧</span><h3>Estude no seu ritmo</h3><p>Escolha o formato de material que se encaixa na sua rotina de preparação.</p></div></div></div></section>
    {testimonials.length > 0 && <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">EXPERIÊNCIAS REAIS</span><h2>O que dizem os compradores</h2></div></div><div className="testimonial-grid">{testimonials.map(t => <blockquote key={t.id}><span>“</span><p>{t.quote}</p><cite>{t.name}</cite></blockquote>)}</div></div></section>}
    <section className="section" id="faq"><div className="container"><div className="section-head" style={{justifyContent:"center",textAlign:"center"}}><div><span className="eyebrow">DÚVIDAS FREQUENTES</span><h2>Antes de começar a estudar</h2></div></div><div className="faq-list">{faqs.map(f => <details key={f.question}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</div></div></section>
    <section className="section" style={{paddingTop:0}}><div className="container"><div className="cta-band"><div><span className="eyebrow">SEU PRÓXIMO PASSO</span><h2>Explore os materiais para o concurso que você quer prestar.</h2></div><Link href="/#materiais" className="btn btn-primary">Ver materiais ↗</Link></div></div></section>
    <section className="section home-guides"><div className="container"><div className="section-head"><div><span className="eyebrow">GUIAS DE ESTUDO</span><h2>Planeje antes de escolher</h2></div><Link className="text-link" href="/blog">Ver todos os guias ↗</Link></div><p>Aprenda a conferir o edital e organizar sua preparação para GCM, Escrevente TJSP e BANESTES.</p></div></section>
  </main>;
}
