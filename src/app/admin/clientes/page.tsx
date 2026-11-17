import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin-shell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clientes", robots: { index: false, follow: false } };
export default async function Customers() {
  const admin = await requireAdmin();
  const customers = await db.customer.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return <AdminShell title="Clientes" subtitle="Dados necessários para a operação da loja." email={admin.email}><div className="operation-alert"><span>!</span><div><strong>Dados de clientes dependem do checkout</strong><p>O cadastro será preenchido somente por uma integração oficial com o provedor. Nenhum dado é coletado pela loja apenas ao clicar em comprar.</p></div></div><div className="admin-panel admin-table-wrap"><table className="admin-table"><thead><tr><th>Cliente</th><th>E-mail</th><th>Cadastro</th></tr></thead><tbody>{customers.map(c => <tr key={c.id}><td>{c.name || "—"}</td><td>{c.email}</td><td>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(c.createdAt)}</td></tr>)}</tbody></table>{!customers.length && <div className="admin-empty">Nenhum cliente registrado.</div>}</div></AdminShell>;
}
