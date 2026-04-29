import { DM_Sans, Playfair_Display, PT_Serif } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

import QueryProvider from "@/components/providers/QueryProvider";
import { NotificationProvider } from "@/components/common/notification-provider";
import Script from "next/script";

const dmSans = DM_Sans({
  variable: "--font-dmSans",
  subsets: ["latin"],
});
const ptSerif = PT_Serif({
  variable: "--font-ptSerif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const playFair = Playfair_Display({
  variable: "--font-playFair",
  subsets: ["latin"],
});

const panchang = localFont({
  src: [
    {
      path: "../public/fonts/Panchang-Variable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-panchang",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://ebunly.com"),

  title: {
    default: "Luxury Gift Baskets & Personalized Gifts | Ebunly",
    template: "%s | Ebunly",
  },

  description:
    "Shop luxury gift baskets, wedding gifts, baby gift sets, and personalized presents perfect for every special occasion.",

  keywords: [
    "gift baskets",
    "luxury gifts",
    "wedding gifts",
    "baby gift sets",
    "personalized gifts",
    "event gifts",
  ],

  authors: [{ name: "Ebunly" }],
  creator: "Ebunly",
  publisher: "Ebunly",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  openGraph: {
    title: "Luxury Gift Baskets & Personalized Gifts",
    description:
      "Discover beautifully curated gift baskets for weddings, babies, and special occasions.",
    url: "https://yourdomain.com",
    siteName: "Ebunly",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Luxury Gift Baskets by Ebunly",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Luxury Gift Baskets & Personalized Gifts",
    description:
      "Wedding gifts, baby gift sets, and personalized luxury baskets.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${ptSerif.variable} ${playFair.variable} ${panchang.variable} antialiased bg-white font-sans`}
      >
        <QueryProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </QueryProvider>

        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
