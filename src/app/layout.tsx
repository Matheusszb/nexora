import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CampaignCapture } from "@/components/campaign-capture";
import { siteUrl } from "@/lib/format";
import "./globals.css";
import "./course-list.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Apostilas digitais para concursos | Nexora Concursos", template: "%s | Nexora Concursos" },
  description: "Apostilas digitais para concursos públicos: compare conteúdo, veja amostras reais e confira preço e entrega antes de comprar.",
  openGraph: { type: "website", locale: "pt_BR", siteName: "Nexora Concursos", images: ["/nexora-logo.png"] },
  twitter: { card: "summary_large_image" },
  verification: process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : undefined,
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><CampaignCapture/><Header />{children}<Footer /></body></html>;
}
