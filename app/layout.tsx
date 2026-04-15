import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Consulting Group · Generador de posts",
  description:
    "Herramienta interna para generar posts de redes sociales a partir de PDFs, URLs o texto.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
