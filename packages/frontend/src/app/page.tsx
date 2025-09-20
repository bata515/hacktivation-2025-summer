"use client";

import PersonaList from "@/components/Persona/PersonaList";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
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
    </main>
  );
}
