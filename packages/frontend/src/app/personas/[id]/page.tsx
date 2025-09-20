"use client";

import { use } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { usePersona } from "@/hooks/usePersonaContract";
import PersonaCard from "@/components/Persona/PersonaCard";
import ChatInterface from "@/components/Chat/ChatInterface";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function PersonaDetailPage({ params }: Props) {
  const { id } = use(params);
  const personaId = BigInt(id);
  const { address } = useAccount();

  const { persona, isLoading, error } = usePersona(personaId);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">人格データを読み込み中...</p>
        </div>
      </main>
    );
  }

  if (error || !persona) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            人格が見つかりません
          </h1>
          <p className="text-gray-600 mb-6">
            {error ||
              "指定された人格は存在しないか、削除されている可能性があります。"}
          </p>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </main>
    );
  }

  const isOwner = address === persona.owner;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* チャットインターフェース */}
        <div className="bg-white rounded-lg shadow border">
          <ChatInterface persona={persona} />
        </div>

        {/* 人格の詳細情報 */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">人格の詳細情報</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">基本情報</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>年齢:</strong> {persona.basicInfo.age}歳
                </p>
                <p>
                  <strong>職業:</strong> {persona.basicInfo.occupation}
                </p>
                <p>
                  <strong>背景:</strong> {persona.basicInfo.background}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">話し方</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>スタイル:</strong> {persona.personality.speakingStyle}
                </p>
                <p>
                  <strong>口調:</strong> {persona.personality.tone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
