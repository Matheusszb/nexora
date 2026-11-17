import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAllowedCheckoutUrl } from "@/lib/checkout";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug }, select: { status: true, checkoutUrl: true, priceCents: true, upgradeName: true, upgradeIncluded: true, upgradePriceCents: true, upgradeCheckoutUrl: true, category: { select: { active: true } } } });
  const comboReady = Boolean(product?.upgradeName && product.upgradeIncluded.trim() && product.upgradePriceCents != null && product.upgradePriceCents > product.priceCents && product.upgradeCheckoutUrl);
  const selectedUrl = request.nextUrl.searchParams.get("plano") === "combo" ? comboReady ? product?.upgradeCheckoutUrl : null : product?.checkoutUrl;
  if (!product || product.status !== "PUBLISHED" || !product.category.active || !selectedUrl || !isAllowedCheckoutUrl(selectedUrl)) return NextResponse.redirect(new URL(`/produtos/${slug}`, request.url));
  let target: URL;
  try { target = new URL(selectedUrl); } catch { return NextResponse.redirect(new URL(`/produtos/${slug}`, request.url)); }
  for (const key of ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"]) {
    const value = request.nextUrl.searchParams.get(key);
    if (value && value.length <= 200 && !target.searchParams.has(key)) target.searchParams.set(key, value);
  }
  return NextResponse.redirect(target, { status: 302, headers: { "Cache-Control": "no-store" } });
}
