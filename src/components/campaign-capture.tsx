"use client";

import { useEffect } from "react";

const keys = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"];
export function CampaignCapture() {
  useEffect(() => {
    const current = new URLSearchParams(window.location.search);
    const found = Object.fromEntries(keys.map(k => [k, current.get(k)]).filter(([,v]) => v && v.length <= 200));
    if (Object.keys(found).length) try { sessionStorage.setItem("nexora_campaign", JSON.stringify(found)); } catch {}
  }, []);
  return null;
}

export function CheckoutLink({ slug, children, className }: { slug: string; children: React.ReactNode; className: string }) {
  const href = `/comprar/${slug}`;
  return <a href={href} className={className} onClick={event => {
    try {
      const stored = JSON.parse(sessionStorage.getItem("nexora_campaign") || "{}");
      const current = new URLSearchParams(window.location.search);
      const target = new URL(href, window.location.origin);
      for (const key of keys) {
        const value = current.get(key) || stored[key];
        if (typeof value === "string" && value.length <= 200) target.searchParams.set(key, value);
      }
      event.preventDefault(); window.location.assign(target.toString());
    } catch { /* O link padrão continua funcionando. */ }
  }}>{children}</a>;
}
