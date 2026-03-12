import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bilgi Sitesi",
  description: "Notlar, kategoriler, etiketler ve dipnotlar ile çalışan bilgi sitesi"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
