import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Installease | Smart Home E-commerce",
  description: "Shop smart sockets, cameras, bulbs, locks and accessories."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${inter.variable} font-sans`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
