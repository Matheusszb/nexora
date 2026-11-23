export const META_PIXEL_ID = "1420688250053150";
export const META_CONSENT_KEY = "nexora_meta_consent";

type Pixel = (action: string, event: string, data?: Record<string, unknown>) => void;

declare global {
  interface Window { fbq?: Pixel }
}

export function hasMetaConsent() {
  try { return localStorage.getItem(META_CONSENT_KEY) === "accepted"; } catch { return false; }
}

function productData(slug: string) {
  const element = document.querySelector<HTMLElement>("main[data-meta-product-id]");
  if (!element || element.dataset.metaProductId !== slug) return null;
  const priceCents = Number(element.dataset.metaPriceCents);
  if (!Number.isSafeInteger(priceCents) || priceCents < 0) return null;
  return {
    content_name: element.dataset.metaProductName || slug,
    content_ids: [slug],
    content_type: "product",
    value: priceCents / 100,
    currency: "BRL"
  };
}

export function trackProductView(slug: string) {
  if (!hasMetaConsent() || !window.fbq) return false;
  const data = productData(slug);
  if (!data) return false;
  window.fbq("track", "ViewContent", data);
  return true;
}

export function trackCheckoutStart(slug: string, plan: "basico" | "combo") {
  if (!hasMetaConsent() || !window.fbq) return false;
  const data = productData(slug);
  if (!data) return false;
  if (plan === "combo") {
    const cents = Number(document.querySelector<HTMLElement>("main[data-meta-product-id]")?.dataset.metaComboPriceCents);
    if (!Number.isSafeInteger(cents) || cents < 0) return false;
    data.value = cents / 100;
  }
  window.fbq("track", "InitiateCheckout", data);
  return true;
}
