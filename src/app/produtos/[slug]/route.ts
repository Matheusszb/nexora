import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const target = new URL(`/concursos/${encodeURIComponent(slug)}`, request.url);
  target.search = request.nextUrl.search;
  return NextResponse.redirect(target, 308);
}
