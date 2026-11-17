import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { money } from "@/lib/format";
import { AdminShell } from "@/components/admin-shell";
import { archiveProduct, deleteProduct, duplicateProduct } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gerenciar produtos", robots: { index: false, follow: false } };
export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ salvo?: string; erro?: string; q?: string; status?: string }> }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const q = (params.q || "").slice(0,100);
  const status = ["DRAFT","PUBLISHED","ARCHIVED"].includes(params.status || "") ? params.status as "DRAFT"|"PUBLISHED"|"ARCHIVED" : undefined;
  const products = await db.product.findMany({ where: { ...(status && { status }), ...(q && { name: { contains: q, mode: "insensitive" } }) }, include: { category: true }, orderBy: { updatedAt: "desc" }, take: 100 });
  return <AdminShell title="Produtos" subtitle="Cadastre, edite e publique materiais digitais." email={admin.email}><div className="admin-actions"><form className="admin-search"><input className="field" name="q" placeholder="Buscar produto" defaultValue={q}/><select className="select" name="status" defaultValue={status || ""}><option value="">Todos os status</option><option value="PUBLISHED">Publicados</option><option value="DRAFT">Rascunhos</option><option value="ARCHIVED">Arquivados</option></select><button className="btn btn-outline">Filtrar</button></form><Link className="btn btn-primary" href="/admin/produtos/novo">＋ Novo produto</Link></div>{params.salvo && <div className="form-success">Alteração salva com sucesso.</div>}{params.erro && <div className="form-error">{params.erro === "historico" ? "Este produto tem histórico de pedidos e não pode ser excluído." : params.erro === "arquive" ? "Arquive o produto publicado antes de excluí-lo." : "Não foi possível concluir a operação."}</div>}<div className="admin-panel admin-table-wrap"><table className="admin-table"><thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Status</th><th>Ações</th></tr></thead><tbody>{products.map(p => <tr key={p.id}><td><strong>{p.name}</strong><small>/{p.slug}</small></td><td>{p.category.name}</td><td>{money(p.priceCents)}</td><td><span className={`status status-${p.status.toLowerCase()}`}>{p.status === "PUBLISHED" ? "Publicado" : p.status === "DRAFT" ? "Rascunho" : "Arquivado"}</span></td><td><div className="row-actions"><Link href={`/admin/produtos/${p.id}`}>Editar</Link><form action={duplicateProduct}><input type="hidden" name="id" value={p.id}/><button>Duplicar</button></form><form action={archiveProduct}><input type="hidden" name="id" value={p.id}/><button>Arquivar</button></form><details className="delete-confirm"><summary>Excluir</summary><form action={deleteProduct}><input type="hidden" name="id" value={p.id}/><button>Confirmar exclusão</button></form></details></div></td></tr>)}</tbody></table>{!products.length && <div className="admin-empty">Nenhum produto encontrado.</div>}</div></AdminShell>;
}
