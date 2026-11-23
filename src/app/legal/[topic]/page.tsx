import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";

const pages = {
  privacidade: { title: "Política de Privacidade", sections: [["Dados tratados", "A loja pública pode receber dados técnicos necessários ao funcionamento do site. A compra ocorre no checkout do provedor externo, sujeito às políticas próprias desse serviço."],["Finalidade", "Dados de contato fornecidos voluntariamente e dados de pedidos recebidos por integração oficial poderão ser usados para atendimento e operação da compra."],["Seus direitos", "Solicitações de acesso, correção ou exclusão devem ser encaminhadas ao canal de contato publicado neste site."]] },
  termos: { title: "Termos de Uso", sections: [["Uso do site", "O catálogo apresenta produtos digitais disponíveis para consulta. Informações específicas de cada produto, inclusive formato e entrega, constam na respectiva página."],["Compra", "Quando disponível, o botão de compra redireciona ao checkout externo oficial. Preços e condições devem ser confirmados antes da conclusão do pagamento."],["Conteúdo", "A aquisição de produtos digitais não transfere direitos autorais. As condições de licença deverão ser informadas por produto."]] },
  reembolso: { title: "Política de Reembolso", sections: [["Condições", "As condições de reembolso devem ser consultadas na página do produto e no checkout antes da compra. Direitos legais aplicáveis permanecem preservados."],["Solicitações", "Para solicitar suporte ou reembolso, utilize o canal de atendimento indicado no checkout e, quando disponível, a página de contato da Nexora Digital."]] },
  cookies: { title: "Política de Cookies", sections: [["Cookies necessários", "Cookies essenciais podem ser usados para manter a sessão de administradores e a segurança da plataforma."],["Rastreamento opcional", "Com sua autorização, o Pixel da Meta mede visualizações de páginas e produtos e o início de checkout. A escolha fica salva no armazenamento local do navegador. Você pode alterá-la pelo botão Preferências de cookies no rodapé. O checkout externo tem sua própria política de privacidade."]] }
} as const;

type Topic = keyof typeof pages;
export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> { const { topic } = await params; const page = pages[topic as Topic]; return page ? { title: page.title, robots: { index: false, follow: false } } : {}; }
export default async function Legal({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params; const page = pages[topic as Topic]; if (!page) notFound();
  const key = { privacidade: "legalPrivacy", termos: "legalTerms", reembolso: "legalRefund", cookies: "legalCookies" }[topic as Topic];
  let custom = ""; try { custom = (await db.siteSetting.findUnique({ where: { key } }))?.value || ""; } catch {}
  return <main className="container page-shell"><div className="page-intro"><span className="eyebrow">INFORMAÇÕES LEGAIS</span><h1>{page.title}</h1></div><div className="prose"><div className="draft-banner"><strong>Rascunho inicial.</strong> Este texto precisa de revisão jurídica e adequação aos dados reais da empresa antes da publicação comercial.</div>{custom ? <p style={{whiteSpace:"pre-line"}}>{custom}</p> : page.sections.map(([heading,text]) => <section key={heading}><h2>{heading}</h2><p>{text}</p></section>)}</div></main>;
}
