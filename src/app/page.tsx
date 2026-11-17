import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import { CategoryShowcase } from "@/components/category-showcase";
import { siteUrl } from "@/lib/format";

export const dynamic = "force-dynamic";

const fallbackFaq = [
  { question: "Como faço para comprar?", answer: "Abra a página do produto. Quando houver um botão de compra disponível, ele direcionará ao checkout oficial configurado para aquele item." },
  { question: "Quais formas de pagamento estão disponíveis?", answer: "As opções e condições de pagamento são apresentadas no checkout do produto antes de concluir o pedido." },
  { question: "Como recebo meu produto digital?", answer: "O formato e o processo de entrega devem estar descritos na página do produto e no checkout. Verifique essas informações antes da compra." },
  { question: "Posso pedir reembolso?", answer: "As condições aplicáveis devem constar na página do produto e no checkout. Consulte também nossa política de reembolso, que está em revisão." }
];

export default async function Home() {
  let products: Awaited<ReturnType<typeof db.product.findMany<{ include: { category: true } }>>> = [];
  let categories: Awaited<ReturnType<typeof db.category.findMany<{ include: { _count: { select: { products: true } } } }>>> = [];
  let faqs = fallbackFaq;
  let testimonials: Awaited<ReturnType<typeof db.testimonial.findMany>> = [];
  let heroTitle = "O próximo passo da sua evolução começa aqui.";
  let heroSubtitle = "Explore produtos digitais desenvolvidos para transformar conhecimento em novas possibilidades.";
  let unavailable = false;
  try {
    [products, categories] = await Promise.all([
      db.product.findMany({ where: { status: "PUBLISHED", category: { active: true } }, include: { category: true }, orderBy: [{ featured: "desc" }, { publishedAt: "desc" }], take: 6 }),
      db.category.findMany({ where: { active: true, products: { some: { status: "PUBLISHED" } } }, include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], take: 8 })
    ]);
    const customFaq = await db.faq.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
    if (customFaq.length) faqs = customFaq;
    testimonials = await db.testimonial.findMany({ where: { active: true, authorized: true }, orderBy: { sortOrder: "asc" }, take: 3 });
    const settings = await db.siteSetting.findMany({ where: { key: { in: ["heroTitle","heroSubtitle"] } } });
    for (const setting of settings) { if (setting.key === "heroTitle" && setting.value) heroTitle = setting.value; if (setting.key === "heroSubtitle" && setting.value) heroSubtitle = setting.value; }
  } catch { unavailable = true; }
  const structured = [{ "@context": "https://schema.org", "@type": "WebSite", name: "Nexora Digital", url: siteUrl() }, { "@context": "https://schema.org", "@type": "Organization", name: "Nexora Digital", url: siteUrl(), logo: siteUrl("/nexora-logo.png") }];

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    <section className="hero"><div className="container hero-inner"><div className="hero-copy"><span className="hero-kicker"><i/> CONHECIMENTO QUE MOVE VOCÊ</span><h1>{heroTitle === "O próximo passo da sua evolução começa aqui." ? <>O próximo passo da sua <em>evolução</em> começa aqui.</> : heroTitle}</h1><p>{heroSubtitle}</p><div className="actions"><Link className="btn btn-primary" href="/produtos">Explorar produtos <span aria-hidden="true">↗</span></Link><Link className="btn btn-outline" href="/sobre">Conhecer a Nexora</Link></div><div className="hero-proof"><span><b>◇</b> Conteúdo digital</span><span><b>↗</b> Compra pelo checkout oficial</span><span><b>✦</b> Experiência simples</span></div></div><div className="hero-art" aria-hidden="true"><div className="art-ring"/><div className="art-card"><div className="art-card-top"><span>NEXORA / DIGITAL</span><span>01 — 04</span></div><Image src="/nexora-symbol.png" alt="" width={350} height={350} className="art-card-logo"/><div className="art-card-bottom"><span>EXPLORE NOVAS POSSIBILIDADES</span><span>↗</span></div></div><i className="art-spark one"/><i className="art-spark two"/></div></div></section>
    <div className="trust-strip"><div className="container"><span className="trust-item"><strong>◇</strong> Produtos digitais</span><span className="trust-item"><strong>⌁</strong> Catálogo em evolução</span><span className="trust-item"><strong>↗</strong> Checkout externo oficial</span><span className="trust-item"><strong>✧</strong> Detalhes antes da compra</span></div></div>
    <CategoryShowcase categories={categories} unavailable={unavailable}/>
    <section className="section" style={{paddingTop:0}}><div className="container"><div className="section-head"><div><span className="eyebrow">Seleção Nexora</span><h2>Produtos em destaque</h2></div><Link className="text-link" href="/produtos">Ver catálogo completo ↗</Link></div>{products.length ? <div className="product-grid">{products.map(product => <ProductCard key={product.id} product={product}/>)}</div> : <div className="empty-state"><h2>Em breve, novos produtos</h2><p>{unavailable ? "Não foi possível carregar o catálogo agora." : "Os produtos publicados pela Nexora aparecerão aqui."}</p></div>}</div></section>
    <section className="section benefits"><div className="container"><div className="section-head"><div><span className="eyebrow">Uma jornada mais clara</span><h2>Escolha com confiança</h2></div></div><div className="benefit-grid"><div className="benefit"><span className="benefit-icon">◇</span><h3>100% digital</h3><p>Materiais criados para serem acessados em formato digital, conforme os detalhes de cada produto.</p></div><div className="benefit"><span className="benefit-icon">⌘</span><h3>Informações completas</h3><p>Veja conteúdo, requisitos, forma de entrega e condições antes de seguir para a compra.</p></div><div className="benefit"><span className="benefit-icon">↗</span><h3>Checkout oficial</h3><p>Quando disponível, a compra acontece no ambiente do provedor indicado pelo produto.</p></div><div className="benefit"><span className="benefit-icon">✧</span><h3>Seu ritmo</h3><p>Encontre temas ligados a aprendizado, produtividade e desenvolvimento profissional.</p></div></div></div></section>
    {testimonials.length > 0 && <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">EXPERIÊNCIAS REAIS</span><h2>O que dizem os compradores</h2></div></div><div className="testimonial-grid">{testimonials.map(t => <blockquote key={t.id}><span>“</span><p>{t.quote}</p><cite>{t.name}</cite></blockquote>)}</div></div></section>}
    <section className="section" id="faq"><div className="container"><div className="section-head" style={{justifyContent:"center",textAlign:"center"}}><div><span className="eyebrow">Dúvidas frequentes</span><h2>Antes de começar</h2></div></div><div className="faq-list">{faqs.map(f => <details key={f.question}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</div></div></section>
    <section className="section" style={{paddingTop:0}}><div className="container"><div className="cta-band"><div><span className="eyebrow">PRONTO PARA EXPLORAR?</span><h2>Encontre o material certo para o seu próximo passo.</h2></div><Link href="/produtos" className="btn btn-primary">Explorar catálogo ↗</Link></div></div></section>
  </main>;
}
