"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

// Web3コンポーネントを動的インポート（遅延読み込み）
const ConnectButton = dynamic(() => import("@/components/Web3/ConnectButton"), {
  ssr: false,
  loading: () => (
    <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-md"></div>
  ),
});

const ConnectionStatus = dynamic(
  () =>
    import("@/components/Web3/ConnectButton").then((mod) => ({
      default: mod.ConnectionStatus,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-32 h-6 bg-gray-200 animate-pulse rounded"></div>
    ),
  }
);

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* ロゴとナビゲーション */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              不老不死デジタル人格
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ホーム
              </Link>
              <Link
                href="/personas/create"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                人格作成
              </Link>
            </nav>
          </div>

          {/* ウォレット接続 */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <ConnectionStatus />
            </div>
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
