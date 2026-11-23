"use client";

import { useEffect, useRef } from "react";
import { trackProductView } from "@/lib/meta-pixel";

export function MetaProductView({ slug }: { slug: string }) {
  const trackedSlug = useRef<string | null>(null);
  useEffect(() => {
    const send = () => {
      if (trackedSlug.current === slug || window.location.pathname !== `/concursos/${slug}`) return;
      if (trackProductView(slug)) trackedSlug.current = slug;
    };
    send();
    window.addEventListener("nexora:meta-ready", send);
    return () => window.removeEventListener("nexora:meta-ready", send);
  }, [slug]);
  return null;
}
