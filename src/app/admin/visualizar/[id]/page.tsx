import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pré-visualização", robots: { index: false, follow: false } };
export default async function Preview({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(); const { id } = await params;
  const p = await db.product.findUnique({ where: { id } }); if (!p) notFound();
  return <main className="container page-shell"><div className="draft-banner">Pré-visualização administrativa · {p.status === "PUBLISHED" ? "Publicado" : p.status === "DRAFT" ? "Rascunho" : "Arquivado"}. <Link className="text-link" href={`/admin/produtos/${p.id}`}>Voltar à edição</Link></div><div className="product-detail"><div className="detail-image">{p.imageUrl ? <Image src={p.imageUrl} alt={`Capa de ${p.name}`} fill sizes="50vw" unoptimized/> : <div className="cover-placeholder"><span>{p.productType}</span><strong>{p.name}</strong><small>NEXORA DIGITAL</small></div>}</div><div className="detail-main"><span className="eyebrow">{p.productType}</span><h1>{p.name}</h1><p>{p.shortDescription}</p><div className="detail-price"><strong>{money(p.priceCents)}</strong></div><button className="btn btn-outline detail-buy" disabled>Pré-visualização sem compra</button><ul className="detail-points"><li>Produto digital</li><li>Entrega: {p.delivery || "Não informada"}</li></ul></div></div><div className="detail-content"><section><h2>Conteúdo</h2><p>{p.description || p.shortDescription}</p><div className="detail-block"><h3>Incluído</h3><p>{p.included || "Não informado"}</p></div><div className="detail-block"><h3>Para quem</h3><p>{p.audience || "Não informado"}</p></div></section><section><h2>Antes de comprar</h2><div className="detail-block"><h3>Formatos e requisitos</h3><p>{p.requirements || "Não informados"}</p></div><div className="detail-block"><h3>Acesso e reembolso</h3><p>{p.refundPolicy || "Não informado"}</p></div></section></div></main>;
}
