"use client";

import { useEffect } from "react";
import { trackCheckoutStart } from "@/lib/meta-pixel";

const keys = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"];
export function CampaignCapture() {
  useEffect(() => {
    const current = new URLSearchParams(window.location.search);
    const found = Object.fromEntries(keys.map(k => [k, current.get(k)]).filter(([,v]) => v && v.length <= 200));
    if (Object.keys(found).length) try { sessionStorage.setItem("nexora_campaign", JSON.stringify(found)); } catch {}
  }, []);
  return null;
}

export function CheckoutLink({ slug, children, className, plan = "basico" }: { slug: string; children: React.ReactNode; className: string; plan?: "basico" | "combo" }) {
  const href = `/comprar/${slug}?plano=${plan}`;
  return <a href={href} className={className} onClick={event => {
    try {
      const stored = JSON.parse(sessionStorage.getItem("nexora_campaign") || "{}");
      const current = new URLSearchParams(window.location.search);
      const target = new URL(href, window.location.origin);
      for (const key of keys) {
        const value = current.get(key) || stored[key];
        if (typeof value === "string" && value.length <= 200) target.searchParams.set(key, value);
      }
      event.preventDefault();
      // Give the browser a brief chance to dispatch the Pixel request before leaving the site.
      const tracked = trackCheckoutStart(slug, plan);
      if (tracked) window.setTimeout(() => window.location.assign(target.toString()), 180);
      else window.location.assign(target.toString());
    } catch { /* O link padrão continua funcionando. */ }
  }}>{children}</a>;
}
