const storageOrigin = (() => {
  try {
    const url = new URL(process.env.SUPABASE_URL || "");
    return url.protocol === "https:" && url.hostname.endsWith(".supabase.co") ? url.origin : null;
  }
  catch { return null; }
})();

export function isOptimizableProductImage(src: string) {
  if (!storageOrigin) return false;
  try {
    const url = new URL(src);
    return url.origin === storageOrigin && url.pathname.startsWith("/storage/v1/object/public/product-images/");
  } catch { return false; }
}
