import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sobre nós", description: "Conheça a proposta da Nexora Digital e explore nosso catálogo de produtos digitais.", alternates: { canonical: "/sobre" } };
export default async function About() {
  let about = "A Nexora Digital reúne produtos digitais voltados a aprendizado, qualificação e produtividade. Nosso objetivo é apresentar cada material com informações claras para ajudar você a escolher o que faz sentido para o seu momento.";
  try { const setting = await db.siteSetting.findUnique({ where: { key: "aboutText" } }); if (setting?.value) about = setting.value; } catch {}
  return <main className="container page-shell"><div className="page-intro"><span className="eyebrow">SOBRE A NEXORA</span><h1>Ideias para o seu próximo passo.</h1><p>{about}</p></div><div className="prose"><h2>O que você encontra aqui</h2><p>O catálogo pode reunir e-books, cursos, planilhas, materiais educativos e outras ferramentas digitais. Cada produto publicado apresenta seus próprios detalhes de conteúdo, formato, entrega e compra.</p><h2>Uma experiência direta</h2><p>Você explora o catálogo, lê as informações do produto e, quando houver checkout configurado, segue para o ambiente oficial do provedor de pagamento.</p></div><div className="actions" style={{marginTop:35}}><Link className="btn btn-primary" href="/produtos">Explorar produtos ↗</Link><Link className="btn btn-outline" href="/contato">Contato</Link></div></main>;
}
