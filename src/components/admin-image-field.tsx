"use client";

import { useState } from "react";
import "./admin-image-field.css";

type Props = {
  label: string;
  name: string;
  initialValue: string;
  gallery?: boolean;
  uploadReady: boolean;
};

export function AdminImageField({ label, name, initialValue, gallery = false, uploadReady }: Props) {
  const [value, setValue] = useState(initialValue);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setMessage("");
    let nextValue = value;
    try {
      if (gallery && nextValue.split(/\r?\n/).filter(Boolean).length + files.length > 8) throw new Error("A galeria aceita até 8 imagens.");
      for (const file of Array.from(files)) {
        if (file.size > 3 * 1024 * 1024) throw new Error("Cada imagem deve ter até 3 MB.");
        const body = new FormData();
        body.set("image", file);
        const response = await fetch("/admin/imagens", { method: "POST", body });
        const result = await response.json() as { url?: string; error?: string };
        if (!response.ok || !result.url) throw new Error(result.error || "Falha no envio da imagem.");
        nextValue = gallery ? [nextValue.trim(), result.url].filter(Boolean).join("\n") : result.url;
        setValue(nextValue);
      }
      setMessage(gallery ? "Imagens adicionadas. Salve o produto para concluir." : "Imagem enviada. Salve o produto para concluir.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha no envio da imagem.");
    } finally { setBusy(false); }
  }

  return <div className="admin-image-field span-2">
    <label htmlFor={`image-${name}`}>{label}</label>
    {gallery
      ? <textarea id={`image-${name}`} className="textarea" name={name} rows={4} value={value} onChange={event => setValue(event.target.value)} />
      : <input id={`image-${name}`} className="field" type="url" name={name} value={value} onChange={event => setValue(event.target.value)} />}
    <div className="admin-image-upload"><input type="file" accept="image/jpeg,image/png,image/webp" multiple={gallery} disabled={!uploadReady || busy} onChange={event => { void upload(event.target.files); event.target.value = ""; }} aria-label={`Enviar ${label.toLowerCase()}`} />
      <small>{uploadReady ? "JPG, PNG ou WebP · até 3 MB por imagem. URLs HTTPS anteriores continuam válidas." : "Para enviar arquivos, configure o Supabase Storage na Vercel. URLs HTTPS continuam disponíveis."}</small>
    </div>
    {message && <p className="admin-image-message" role="status">{message}</p>}
    {busy && <p className="admin-image-message" role="status">Enviando imagem...</p>}
    {!gallery && value && <div className="admin-image-preview"><img src={value} alt={`Prévia: ${label}`} /></div>}
  </div>;
}
