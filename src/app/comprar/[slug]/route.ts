import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug }, select: { status: true, checkoutUrl: true, category: { select: { active: true } } } });
  if (!product || product.status !== "PUBLISHED" || !product.category.active || !product.checkoutUrl) return NextResponse.redirect(new URL(`/produtos/${slug}`, request.url));
  let target: URL;
  try { target = new URL(product.checkoutUrl); } catch { return NextResponse.redirect(new URL(`/produtos/${slug}`, request.url)); }
  const host = target.hostname.toLowerCase();
  if (target.protocol !== "https:" || !(host === "kiwify.com.br" || host.endsWith(".kiwify.com.br"))) return NextResponse.redirect(new URL(`/produtos/${slug}`, request.url));
  for (const key of ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"]) {
    const value = request.nextUrl.searchParams.get(key);
    if (value && value.length <= 200 && !target.searchParams.has(key)) target.searchParams.set(key, value);
  }
  return NextResponse.redirect(target, { status: 302, headers: { "Cache-Control": "no-store" } });
}
