import type { Metadata } from "next";
import { Doto, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

/* ── Typography loaded via next/font/google ── */
const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "PyLearner — Python from zero to advanced",
  description:
    "Write. Run. Learn. Python from zero to advanced with browser execution and targeted test feedback.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${doto.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-accent selection:text-accent-ink">
        <Navbar />
        <main className="flex-1 page-fade-in">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
