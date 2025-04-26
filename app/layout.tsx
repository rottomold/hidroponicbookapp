import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // Importa Toaster

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hidroponic Book",
  description: "Hidroponic Book App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#4CAF50" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Añade Toaster al final */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
