import { z } from "zod";
import { slugify } from "./format";
import { isAllowedCheckoutUrl } from "./checkout";

const safeUrl = z.string().trim().optional().or(z.literal(""))
  .transform(v => v || undefined)
  .refine(v => !v || (() => { try { return new URL(v).protocol === "https:"; } catch { return false; } })(), "Use uma URL HTTPS válida");

const checkoutUrl = safeUrl.refine(v => !v || isAllowedCheckoutUrl(v), "Use um checkout oficial da Cakto ou da Kiwify");

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(90),
  slug: z.string().trim().max(90).transform(slugify).refine(Boolean),
  description: z.string().trim().max(500).default(""),
  icon: z.string().trim().max(40).default("grid"),
  imageUrl: safeUrl,
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  active: z.boolean().default(false)
});

export const productSchema = z.object({
  name: z.string().trim().min(3).max(150),
  slug: z.string().trim().max(90).transform(slugify).refine(Boolean),
  categoryId: z.string().min(1),
  shortDescription: z.string().trim().min(10).max(320),
  description: z.string().trim().max(15000).default(""),
  included: z.string().trim().max(5000).default(""),
  audience: z.string().trim().max(5000).default(""),
  requirements: z.string().trim().max(5000).default(""),
  delivery: z.string().trim().max(5000).default(""),
  refundPolicy: z.string().trim().max(5000).default(""),
  productType: z.string().trim().min(2).max(70),
  imageUrl: safeUrl,
  socialImageUrl: safeUrl,
  priceCents: z.coerce.number().int().min(0).max(100000000),
  compareAtPriceCents: z.coerce.number().int().min(0).max(100000000).optional(),
  checkoutUrl,
  upgradeName: z.string().trim().max(100).optional(),
  upgradeDescription: z.string().trim().max(320).default(""),
  upgradeIncluded: z.string().trim().max(5000).default(""),
  upgradePriceCents: z.coerce.number().int().min(0).max(100000000).optional(),
  upgradeCheckoutUrl: checkoutUrl,
  seoTitle: z.string().trim().max(70).optional(),
  metaDescription: z.string().trim().max(160).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  featured: z.boolean().default(false)
}).superRefine((v, ctx) => {
  if (v.compareAtPriceCents && v.compareAtPriceCents <= v.priceCents) ctx.addIssue({ code: "custom", path: ["compareAtPriceCents"], message: "Preço anterior deve ser maior que o preço atual" });
  const upgradeStarted = Boolean(v.upgradeName || v.upgradeDescription || v.upgradeIncluded || v.upgradePriceCents != null || v.upgradeCheckoutUrl);
  if (!upgradeStarted) return;
  if (!v.upgradeName) ctx.addIssue({ code: "custom", path: ["upgradeName"], message: "Informe o nome do combo" });
  if (v.upgradePriceCents == null || v.upgradePriceCents <= v.priceCents) ctx.addIssue({ code: "custom", path: ["upgradePriceCents"], message: "O preço do combo deve superar o básico" });
  if (!v.upgradeCheckoutUrl) ctx.addIssue({ code: "custom", path: ["upgradeCheckoutUrl"], message: "Informe o checkout do combo" });
  if (!v.upgradeIncluded.trim()) ctx.addIssue({ code: "custom", path: ["upgradeIncluded"], message: "Descreva o que o combo acrescenta" });
});

export function formString(form: FormData, key: string) { return String(form.get(key) ?? ""); }
export function formBool(form: FormData, key: string) { return form.get(key) === "on"; }
export function formPrice(form: FormData, key: string) {
  const raw = formString(form, key).trim();
  if (!raw) return undefined;
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  const value = Number(normalized);
  return Number.isFinite(value) ? Math.round(value * 100) : NaN;
}
