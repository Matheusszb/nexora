export function isAllowedCheckoutUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return false;
    const host = url.hostname.toLowerCase();
    return host === "pay.cakto.com.br" || host === "kiwify.com.br" || host.endsWith(".kiwify.com.br");
  } catch {
    return false;
  }
}

export function isCaktoCheckoutUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.toLowerCase() === "pay.cakto.com.br" && !url.username && !url.password;
  } catch {
    return false;
  }
}
