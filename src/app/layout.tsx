import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Destino Garopaba | Guia Turístico de Garopaba, SC",
  description: "Guia completo de Garopaba, Santa Catarina. Praias, trilhas, restaurantes, hospedagens, atrativos turísticos e tudo que você precisa saber para visitar Garopaba.",
  keywords: "Garopaba, Garopaba SC, Garopaba Santa Catarina, praias de Garopaba, turismo Garopaba, o que fazer em Garopaba, hospedagem Garopaba, restaurantes Garopaba, trilhas Garopaba, Praia do Silveira, Praia da Ferrugem, Praia do Siriú, Praia da Gamboa, surf Garopaba, viagem Garopaba, verão Garopaba, litoral sul catarinense, guia turístico Garopaba",
  authors: [{ name: "Destino Garopaba" }],
  creator: "Destino Garopaba",
  publisher: "Destino Garopaba",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Destino Garopaba | Guia Turístico de Garopaba, SC",
    description: "Guia completo de Garopaba, Santa Catarina. Praias, trilhas, restaurantes, hospedagens e muito mais.",
    url: "https://destinogaropaba.com.br",
    siteName: "Destino Garopaba",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://destinogaropaba.com.br/destinogaropaba.JPG",
        width: 1200,
        height: 630,
        alt: "Destino Garopaba - Guia Turístico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Destino Garopaba | Guia Turístico de Garopaba, SC",
    description: "Guia completo de Garopaba, Santa Catarina. Praias, trilhas, restaurantes, hospedagens e muito mais.",
    images: ["https://destinogaropaba.com.br/destinogaropaba.JPG"],
  },
  alternates: {
    canonical: "https://destinogaropaba.com.br",
  },
  verification: {
    google: "",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="canonical" href="https://destinogaropaba.com.br" />
        <meta name="geo.region" content="BR-SC" />
        <meta name="geo.placename" content="Garopaba" />
        <meta name="geo.position" content="-28.0278;-48.6178" />
        <meta name="ICBM" content="-28.0278, -48.6178" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TouristDestination",
              "name": "Garopaba",
              "description": "Garopaba é um município localizado no litoral sul de Santa Catarina, Brasil, famoso por suas praias paradisíacas, surf, trilhas e belezas naturais.",
              "url": "https://destinogaropaba.com.br",
              "image": "https://destinogaropaba.com.br/destinogaropaba.JPG",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Garopaba",
                "addressRegion": "Santa Catarina",
                "addressCountry": "BR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -28.0278,
                "longitude": -48.6178
              },
              "touristType": [
                "Surf",
                "Ecoturismo",
                "Praia",
                "Aventura",
                "Gastronomia"
              ],
              "includesAttraction": [
                { "@type": "TouristAttraction", "name": "Praia do Silveira" },
                { "@type": "TouristAttraction", "name": "Praia da Ferrugem" },
                { "@type": "TouristAttraction", "name": "Praia do Siriú" },
                { "@type": "TouristAttraction", "name": "Praia da Gamboa" },
                { "@type": "TouristAttraction", "name": "Praia do Centro" },
                { "@type": "TouristAttraction", "name": "Lagoa do Encanto" },
                { "@type": "TouristAttraction", "name": "Igreja São Joaquim" }
              ],
              "publisher": {
                "@type": "Organization",
                "name": "Destino Garopaba",
                "url": "https://destinogaropaba.com.br",
                "logo": "https://destinogaropaba.com.br/destinogaropaba.JPG",
                "sameAs": [
                  "https://instagram.com/povgaropaba"
                ]
              }
            }),
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}