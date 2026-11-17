"use server";

import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clearSession, createSession, requireAdmin } from "@/lib/auth";
import { formBool, formPrice, formString, productSchema } from "@/lib/validation";

const attemptHash = (value: string) => createHash("sha256").update(value).digest("hex");

export async function login(form: FormData) {
  const email = formString(form, "email").trim().toLowerCase().slice(0, 254);
  const password = formString(form, "password");
  const key = attemptHash(email);
  const since = new Date(Date.now() - 15 * 60_000);
  const attempts = await db.loginAttempt.count({ where: { key, createdAt: { gt: since } } });
  if (attempts >= 5) redirect("/admin/entrar?erro=limite");
  const admin = await db.admin.findUnique({ where: { email } });
  const dummy = "$2a$12$Q8dOe4XCh3v0adSJ2XyH4.1ZgUNFki7DXuRK48H6avzNOfKwNUc.a";
  const valid = await bcrypt.compare(password, admin?.passwordHash || dummy);
  if (!admin || !admin.active || !valid) {
    await db.loginAttempt.create({ data: { key } });
    redirect("/admin/entrar?erro=credenciais");
  }
  await db.loginAttempt.deleteMany({ where: { key } });
  await createSession(admin.id);
  redirect("/admin");
}

export async function logout() { await clearSession(); redirect("/admin/entrar"); }

function productFromForm(form: FormData) {
  return productSchema.safeParse({
    name: formString(form,"name"), slug: formString(form,"slug"),
    shortDescription: formString(form,"shortDescription"), description: formString(form,"description"), included: formString(form,"included"), audience: formString(form,"audience"), requirements: formString(form,"requirements"), delivery: formString(form,"delivery"), refundPolicy: formString(form,"refundPolicy"), productType: formString(form,"productType"), imageUrl: formString(form,"imageUrl"), socialImageUrl: formString(form,"socialImageUrl"), priceCents: formPrice(form,"price"), compareAtPriceCents: formPrice(form,"compareAtPrice"), checkoutUrl: formString(form,"checkoutUrl"), upgradeName: formString(form,"upgradeName"), upgradeDescription: formString(form,"upgradeDescription"), upgradeIncluded: formString(form,"upgradeIncluded"), upgradePriceCents: formPrice(form,"upgradePrice"), upgradeCheckoutUrl: formString(form,"upgradeCheckoutUrl"), seoTitle: formString(form,"seoTitle"), metaDescription: formString(form,"metaDescription"), status: formString(form,"status"), featured: formBool(form,"featured")
  });
}

export async function saveProduct(form: FormData) {
  const admin = await requireAdmin();
  const id = formString(form,"id");
  const parsed = productFromForm(form);
  if (!parsed.success) redirect(`/admin/produtos/${id || "novo"}?erro=validacao`);
  const gallery = formString(form, "galleryUrls").split(/\r?\n/).map(v => v.trim()).filter(Boolean);
  if (gallery.length > 8 || gallery.some(value => { try { return new URL(value).protocol !== "https:"; } catch { return true; } })) redirect(`/admin/produtos/${id || "novo"}?erro=validacao`);
  try {
    const old = id ? await db.product.findUnique({ where: { id } }) : null;
    const data = { ...parsed.data, imageUrl: parsed.data.imageUrl || null, socialImageUrl: parsed.data.socialImageUrl || null, checkoutUrl: parsed.data.checkoutUrl || null, compareAtPriceCents: parsed.data.compareAtPriceCents ?? null, upgradeName: parsed.data.upgradeName || null, upgradePriceCents: parsed.data.upgradePriceCents ?? null, upgradeCheckoutUrl: parsed.data.upgradeCheckoutUrl || null, publishedAt: parsed.data.status === "PUBLISHED" ? old?.publishedAt || new Date() : null };
    await db.$transaction(async tx => {
      const product = id
        ? await tx.product.update({ where: { id }, data })
        : await tx.product.create({ data: {
            ...data,
            categoryId: (await tx.category.upsert({
              where: { slug: "catalogo-interno" },
              create: { name: "Catálogo", slug: "catalogo-interno", active: true },
              update: { active: true }
            })).id
          } });
      await tx.productImage.deleteMany({ where: { productId: product.id } });
      if (gallery.length) await tx.productImage.createMany({ data: gallery.map((url, sortOrder) => ({ productId: product.id, url, alt: `Imagem ${sortOrder + 1} de ${product.name}`, sortOrder })) });
      if (old && old.slug !== product.slug) await tx.slugRedirect.upsert({ where: { entity_oldSlug: { entity: "product", oldSlug: old.slug } }, create: { entity: "product", oldSlug: old.slug, targetId: product.id }, update: { targetId: product.id } });
      await tx.adminLog.create({ data: { adminId: admin.id, action: id ? "update" : "create", entity: "product", entityId: product.id } });
    });
  } catch (error) { redirect(`/admin/produtos/${id || "novo"}?erro=${(error as { code?: string }).code === "P2002" ? "duplicado" : "salvar"}`); }
  revalidatePath("/"); revalidatePath("/produtos");
  redirect("/admin/produtos?salvo=1");
}

