'use client';

import PersonaList from "@/components/Persona/PersonaList";
import { useTotalPersonaCount } from "@/hooks/usePersonaContract";
import { useAccount } from "wagmi";
import Link from "next/link";

export default function HomePage() {
  const { isConnected } = useAccount();
  const { totalCount } = useTotalPersonaCount();

  return (
    <main className="container mx-auto px-4 py-8">
      {/* ヒーローセクション */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          不老不死デジタル人格システム
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
          ブロックチェーン技術を活用して永続的に保存されるデジタル人格との対話システム。
          あなただけの人格を作成し、永続的な知性との対話を体験してください。
        </p>
        
        {/* 統計情報 */}
        <div className="flex justify-center space-x-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalCount || '-'}
            </div>
            <div className="text-sm text-gray-500">作成された人格</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ∞
            </div>
            <div className="text-sm text-gray-500">永続性</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              🔒
            </div>
            <div className="text-sm text-gray-500">改ざん耐性</div>
          </div>
        </div>

        {/* アクションボタン */}
        {isConnected ? (
          <Link
            href="/personas/create"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            新しい人格を作成
          </Link>
        ) : (
          <p className="text-gray-600">
            ウォレットに接続して人格を作成・管理できます
          </p>
        )}
      </div>

      {/* 機能紹介 */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-blue-600 text-2xl mb-3">🧠</div>
          <h3 className="text-lg font-semibold mb-2">デジタル人格作成</h3>
          <p className="text-gray-600 text-sm">
            性格、知識、価値観を詳細に設定して、独自のデジタル人格を作成できます。
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-green-600 text-2xl mb-3">⛓️</div>
          <h3 className="text-lg font-semibold mb-2">ブロックチェーン永続化</h3>
          <p className="text-gray-600 text-sm">
            作成した人格はブロックチェーンに永続的に保存され、改ざんできません。
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-purple-600 text-2xl mb-3">💬</div>
          <h3 className="text-lg font-semibold mb-2">AI対話</h3>
          <p className="text-gray-600 text-sm">
            OpenAI APIと連携して、作成した人格との自然な対話を楽しめます。
          </p>
        </div>
      </div>

      {/* 人格一覧 */}
      <PersonaList />

      {/* 技術情報 */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">技術仕様</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">フロントエンド</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Next.js 15.3.3 (App Router)</li>
              <li>• React 19.1.0</li>
              <li>• wagmi 2.15.6 + viem 2.29.2</li>
              <li>• RainbowKit 2.2.8</li>
              <li>• Tailwind CSS</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">ブロックチェーン</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Solidity 0.8.x</li>
              <li>• Foundry (開発・テスト)</li>
              <li>• Anvil (ローカルチェーン)</li>
              <li>• PersonaRegistry コントラクト</li>
              <li>• 完全オンチェーンストレージ</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
