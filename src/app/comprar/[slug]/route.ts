import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAllowedCheckoutUrl } from "@/lib/checkout";
import { getCuratedCheckout } from "@/lib/curated-checkout";
import { curatedProducts } from "@/lib/curated-products";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let selectedUrl: string | null | undefined;
  const curated = curatedProducts.find(product => product.slug === slug);
  if (curated) {
    selectedUrl = curated.priceCents == null || request.nextUrl.searchParams.get("plano") === "combo" ? null : await getCuratedCheckout(slug);
  } else {
    const product = await db.product.findUnique({ where: { slug }, select: { status: true, checkoutUrl: true, priceCents: true, upgradeName: true, upgradeIncluded: true, upgradePriceCents: true, upgradeCheckoutUrl: true } });
    const comboReady = Boolean(product?.upgradeName && product.upgradeIncluded.trim() && product.upgradePriceCents != null && product.upgradePriceCents > product.priceCents && product.upgradeCheckoutUrl);
    selectedUrl = product?.status === "PUBLISHED" ? request.nextUrl.searchParams.get("plano") === "combo" ? comboReady ? product?.upgradeCheckoutUrl : null : product?.checkoutUrl : null;
  }
  if (!selectedUrl || !isAllowedCheckoutUrl(selectedUrl)) return NextResponse.redirect(new URL(`/concursos/${slug}`, request.url));
  let target: URL;
  try { target = new URL(selectedUrl); } catch { return NextResponse.redirect(new URL(`/concursos/${slug}`, request.url)); }
  for (const key of ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"]) {
    const value = request.nextUrl.searchParams.get(key);
    if (value && value.length <= 200 && !target.searchParams.has(key)) target.searchParams.set(key, value);
  }
  return NextResponse.redirect(target, { status: 302, headers: { "Cache-Control": "no-store" } });
}
