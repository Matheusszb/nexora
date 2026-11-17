import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import { CategoryShowcase } from "@/components/category-showcase";
import { siteUrl } from "@/lib/format";

export const dynamic = "force-dynamic";

const defaultHeroTitle = "Sua preparação para concursos começa aqui.";
const defaultHeroSubtitle = "Encontre materiais digitais por carreira e área, confira os detalhes de cada produto e escolha o que combina com sua rotina de estudos.";
const previousHeroTitle = "O próximo passo da sua evolução começa aqui.";
const previousHeroSubtitle = "Explore produtos digitais desenvolvidos para transformar conhecimento em novas possibilidades.";

const fallbackFaq = [
  { question: "Como escolho um material para meu concurso?", answer: "Comece pela área ou carreira de interesse. Na página de cada produto, confira o conteúdo, o público indicado, o formato e os requisitos antes da compra." },
  { question: "O material acompanha um edital específico?", answer: "Quando houver relação com um edital ou concurso específico, essa informação deve constar na descrição do produto. Confira o conteúdo informado antes de comprar." },
  { question: "Como recebo o material?", answer: "O formato, o acesso e a entrega são descritos na página do produto e no checkout. Leia essas condições antes de finalizar o pedido." },
  { question: "A Nexora é ligada a bancas ou órgãos públicos?", answer: "Os materiais apresentados aqui são produtos digitais de preparação. Uma eventual parceria ou vínculo oficial só será informado quando existir e estiver descrito no produto." }
];

export default async function Home() {
  let products: Awaited<ReturnType<typeof db.product.findMany<{ include: { category: true } }>>> = [];
  let categories: Awaited<ReturnType<typeof db.category.findMany<{ include: { _count: { select: { products: true } } } }>>> = [];
  let faqs = fallbackFaq;
  let testimonials: Awaited<ReturnType<typeof db.testimonial.findMany>> = [];
  let heroTitle = defaultHeroTitle;
  let heroSubtitle = defaultHeroSubtitle;
  let unavailable = false;
  try {
    [products, categories] = await Promise.all([
      db.product.findMany({ where: { status: "PUBLISHED", category: { active: true } }, include: { category: true }, orderBy: [{ featured: "desc" }, { publishedAt: "desc" }], take: 6 }),
      db.category.findMany({ where: { active: true, products: { some: { status: "PUBLISHED" } } }, include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], take: 8 })
    ]);
    const customFaq = await db.faq.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
    if (customFaq.length) faqs = customFaq;
    testimonials = await db.testimonial.findMany({ where: { active: true, authorized: true }, orderBy: { sortOrder: "asc" }, take: 3 });
    const settings = await db.siteSetting.findMany({ where: { key: { in: ["heroTitle", "heroSubtitle"] } } });
    for (const setting of settings) {
      if (setting.key === "heroTitle" && setting.value && setting.value !== previousHeroTitle) heroTitle = setting.value;
      if (setting.key === "heroSubtitle" && setting.value && setting.value !== previousHeroSubtitle) heroSubtitle = setting.value;
    }
  } catch { unavailable = true; }
  const structured = [
    { "@context": "https://schema.org", "@type": "WebSite", name: "Nexora Digital", url: siteUrl() },
    { "@context": "https://schema.org", "@type": "Organization", name: "Nexora Digital", url: siteUrl(), logo: siteUrl("/nexora-logo.png") }
  ];
  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    <section className="hero"><div className="container hero-inner">
      <div className="hero-copy">
        <span className="hero-kicker"><i/> PREPARAÇÃO PARA CONCURSOS</span>
        <h1>{heroTitle === defaultHeroTitle ? <>Sua preparação para <em>concursos</em> começa aqui.</> : heroTitle}</h1>
        <p>{heroSubtitle}</p>
        <div className="actions"><Link className="btn btn-primary" href="/produtos">Explorar materiais <span aria-hidden="true">↗</span></Link><Link className="btn btn-outline" href="/#categorias">Ver áreas de concurso</Link></div>
        <div className="hero-proof"><span><b>◇</b> Escolha por carreira</span><span><b>↗</b> Confira antes de comprar</span><span><b>✦</b> Estude no seu ritmo</span></div>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="art-ring"/><div className="art-card"><div className="art-card-top"><span>NEXORA / DIGITAL</span><span>01 — 04</span></div><Image src="/nexora-symbol.png" alt="" width={350} height={350} className="art-card-logo"/><div className="art-card-bottom"><span>PREPARE-SE COM FOCO</span><span>↗</span></div></div><i className="art-spark one"/><i className="art-spark two"/></div>
    </div></section>
    <div className="trust-strip"><div className="container"><span className="trust-item"><strong>◇</strong> Áreas de concurso</span><span className="trust-item"><strong>⌁</strong> Materiais digitais</span><span className="trust-item"><strong>↗</strong> Checkout oficial</span><span className="trust-item"><strong>✧</strong> Detalhes antes da compra</span></div></div>
    <CategoryShowcase categories={categories} unavailable={unavailable}/>
    <section className="section" style={{paddingTop:0}}><div className="container"><div className="section-head"><div><span className="eyebrow">SELEÇÃO NEXORA</span><h2>Materiais para sua preparação</h2></div><Link className="text-link" href="/produtos">Ver catálogo completo ↗</Link></div>{products.length ? <div className="product-grid">{products.map(product => <ProductCard key={product.id} product={product}/>)}</div> : <div className="empty-state"><h2>Materiais em preparação</h2><p>{unavailable ? "Não foi possível carregar o catálogo agora. Tente novamente em instantes." : "Os materiais publicados para concursos aparecerão aqui."}</p></div>}</div></section>
    <section className="section benefits"><div className="container"><div className="section-head"><div><span className="eyebrow">ESCOLHA COM CLAREZA</span><h2>Encontre o material certo para estudar</h2></div></div><div className="benefit-grid"><div className="benefit"><span className="benefit-icon">◇</span><h3>Comece pela carreira</h3><p>Explore as áreas de concurso disponíveis e encontre materiais relacionados ao seu objetivo.</p></div><div className="benefit"><span className="benefit-icon">⌘</span><h3>Confira o conteúdo</h3><p>Veja o que está incluído, para quem é indicado e quais são os requisitos de cada produto.</p></div><div className="benefit"><span className="benefit-icon">↗</span><h3>Compra com informações</h3><p>Confira preço, entrega e condições antes de seguir para o checkout oficial.</p></div><div className="benefit"><span className="benefit-icon">✧</span><h3>Estude no seu ritmo</h3><p>Escolha o formato de material que se encaixa na sua rotina de preparação.</p></div></div></div></section>
    {testimonials.length > 0 && <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">EXPERIÊNCIAS REAIS</span><h2>O que dizem os compradores</h2></div></div><div className="testimonial-grid">{testimonials.map(t => <blockquote key={t.id}><span>“</span><p>{t.quote}</p><cite>{t.name}</cite></blockquote>)}</div></div></section>}
    <section className="section" id="faq"><div className="container"><div className="section-head" style={{justifyContent:"center",textAlign:"center"}}><div><span className="eyebrow">DÚVIDAS FREQUENTES</span><h2>Antes de começar a estudar</h2></div></div><div className="faq-list">{faqs.map(f => <details key={f.question}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</div></div></section>
    <section className="section" style={{paddingTop:0}}><div className="container"><div className="cta-band"><div><span className="eyebrow">SEU PRÓXIMO PASSO</span><h2>Explore os materiais para o concurso que você quer prestar.</h2></div><Link href="/produtos" className="btn btn-primary">Ver materiais ↗</Link></div></div></section>
  </main>;
}
