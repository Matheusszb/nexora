"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { isCaktoCheckoutUrl } from "@/lib/checkout";
import { curatedProducts } from "@/lib/curated-products";

export async function saveCuratedCheckout(form: FormData) {
  const admin = await requireAdmin();
  const slug = String(form.get("slug") || "");
  const url = String(form.get("checkoutUrl") || "").trim();
  if (!curatedProducts.some(product => product.slug === slug)) redirect("/admin/checkouts?erro=pagina");
  if (url && !isCaktoCheckoutUrl(url)) redirect("/admin/checkouts?erro=url");
  await db.$transaction([
    db.siteSetting.upsert({ where: { key: `checkout:${slug}` }, create: { key: `checkout:${slug}`, value: url }, update: { value: url } }),
    db.adminLog.create({ data: { adminId: admin.id, action: "update", entity: "checkout", entityId: slug } })
  ]);
  updateTag("curated-checkout");
  revalidatePath(`/concursos/${slug}`);
  redirect("/admin/checkouts?salvo=1");
}
