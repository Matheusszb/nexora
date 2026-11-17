import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin-shell";
import { money } from "@/lib/format";
import { archiveProduct, deleteProduct, duplicateProduct } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Produtos", robots: { index: false, follow: false } };

export default async function ProductsAdmin({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; erro?: string; salvo?: string }> }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const q = (params.q || "").trim().slice(0, 100);
  const status = ["PUBLISHED", "DRAFT", "ARCHIVED"].includes(params.status || "") ? params.status as "PUBLISHED" | "DRAFT" | "ARCHIVED" : undefined;
  const products = await db.product.findMany({
    where: { ...(status && { status }), ...(q && { name: { contains: q, mode: "insensitive" } }) },
    orderBy: { updatedAt: "desc" }
  });
  return <AdminShell title="Produtos" subtitle="Cadastre, edite e publique materiais digitais." email={admin.email}>
    <div className="admin-actions"><form className="admin-search"><input className="field" name="q" placeholder="Buscar produto" defaultValue={q}/><select className="select" name="status" defaultValue={status || ""}><option value="">Todos os status</option><option value="PUBLISHED">Publicados</option><option value="DRAFT">Rascunhos</option><option value="ARCHIVED">Arquivados</option></select><button className="btn btn-outline">Filtrar</button></form><Link className="btn btn-primary" href="/admin/produtos/novo">＋ Novo produto</Link></div>
    {params.salvo && <div className="form-success">Alteração salva com sucesso.</div>}
    {params.erro && <div className="form-error">{params.erro === "historico" ? "Este produto tem histórico de pedidos e não pode ser excluído." : params.erro === "arquive" ? "Arquive o produto publicado antes de excluí-lo." : "Não foi possível concluir a operação."}</div>}
    <div className="admin-panel admin-table-wrap"><table className="admin-table"><thead><tr><th>Produto</th><th>Preço</th><th>Status</th><th>Ações</th></tr></thead><tbody>{products.map(product => <tr key={product.id}><td><strong>{product.name}</strong><small>/{product.slug}</small></td><td>{money(product.priceCents)}</td><td><span className={`status status-${product.status.toLowerCase()}`}>{product.status === "PUBLISHED" ? "Publicado" : product.status === "DRAFT" ? "Rascunho" : "Arquivado"}</span></td><td><div className="row-actions"><Link href={`/admin/produtos/${product.id}`}>Editar</Link><form action={duplicateProduct}><input type="hidden" name="id" value={product.id}/><button>Duplicar</button></form><form action={archiveProduct}><input type="hidden" name="id" value={product.id}/><button>Arquivar</button></form><details className="delete-confirm"><summary>Excluir</summary><form action={deleteProduct}><input type="hidden" name="id" value={product.id}/><button>Confirmar exclusão</button></form></details></div></td></tr>)}</tbody></table>{!products.length && <div className="admin-empty">Nenhum produto encontrado.</div>}</div>
  </AdminShell>;
}
