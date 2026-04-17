import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Destino Garopaba | O guia definitivo de Garopaba, SC",
  description: "Descubra tudo sobre Garopaba, SC. Praias, trilhas, restaurantes, hospedagens e atrativos turísticos. O guia completo para sua viagem a Garopaba.",
  keywords: "Garopaba, Garopaba SC, praias de Garopaba, turismo Garopaba, o que fazer em Garopaba, hospedagem Garopaba, restaurantes Garopaba, trilhas Garopaba, Praia do Silveira, surf Garopaba",
  authors: [{ name: "Destino Garopaba" }],
  creator: "Destino Garopaba",
  openGraph: {
    title: "Destino Garopaba | O guia definitivo de Garopaba, SC",
    description: "Descubra tudo sobre Garopaba, SC. Praias, trilhas, restaurantes, hospedagens e atrativos turísticos.",
    url: "https://destinogaropaba.com.br",
    siteName: "Destino Garopaba",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Destino Garopaba | O guia definitivo de Garopaba, SC",
    description: "Descubra tudo sobre Garopaba, SC. Praias, trilhas, restaurantes, hospedagens e atrativos turísticos.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://destinogaropaba.com.br",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}