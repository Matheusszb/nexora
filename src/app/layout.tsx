import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CampaignCapture } from "@/components/campaign-capture";
import { siteUrl } from "@/lib/format";
import "./globals.css";
import "./course-list.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Nexora Digital | Materiais para concursos públicos", template: "%s | Nexora Digital" },
  description: "Explore todos os cursos e apostilas para concursos públicos. Confira conteúdo, formato e condições antes de comprar.",
  openGraph: { type: "website", locale: "pt_BR", siteName: "Nexora Digital", images: ["/nexora-logo.png"] },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><CampaignCapture/><Header />{children}<Footer /></body></html>;
}
