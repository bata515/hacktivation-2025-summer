'use client';

/**
 * 人格カード表示コンポーネント
 * 人格の基本情報を表示し、詳細ページへのリンクを提供
 */

import Link from 'next/link';
import { Persona } from '@/types/persona';
import { formatTimestamp, parseCommaSeparated } from '@/lib/utils';
import { useAccount } from 'wagmi';

interface PersonaCardProps {
  persona: Persona;
  showActions?: boolean;
}

export default function PersonaCard({ persona, showActions = true }: PersonaCardProps) {
  const { address } = useAccount();
  const isOwner = address === persona.owner;
  const traits = parseCommaSeparated(persona.personality.traits);
  const expertise = parseCommaSeparated(persona.knowledge.expertise);

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{persona.name}</h3>
          <p className="text-sm text-gray-500">
            {persona.basicInfo.age}歳 · {persona.basicInfo.occupation}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400">ID: #{persona.id.toString()}</span>
          {isOwner && (
            <div className="mt-1">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                所有中
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 基本情報 */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {persona.basicInfo.background}
        </p>
      </div>

      {/* 特徴タグ */}
      {traits.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">性格特徴</p>
          <div className="flex flex-wrap gap-1">
            {traits.slice(0, 3).map((trait, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {trait}
              </span>
            ))}
            {traits.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                +{traits.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 専門分野 */}
      {expertise.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">専門分野</p>
          <div className="flex flex-wrap gap-1">
            {expertise.slice(0, 2).map((field, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
              >
                {field}
              </span>
            ))}
            {expertise.length > 2 && (
              <span className="inline-block px-2 py-1 bg-green-100 text-green-600 text-xs rounded">
                +{expertise.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      {/* メタ情報 */}
      <div className="text-xs text-gray-400 mb-4">
        作成日: {formatTimestamp(persona.createdAt)}
        {persona.updatedAt !== persona.createdAt && (
          <>
            <br />
            更新日: {formatTimestamp(persona.updatedAt)}
          </>
        )}
      </div>

      {/* アクションボタン */}
      {showActions && (
        <div className="flex space-x-2">
          <Link
            href={`/personas/${persona.id}`}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 text-center transition-colors"
          >
            チャット
          </Link>
          {isOwner && (
            <Link
              href={`/personas/${persona.id}/edit`}
              className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
            >
              編集
            </Link>
          )}
        </div>
      )}

      {/* 非アクティブの場合の表示 */}
      {!persona.isActive && (
        <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800 text-sm">⚠️ この人格は無効化されています</p>
        </div>
      )}
    </div>
  );
}
