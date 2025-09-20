"use client";

/**
 * チャットインターフェースコンポーネント
 * 人格との対話を管理するメインコンポーネント
 */

import { useState, memo } from "react";
import { Persona } from "@/types/persona";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  persona: Persona;
}

function ChatInterface({ persona }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `こんにちは！私は${persona.name}です。${persona.basicInfo.occupation}をしています。何かお話ししましょうか？`,
      timestamp: new Date(),
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 会話履歴をOpenAI形式に変換
  const getConversationHistory = (): {
    role: "user" | "assistant";
    content: string;
  }[] => {
    return messages
      .filter((msg) => msg.role !== "assistant" || msg.id !== "1") // 初期メッセージを除外
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);
    setError(null);

    try {
      // OpenAI APIを使用して応答を生成
      const { chatWithPersona } = await import("@/lib/openai");
      const response = await chatWithPersona(
        persona,
        content,
        getConversationHistory()
      );

      if (response.error) {
        throw new Error(response.error);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("メッセージ送信エラー:", error);
      setError(error.message || "不明なエラーが発生しました");

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "申し訳ありません。現在チャット機能に問題が発生しています。しばらく後に再試行してください。",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-[600px] flex flex-col">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold">{persona.name} との対話</h2>
        <p className="text-sm text-gray-500">
          {persona.basicInfo.occupation} · {persona.basicInfo.age}歳
        </p>
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            エラー: {error}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-scroll">
        <MessageList messages={messages} isGenerating={isGenerating} />
      </div>

      <div className="border-t">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isGenerating}
        />
      </div>
    </div>
  );
}

// メモ化でパフォーマンス最適化
// persona.idが変わらない限り再レンダリングを防ぐ
export default memo(ChatInterface, (prevProps, nextProps) => {
  return prevProps.persona.id === nextProps.persona.id;
});
