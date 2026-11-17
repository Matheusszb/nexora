import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin-shell";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pedidos", robots: { index: false, follow: false } };
export default async function Orders() {
  const admin = await requireAdmin();
  const orders = await db.order.findMany({ include: { product: true }, orderBy: { createdAt: "desc" }, take: 100 });
  return <AdminShell title="Pedidos" subtitle="Registros validados pelo provedor de pagamento." email={admin.email}><div className="operation-alert"><span>!</span><div><strong>Integração financeira pendente</strong><p>Não há webhooks configurados. Links de checkout não criam pedidos nesta loja. Os dados serão exibidos quando a integração oficial estiver ativa.</p></div></div><div className="admin-panel admin-table-wrap"><table className="admin-table"><thead><tr><th>Data</th><th>Produto</th><th>Valor</th><th>Status</th><th>ID do provedor</th></tr></thead><tbody>{orders.map(o => <tr key={o.id}><td>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(o.createdAt)}</td><td>{o.product.name}</td><td>{money(o.amountCents)}</td><td>{o.status}</td><td>{o.providerOrderId || "—"}</td></tr>)}</tbody></table>{!orders.length && <div className="admin-empty">Nenhum pedido registrado.</div>}</div></AdminShell>;
}
