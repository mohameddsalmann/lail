import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lail Fragrances - Your Egyptian Gateway to Luxurious Fragrances",
  description: "Discover luxury fragrances at Lail Fragrances. Take our personalized quiz to find your perfect scent from our curated collection.",
  keywords: ["perfume", "fragrance", "Lail Fragrances", "quiz", "recommendation", "Egypt", "luxury", "scent"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
