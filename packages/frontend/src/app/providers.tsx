"use client";

/**
 * 軽量化されたプロバイダー設定
 * Web3関連の初期化は LazyWeb3Provider で別途管理
 */

export function Providers({ children }: { children: React.ReactNode }) {
  // 軽量化：Web3関連は削除し、基本的なアプリケーション設定のみを含める
  // Web3プロバイダーは LazyWeb3Provider で別途管理される

  return <>{children}</>;
}
