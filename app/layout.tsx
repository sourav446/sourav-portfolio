import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sourav Velusamy | Portfolio",
  description: "Associate Software Developer (Frontend) portfolio of Sourav Velusamy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
