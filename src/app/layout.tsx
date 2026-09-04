import type { Metadata } from "next";
import { Cormorant_Garamond, Lora } from "next/font/google";
import { AuthHashHandler } from "@/components/AuthHashHandler";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "El Urbanista",
  description: "Generador de Memoria de Ordenación — El Urbanista",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-rail font-sans text-text">
        <AuthHashHandler />
        {children}
      </body>
    </html>
  );
}
