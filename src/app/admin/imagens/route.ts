import { randomUUID } from "node:crypto";
import sharp from "sharp";
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

  let optimized: Buffer;
  try {
    optimized = await sharp(bytes, { limitInputPixels: 40_000_000 })
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();
  } catch {
    return Response.json({ error: "A imagem não pôde ser processada. Envie outro arquivo JPG, PNG ou WebP." }, { status: 400 });
  }

  const path = `products/${randomUUID()}.webp`;
  let uploaded: Response;
  try {
    uploaded = await fetch(`${base.origin}/storage/v1/object/${bucket}/${path}`, {
      method: "POST", headers: { apikey: secretKey, "Content-Type": "image/webp", "Cache-Control": "3600" }, body: new Uint8Array(optimized), cache: "no-store"
    });
  } catch {
    return Response.json({ error: "Não foi possível conectar ao Supabase Storage. Confira SUPABASE_URL e tente novamente." }, { status: 502 });
  }
  if (!uploaded.ok) {
    const details = await uploaded.json().catch(() => null) as { error?: unknown; message?: unknown } | null;
    const storageMessage = typeof details?.message === "string" ? details.message : typeof details?.error === "string" ? details.error : "";
    let error = `O Supabase Storage recusou a imagem (HTTP ${uploaded.status}). Confira as configurações do bucket ${bucket}.`;
    if (/bucket not found/i.test(storageMessage) || uploaded.status === 404) error = `O bucket ${bucket} não foi encontrado no projeto de SUPABASE_URL. Crie-o como público no Supabase Storage.`;
    else if (uploaded.status === 401 || uploaded.status === 403) error = "O Supabase recusou a chave de acesso. Confira SUPABASE_SECRET_KEY e se ela pertence ao projeto de SUPABASE_URL.";
    else if (uploaded.status === 413 || /exceed|too large|size limit/i.test(storageMessage)) error = "A imagem excede o limite de tamanho do bucket no Supabase Storage.";
    return Response.json({ error }, { status: 502 });
  }
  return Response.json({ url: `${base.origin}/storage/v1/object/public/${bucket}/${path}` });
}
