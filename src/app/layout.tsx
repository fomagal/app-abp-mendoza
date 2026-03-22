import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABP Mendoza 2026 · DGE",
  description: "Diseño de Proyectos ABP para el Ciclo 2026 - DGE Mendoza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}