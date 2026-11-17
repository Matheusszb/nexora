import { randomUUID } from "node:crypto";
import { getAdmin } from "@/lib/auth";

export const runtime = "nodejs";
const bucket = "product-images";
const maxBytes = 3 * 1024 * 1024;

function imageExtension(bytes: Buffer, type: string) {
  if (type === "image/png" && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "png";
  if (type === "image/jpeg" && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "jpg";
  if (type === "image/webp" && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: "Origem inválida." }, { status: 403 });
  if (!(await getAdmin())) return Response.json({ error: "Sessão expirada. Entre no painel novamente." }, { status: 401 });
  if (Number(request.headers.get("content-length") || 0) > maxBytes + 100_000) return Response.json({ error: "Imagem maior que 3 MB." }, { status: 413 });

  const baseUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!baseUrl || !secretKey) return Response.json({ error: "Configure SUPABASE_URL e SUPABASE_SECRET_KEY na Vercel para ativar o upload." }, { status: 503 });
  let base: URL;
  try {
    base = new URL(baseUrl);
    if (base.protocol !== "https:" || !base.hostname.endsWith(".supabase.co") || base.pathname !== "/") throw new Error("URL inválida");
  } catch { return Response.json({ error: "SUPABASE_URL inválida." }, { status: 503 }); }

  const form = await request.formData();
  const file = form.get("image");
  if (!(file instanceof File) || file.size === 0 || file.size > maxBytes) return Response.json({ error: "Selecione uma imagem JPG, PNG ou WebP de até 3 MB." }, { status: 400 });
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = imageExtension(bytes, file.type);
  if (!ext) return Response.json({ error: "Formato inválido. Use JPG, PNG ou WebP." }, { status: 400 });

  const path = `products/${randomUUID()}.${ext}`;
  const uploaded = await fetch(`${base.origin}/storage/v1/object/${bucket}/${path}`, {
    method: "POST", headers: { apikey: secretKey, "Content-Type": file.type, "Cache-Control": "3600" }, body: bytes, cache: "no-store"
  });
  if (!uploaded.ok) return Response.json({ error: "Não foi possível enviar a imagem. Confira o bucket público product-images e as credenciais do Supabase." }, { status: 502 });
  return Response.json({ url: `${base.origin}/storage/v1/object/public/${bucket}/${path}` });
}
