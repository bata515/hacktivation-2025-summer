"use client";

/**
 * 遅延初期化対応のWeb3プロバイダー
 * パフォーマンス最適化のため、Web3関連の初期化を必要時まで遅延させる
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { config } from "../wagmi";
import { useState, ReactNode } from "react";

interface Web3ProviderProps {
  children: ReactNode;
}

export default function Web3Provider({ children }: Web3ProviderProps) {
  // React Query clientの初期化
  // 各コンポーネントで新しいインスタンスが作られないように useState を使用
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // エラー時の自動リトライを無効化（開発時のデバッグ用）
            retry: false,
            // パフォーマンス最適化：キャッシュ時間を5分に延長
            staleTime: 1000 * 60 * 5, // 5分
            // 不要なリフェッチを無効化
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      })
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#3b82f6", // blue-500
            accentColorForeground: "white",
            borderRadius: "medium",
          })}
          showRecentTransactions={true}
          appInfo={{
            appName: "不老不死デジタル人格アプリ",
            learnMoreUrl: "https://github.com/your-repo",
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
