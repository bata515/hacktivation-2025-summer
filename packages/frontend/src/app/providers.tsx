'use client';

/**
 * Web3プロバイダーの設定
 * wagmi、RainbowKit、React Queryの初期化を担当
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '../wagmi';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // React Query clientの初期化
  // 各コンポーネントで新しいインスタンスが作られないように useState を使用
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // エラー時の自動リトライを無効化（開発時のデバッグ用）
            retry: false,
            // ローカル開発用の短いキャッシュ時間
            staleTime: 1000 * 30, // 30秒
          },
        },
      })
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#3b82f6', // blue-500
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}
          showRecentTransactions={true}
          appInfo={{
            appName: '不老不死デジタル人格アプリ',
            learnMoreUrl: 'https://github.com/your-repo',
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
