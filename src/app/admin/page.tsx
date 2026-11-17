import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin-shell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Painel administrativo", robots: { index: false, follow: false } };

export default async function Dashboard() {
  const admin = await requireAdmin();
  const [total, active, drafts, orders, latest] = await Promise.all([
    db.product.count(), db.product.count({ where: { status: "PUBLISHED" } }), db.product.count({ where: { status: "DRAFT" } }), db.order.count(), db.product.findMany({ take: 5, orderBy: { updatedAt: "desc" } })
  ]);
  return <AdminShell title="Visão geral" subtitle="Acompanhe o catálogo e as operações da loja." email={admin.email}><div className="admin-stats"><div className="stat-card"><span>Produtos cadastrados</span><strong>{total}</strong><small>Todos os status</small></div><div className="stat-card"><span>Produtos publicados</span><strong>{active}</strong><small>Visíveis na loja</small></div><div className="stat-card"><span>Rascunhos</span><strong>{drafts}</strong><small>Aguardando publicação</small></div><div className="stat-card"><span>Pedidos registrados</span><strong>{orders}</strong><small>Histórico do painel</small></div></div><div className="admin-two-col"><section className="admin-panel"><div className="admin-panel-head"><div><h2>Produtos recentes</h2><p>Últimas alterações no catálogo</p></div><Link className="text-link" href="/admin/produtos">Ver todos ↗</Link></div>{latest.length ? <div className="admin-list">{latest.map(p => <Link href={`/admin/produtos/${p.id}`} key={p.id}><span className="admin-list-icon">▦</span><span><strong>{p.name}</strong><small>{p.productType}</small></span><b className={`status status-${p.status.toLowerCase()}`}>{p.status === "PUBLISHED" ? "Publicado" : p.status === "DRAFT" ? "Rascunho" : "Arquivado"}</b></Link>)}</div> : <div className="admin-empty">Nenhum produto cadastrado. <Link href="/admin/produtos/novo">Criar primeiro produto →</Link></div>}</section><section className="admin-panel"><div className="admin-panel-head"><div><h2>Operação de vendas</h2><p>Estado atual da integração</p></div></div><div className="operation-alert"><span>!</span><div><strong>Webhooks de pagamento não configurados</strong><p>O checkout por link pode ser cadastrado em cada produto. Pedidos, vendas confirmadas, faturamento e reembolsos só serão exibidos após uma integração oficial verificada.</p></div></div><div className="operation-row"><span>Pedidos registrados</span><strong>{orders}</strong></div><div className="operation-row"><span>Vendas e faturamento</span><strong>Indisponíveis</strong></div></section></div><div className="admin-quick"><Link href="/admin/produtos/novo">＋ Novo produto</Link><Link href="/admin/configuracoes">⚙ Configurações</Link></div></AdminShell>;
}
