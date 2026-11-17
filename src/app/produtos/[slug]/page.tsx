import { permanentRedirect } from "next/navigation";

export default async function ProductRedirect({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params;
  const query = await searchParams;
  const campaign = new URLSearchParams();
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = query[key];
    if (typeof value === "string" && value.length <= 200) campaign.set(key, value);
  }
  permanentRedirect(`/concursos/${encodeURIComponent(slug)}${campaign.size ? `?${campaign}` : ""}`);
}
