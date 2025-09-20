"use client";

/**
 * 動的インポートを使用したWeb3プロバイダーのラッパー
 * 初回ページロード時のパフォーマンスを向上させるため、
 * Web3プロバイダーを必要時まで遅延読み込みします
 */

import dynamic from "next/dynamic";
import { ReactNode, Suspense } from "react";

interface LazyWeb3ProviderProps {
  children: ReactNode;
}

// Web3Providerを動的インポート（SSRを無効化）
const Web3Provider = dynamic(() => import("../../app/Web3Provider"), {
  ssr: false, // サーバーサイドレンダリングを無効化
  loading: () => <Web3LoadingFallback />,
});

/**
 * Web3初期化中のローディング表示
 */
function Web3LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Web3接続を初期化中...</p>
        <p className="text-sm text-gray-400 mt-1">
          初回アクセス時のみ少し時間がかかります
        </p>
      </div>
    </div>
  );
}

/**
 * メインのLazyWeb3Providerコンポーネント
 */
export default function LazyWeb3Provider({ children }: LazyWeb3ProviderProps) {
  return (
    <Suspense fallback={<Web3LoadingFallback />}>
      <Web3Provider>{children}</Web3Provider>
    </Suspense>
  );
}
