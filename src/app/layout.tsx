import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CampaignCapture } from "@/components/campaign-capture";
import { siteUrl } from "@/lib/format";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Nexora Digital | Conhecimento para o próximo passo", template: "%s | Nexora Digital" },
  description: "Explore produtos digitais para aprender, organizar ideias e desenvolver novas possibilidades.",
  openGraph: { type: "website", locale: "pt_BR", siteName: "Nexora Digital", images: ["/nexora-logo.png"] },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><CampaignCapture/><Header />{children}<Footer /></body></html>;
}
