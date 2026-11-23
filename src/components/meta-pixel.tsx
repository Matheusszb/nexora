"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { hasMetaConsent, META_CONSENT_KEY, META_PIXEL_ID } from "@/lib/meta-pixel";
import "./meta-pixel.css";

const bootstrap = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');`;

export function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [choice, setChoice] = useState<"accepted" | "rejected" | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [showChoice, setShowChoice] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(META_CONSENT_KEY);
      if (stored === "accepted" || stored === "rejected") setChoice(stored);
      else setShowChoice(true);
    } catch { setShowChoice(true); }
    setHydrated(true);
    const reopen = () => setShowChoice(true);
    window.addEventListener("nexora:cookie-preferences", reopen);
    return () => window.removeEventListener("nexora:cookie-preferences", reopen);
  }, []);

  useEffect(() => {
    if (!loaded || choice !== "accepted" || !hasMetaConsent() || !window.fbq || pathname.startsWith("/admin")) return;
    // Query changes count as a new page view; a re-render of the same URL does not.
    const url = pathname + (searchParams.size ? `?${searchParams.toString()}` : "");
    if (lastTracked.current === url) return;
    lastTracked.current = url;
    window.fbq("track", "PageView");
    window.dispatchEvent(new Event("nexora:meta-ready"));
  }, [pathname, searchParams, choice, loaded]);

  function choose(value: "accepted" | "rejected") {
    try { localStorage.setItem(META_CONSENT_KEY, value); } catch { /* No persistent storage available. */ }
    if (window.fbq) window.fbq("consent", value === "accepted" ? "grant" : "revoke");
    lastTracked.current = null;
    setChoice(value);
    setShowChoice(false);
  }

  return <>
    {choice === "accepted" && <Script id="nexora-meta-pixel" strategy="afterInteractive" onReady={() => setLoaded(true)}>{bootstrap}</Script>}
    {hydrated && showChoice && <section className="meta-consent" role="dialog" aria-label="Preferências de cookies" aria-modal="false">
      <p>Usamos o Pixel da Meta para medir visitas e interesse em apostilas. Ele só é ativado com sua autorização. <a href="/legal/cookies">Saiba mais</a>.</p>
      <div><button type="button" onClick={() => choose("rejected")}>Recusar</button><button type="button" onClick={() => choose("accepted")}>Aceitar</button></div>
    </section>}
  </>;
}
