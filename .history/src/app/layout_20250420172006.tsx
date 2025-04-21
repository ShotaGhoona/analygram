import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/display/Sidebar";
import Header from "../components/display/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Instagram Analysis",
  description: "Instagram analytics dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Sidebar /> */}
        <Header />
        <main className="p-8">
          {children}
        </main>
      </body>
    </html>
  );
} 