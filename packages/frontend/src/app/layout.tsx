import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import LazyWeb3Provider from "@/components/Web3/LazyWeb3Provider";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "不老不死デジタル人格アプリ",
  description: "ブロックチェーン技術を活用したデジタル人格システム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${inter.className} min-h-screen bg-gray-50 flex flex-col`}
      >
        <Providers>
          <LazyWeb3Provider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </LazyWeb3Provider>
        </Providers>
      </body>
    </html>
  );
}
