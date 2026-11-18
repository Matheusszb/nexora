import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { curatedProducts } from "@/lib/curated-products";
import { AdminShell } from "@/components/admin-shell";
import { money } from "@/lib/format";
import { saveCuratedCheckout } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkouts", robots: { index: false, follow: false } };

export default async function CheckoutsPage({ searchParams }: { searchParams: Promise<{ erro?: string; salvo?: string }> }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const settings = await db.siteSetting.findMany({ where: { key: { in: curatedProducts.map(product => `checkout:${product.slug}`) } } });
  const values = new Map(settings.map(setting => [setting.key, setting.value]));
  return <AdminShell title="Links de checkout" subtitle="As páginas dos materiais são criadas para você. Aqui, basta adicionar o link oficial da Cakto." email={admin.email}>
    {params.salvo && <div className="form-success">Link salvo com sucesso.</div>}
    {params.erro && <div className="form-error">{params.erro === "url" ? "Use uma URL HTTPS de pay.cakto.com.br." : "Página não encontrada."}</div>}
    {curatedProducts.map(product => <section className="admin-panel" key={product.slug}>
      <div className="admin-panel-head"><div><h2>{product.name}</h2><p>{product.priceCents == null ? "Preço a confirmar" : money(product.priceCents)} · Página própria</p></div><Link className="btn btn-outline" href={`/concursos/${product.slug}`} target="_blank">Ver página ↗</Link></div>
      <form action={saveCuratedCheckout} className="form-grid">
        <input type="hidden" name="slug" value={product.slug}/>
        <label className="span-2">Link de checkout da Cakto<input className="field" type="url" name="checkoutUrl" defaultValue={values.get(`checkout:${product.slug}`) || ""} placeholder="https://pay.cakto.com.br/..."/><small>Sem link, a compra fica indisponível. Para remover o checkout, deixe o campo vazio e salve.</small></label>
        <button className="btn btn-primary" type="submit">Salvar link</button>
      </form>
    </section>)}
  </AdminShell>;
}
