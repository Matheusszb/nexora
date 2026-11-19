import { CheckoutLink } from "@/components/campaign-capture";
import { money } from "@/lib/format";
import "./mobile-checkout-bar.css";

export function MobileCheckoutBar({ slug, priceCents, available }: { slug: string; priceCents: number; available: boolean }) {
  if (!available) return null;
  return <div className="mobile-checkout-bar"><div><small>Apostila digital</small><strong>{money(priceCents)}</strong></div><CheckoutLink slug={slug} className="mobile-checkout-button">Comprar agora ↗</CheckoutLink></div>;
}
