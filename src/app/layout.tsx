import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import PromoPopup from "@/components/PromoPopup";
import CustomerChatWidget from "@/components/chat/CustomerChatWidget";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
  title: "Eglider | Top Swimwear Manufacturer in Kolkata & West Bengal",
  description: "Eglider is the top swimwear manufacturer in Kolkata and West Bengal. We provide the best professional swimming sportswear, high-performance racing swimsuits, elite gear, and custom swimwear manufacturing services.",
  keywords: [
    "top swimwear manufacturer in kolkata",
    "top swimwear manufacturer in west bengal",
    "best swimwear manufacturer",
    "swimwear",
    "swimwear manufacturer india",
    "custom swimwear manufacturer",
    "professional swimming sportswear",
    "competitive swimwear",
    "racing swimsuits",
    "elite swimming gear",
    "high-performance swim gear",
    "triathlon wetsuits",
    "tech suits for swimming",
    "swimwear for athletes",
    "FINA approved swimwear",
    "luxury swimming brand",
    "swimsuit supplier",
    "swimwear factory kolkata",
    "bulk swimwear manufacturing",
    "private label swimwear"
  ],
  authors: [{ name: "Eglider" }],
  creator: "Eglider",
  publisher: "Eglider",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Eglider | Top Swimwear Manufacturer in Kolkata & West Bengal",
    description: "Eglider is the top swimwear manufacturer in Kolkata and West Bengal. We provide the best professional swimming sportswear, high-performance racing swimsuits, elite gear, and custom swimwear manufacturing services.",
    url: "https://eglider.com",
    siteName: "Eglider Swimwear",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Eglider - Top Swimwear Manufacturer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eglider | Top Swimwear Manufacturer",
    description: "Best swimwear manufacturer in Kolkata & West Bengal offering professional swimming gear and custom manufacturing.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://eglider.com',
  },
};

import MobileBottomNav from "@/components/MobileBottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Eglider",
    "url": "https://eglider.com",
    "logo": "https://eglider.com/logo.png",
    "description": "Top swimwear manufacturer in Kolkata and West Bengal, offering professional swimming sportswear and custom manufacturing.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "addressCountry": "IN"
    }
  };

  return (
    <html lang="en">
      <body className={`${inter.variable} ${oswald.variable}`}>
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          <ChatProvider>
            <div className="layout-content">
              {children}
            </div>
            <PromoPopup />
            <CustomerChatWidget />
            <MobileBottomNav />
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
