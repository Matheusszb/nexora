import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin-shell";
import { money } from "@/lib/format";
import { archiveProduct, deleteProduct, duplicateProduct } from "../actions";
import { curatedProducts, isLegacyCuratedProduct } from "@/lib/curated-products";

export const dynamic = "force-dynamic";
export const metadata = { title: "Produtos", robots: { index: false, follow: false } };

export default async function ProductsAdmin({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; erro?: string; salvo?: string }> }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const q = (params.q || "").trim().slice(0, 100);
  const status = ["PUBLISHED", "DRAFT", "ARCHIVED"].includes(params.status || "") ? params.status as "PUBLISHED" | "DRAFT" | "ARCHIVED" : undefined;
  const products = (await db.product.findMany({
    where: { ...(status && { status }), ...(q && { name: { contains: q, mode: "insensitive" } }) },
    orderBy: { updatedAt: "desc" }
  })).filter(product => !isLegacyCuratedProduct(product));
  return <AdminShell title="Materiais" subtitle="As páginas próprias são criadas para você. No painel, adicione apenas o link da Cakto." email={admin.email}>
    <section className="admin-panel"><div className="admin-panel-head"><div><h2>Páginas prontas</h2><p>Conteúdo e apresentação preparados fora do cadastro.</p></div><Link className="btn btn-primary" href="/admin/checkouts">Configurar checkout ↗</Link></div>{curatedProducts.map(product => <p key={product.slug}><strong>{product.name}</strong> · {product.priceCents == null ? "Preço a confirmar" : money(product.priceCents)} · <Link className="text-link" href={`/concursos/${product.slug}`} target="_blank">Ver página ↗</Link></p>)}</section>
    <div className="admin-actions"><form className="admin-search"><input className="field" name="q" placeholder="Buscar outros produtos" defaultValue={q}/><select className="select" name="status" defaultValue={status || ""}><option value="">Todos os status</option><option value="PUBLISHED">Publicados</option><option value="DRAFT">Rascunhos</option><option value="ARCHIVED">Arquivados</option></select><button className="btn btn-outline">Filtrar</button></form></div>
    {params.salvo && <div className="form-success">Alteração salva com sucesso.</div>}
    {params.erro && <div className="form-error">{params.erro === "historico" ? "Este produto tem histórico de pedidos e não pode ser excluído." : params.erro === "arquive" ? "Arquive o produto publicado antes de excluí-lo." : "Não foi possível concluir a operação."}</div>}
    {products.length > 0 && <div className="admin-panel admin-table-wrap"><table className="admin-table"><thead><tr><th>Outros produtos</th><th>Preço</th><th>Status</th><th>Ações</th></tr></thead><tbody>{products.map(product => <tr key={product.id}><td><strong>{product.name}</strong><small>/{product.slug}</small></td><td>{money(product.priceCents)}</td><td><span className={`status status-${product.status.toLowerCase()}`}>{product.status === "PUBLISHED" ? "Publicado" : product.status === "DRAFT" ? "Rascunho" : "Arquivado"}</span></td><td><div className="row-actions"><Link href={`/admin/produtos/${product.id}`}>Editar</Link><form action={duplicateProduct}><input type="hidden" name="id" value={product.id}/><button>Duplicar</button></form><form action={archiveProduct}><input type="hidden" name="id" value={product.id}/><button>Arquivar</button></form><details className="delete-confirm"><summary>Excluir</summary><form action={deleteProduct}><input type="hidden" name="id" value={product.id}/><button>Confirmar exclusão</button></form></details></div></td></tr>)}</tbody></table></div>}
  </AdminShell>;
}
