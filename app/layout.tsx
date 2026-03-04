import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sourav Gokul | Portfolio",
  description: "Associate Software Developer (Frontend) portfolio of Sourav Velusamy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