export async function archiveProduct(form: FormData) {
  const admin = await requireAdmin();
  const id = formString(form,"id");
  await db.product.update({ where: { id }, data: { status: "ARCHIVED", publishedAt: null } });
  await db.adminLog.create({ data: { adminId: admin.id, action: "archive", entity: "product", entityId: id } });
  revalidatePath("/"); revalidatePath("/produtos");
  redirect("/admin/produtos?salvo=1");
}

export async function deleteProduct(form: FormData) {
  const admin = await requireAdmin();
  const id = formString(form,"id");
  const product = await db.product.findUnique({ where: { id }, select: { status: true } });
  if (!product || product.status === "PUBLISHED") redirect("/admin/produtos?erro=arquive");
  if (await db.order.count({ where: { productId: id } })) redirect("/admin/produtos?erro=historico");
  await db.product.delete({ where: { id } });
  await db.adminLog.create({ data: { adminId: admin.id, action: "delete", entity: "product", entityId: id } });
  revalidatePath("/"); revalidatePath("/produtos");
  redirect("/admin/produtos?salvo=1");
}

export async function duplicateProduct(form: FormData) {
  const admin = await requireAdmin();
  const id = formString(form,"id");
  const source = await db.product.findUniqueOrThrow({ where: { id }, include: { images: true } });
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, publishedAt: _publishedAt, images, ...copy } = source;
  const product = await db.product.create({ data: { ...copy, name: `${source.name} (cópia)`, slug: `${source.slug.slice(0,75)}-copia-${Date.now().toString(36)}`, status: "DRAFT", featured: false, publishedAt: null, images: { create: images.map(image => ({ url: image.url, alt: image.alt, sortOrder: image.sortOrder })) } } });
  await db.adminLog.create({ data: { adminId: admin.id, action: "duplicate", entity: "product", entityId: product.id } });
  redirect(`/admin/produtos/${product.id}?salvo=1`);
}

export async function saveSetting(form: FormData) {
  const admin = await requireAdmin();
  const key = formString(form,"key");
  if (!["contactEmail","heroTitle","heroSubtitle","aboutText","metaPixelId","ga4Id","legalPrivacy","legalTerms","legalRefund","legalCookies"].includes(key)) redirect("/admin/configuracoes?erro=validacao");
  const value = formString(form,"value").trim().slice(0, 10000);
  if (key === "contactEmail" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) redirect("/admin/configuracoes?erro=validacao");
  await db.siteSetting.upsert({ where: { key }, create: { key, value }, update: { value } });
  await db.adminLog.create({ data: { adminId: admin.id, action: "update", entity: "setting", entityId: key } });
  revalidatePath("/"); revalidatePath("/contato");
  redirect("/admin/configuracoes?salvo=1");
}

export async function saveFaq(form: FormData) {
  const admin = await requireAdmin();
  const id = formString(form,"id");
  const question = formString(form,"question").trim().slice(0,250);
  const answer = formString(form,"answer").trim().slice(0,3000);
  const sortOrder = Math.max(0, Number(formString(form,"sortOrder")) || 0);
  if (question.length < 5 || answer.length < 10) redirect("/admin/conteudo?erro=validacao");
  const data = { question, answer, sortOrder, active: formBool(form,"active") };
  const faq = id ? await db.faq.update({ where: { id }, data }) : await db.faq.create({ data });
  await db.adminLog.create({ data: { adminId: admin.id, action: id ? "update" : "create", entity: "faq", entityId: faq.id } });
  revalidatePath("/");
  redirect("/admin/conteudo?salvo=1");
}

export async function deleteFaq(form: FormData) {
  const admin = await requireAdmin(); const id = formString(form,"id");
  await db.faq.delete({ where: { id } });
  await db.adminLog.create({ data: { adminId: admin.id, action: "delete", entity: "faq", entityId: id } });
  revalidatePath("/"); redirect("/admin/conteudo?salvo=1");
}

export async function saveTestimonial(form: FormData) {
  const admin = await requireAdmin();
  const id = formString(form,"id"); const name = formString(form,"name").trim().slice(0,120); const quote = formString(form,"quote").trim().slice(0,1000);
  if (name.length < 2 || quote.length < 15 || !formBool(form,"authorized")) redirect("/admin/conteudo?erro=autorizacao");
  const data = { name, quote, authorized: true, active: formBool(form,"active"), sortOrder: Math.max(0, Number(formString(form,"sortOrder")) || 0) };
  const testimonial = id ? await db.testimonial.update({ where: { id }, data }) : await db.testimonial.create({ data });
  await db.adminLog.create({ data: { adminId: admin.id, action: id ? "update" : "create", entity: "testimonial", entityId: testimonial.id } });
  revalidatePath("/"); redirect("/admin/conteudo?salvo=1");
}

export async function deleteTestimonial(form: FormData) {
  const admin = await requireAdmin(); const id = formString(form,"id");
  await db.testimonial.delete({ where: { id } });
  await db.adminLog.create({ data: { adminId: admin.id, action: "delete", entity: "testimonial", entityId: id } });
  revalidatePath("/"); redirect("/admin/conteudo?salvo=1");
}
