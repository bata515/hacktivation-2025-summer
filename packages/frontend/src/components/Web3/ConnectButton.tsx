'use client';

/**
 * RainbowKitのConnectButtonをカスタマイズしたコンポーネント
 * ウォレット接続状態の表示と管理を担当
 */

import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';

interface ConnectButtonProps {
  className?: string;
}

export default function ConnectButton({ className = '' }: ConnectButtonProps) {
  return (
    <div className={className}>
      <RainbowConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // サーバーサイドレンダリング対応
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      ウォレットを接続
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      ⚠️ 未対応チェーン
                    </button>
                  );
                }

                return (
                  <div className="flex items-center space-x-2">
                    {/* チェーン表示ボタン */}
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center space-x-1"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      <span className="text-sm">{chain.name}</span>
                    </button>

                    {/* アカウント表示ボタン */}
                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <span className="text-sm">
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </span>
                      <span className="text-sm font-mono">
                        {account.displayName}
                      </span>
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </RainbowConnectButton.Custom>
    </div>
  );
}

/**
 * シンプルな接続状態表示コンポーネント
 * 接続状態のみを確認したい場合に使用
 */
export function ConnectionStatus() {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnecting) {
    return <div className="text-yellow-600">接続中...</div>;
  }

  if (!isConnected) {
    return <div className="text-red-600">未接続</div>;
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="text-green-600">✅ 接続済み</div>
      <div className="text-sm text-gray-500 font-mono">
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </div>
      <button
        onClick={() => disconnect()}
        className="text-sm text-red-600 hover:text-red-800 underline"
      >
        切断
      </button>
    </div>
  );
}
