'use client';

/**
 * 人格一覧表示コンポーネント
 * ユーザーが所有する人格をブロックチェーンから取得して表示
 */

import Link from 'next/link';
import { memo } from 'react';
import { useAccount } from 'wagmi';
import PersonaCard from './PersonaCard';
import { useUserPersonas, useTotalPersonaCount } from '@/hooks/usePersonaContract';

interface PersonaListProps {
  title?: string;
  showCreateButton?: boolean;
  userAddress?: `0x${string}`;
}

function PersonaList({
  title = 'あなたの人格',
  showCreateButton = true,
  userAddress
}: PersonaListProps) {
  const { isConnected } = useAccount();
  const { personas, isLoading, error, refetch } = useUserPersonas(userAddress);
  const { totalCount } = useTotalPersonaCount();

  // 接続していない場合の表示
  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 mb-4">
            人格一覧を表示するにはウォレットに接続してください
          </p>
          <p className="text-sm text-gray-600">
            全体で{totalCount || 0}個の人格が作成されています
          </p>
        </div>
      </div>
    );
  }

  // ローディング状態
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {showCreateButton && (
            <Link
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              href="/personas/create"
            >
              新しい人格を作成
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* スケルトンローダー */}
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow border animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {showCreateButton && (
            <Link
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              href="/personas/create"
            >
              新しい人格を作成
            </Link>
          )}
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 mb-4">
            人格データの取得に失敗しました
          </p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  const hasPersonas = personas && personas.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {hasPersonas && (
            <p className="text-sm text-gray-500 mt-1">
              {personas.length}個の人格を所有しています
              {totalCount && ` · 全体で${totalCount}個が作成済み`}
            </p>
          )}
        </div>
        {showCreateButton && (
          <Link
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            href="/personas/create"
          >
            新しい人格を作成
          </Link>
        )}
      </div>

      {hasPersonas ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <PersonaCard key={persona.id.toString()} persona={persona} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">まだ人格が作成されていません</p>
          <p className="text-sm text-gray-400 mb-6">
            {totalCount 
              ? `他のユーザーが${totalCount}個の人格を作成しています` 
              : '最初の人格を作成してみませんか？'}
          </p>
          {showCreateButton && (
            <Link
              href="/personas/create"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              最初の人格を作成
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// メモ化でパフォーマンス最適化
// Props が変わらない限り再レンダリングを防ぐ
export default memo(PersonaList, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.showCreateButton === nextProps.showCreateButton &&
    prevProps.userAddress === nextProps.userAddress
  );
});
