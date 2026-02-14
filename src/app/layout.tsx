import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "nspired - Find Your Perfect Scent",
  description: "Discover luxury fragrances at inspired prices. Take our quiz to find your perfect match from nspired perfumes.",
  keywords: ["perfume", "fragrance", "nspired", "quiz", "recommendation", "Egypt", "Source Beauty"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
