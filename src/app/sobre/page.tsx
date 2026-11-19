import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sobre a Nexora Concursos", description: "Conheça a Nexora Concursos, seus materiais digitais e como conferir conteúdo, formato e condições de compra.", alternates: { canonical: "/sobre" }, openGraph: { title: "Sobre a Nexora Concursos", description: "Saiba como a Nexora apresenta apostilas digitais para concursos públicos.", url: siteUrl("/sobre"), type: "website", images: [siteUrl("/nexora-logo.png")] }, twitter: { card: "summary_large_image", title: "Sobre a Nexora Concursos", description: "Conheça os materiais digitais da Nexora.", images: [siteUrl("/nexora-logo.png")] } };
export default async function About() {
  let about = "A Nexora Digital reúne materiais digitais para quem se prepara para concursos públicos. Nosso objetivo é organizar as opções por carreira e apresentar com clareza o conteúdo, o formato e as condições de cada produto.";
  try { const setting = await db.siteSetting.findUnique({ where: { key: "aboutText" } }); if (setting?.value) about = setting.value; } catch {}
  return <main className="container page-shell"><div className="page-intro"><span className="eyebrow">SOBRE A NEXORA</span><h1>Foco na sua preparação para concursos.</h1><p>{about}</p></div><div className="prose"><h2>O que você encontra aqui</h2><p>O catálogo pode reunir apostilas, e-books, cursos e outros materiais de preparação para concursos públicos. Cada produto publicado apresenta seus próprios detalhes de conteúdo, formato, entrega e compra.</p><h2>Uma experiência direta</h2><p>Você escolhe uma área, lê as informações do material e, quando houver checkout configurado, segue para o ambiente oficial do provedor de pagamento.</p></div><div className="actions" style={{marginTop:35}}><Link className="btn btn-primary" href="/produtos">Ver materiais ↗</Link><Link className="btn btn-outline" href="/contato">Contato</Link></div></main>;
}
