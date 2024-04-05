// layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Topbar from "../components/Topbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Math Problem Generator",
  description: "Generate math problems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Topbar />
        {children}
      </body>
    </html>
  );
}