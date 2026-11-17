import type { Metadata } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contato", description: "Entre em contato com a Nexora Digital.", alternates: { canonical: "/contato" } };
export default async function Contact() {
  let email = "";
  try { email = (await db.siteSetting.findUnique({ where: { key: "contactEmail" } }))?.value || ""; } catch {}
  return <main className="container page-shell"><div className="page-intro"><span className="eyebrow">FALE COM A NEXORA</span><h1>Como podemos ajudar?</h1><p>Para dúvidas sobre um produto, informe o nome do material e descreva sua pergunta. Questões sobre pagamento e acesso também podem ser consultadas no checkout do produto.</p></div><div className="prose"><h2>Canal de contato</h2>{email ? <p>Envie sua mensagem para <a className="text-link" href={`mailto:${email}`}>{email}</a>.</p> : <p>O canal de atendimento será publicado aqui quando estiver configurado.</p>}</div></main>;
}
