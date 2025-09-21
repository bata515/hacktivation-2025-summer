/**
 * OpenAI API クライアント
 * 人格データを使ってチャット機能を提供
 */

import OpenAI from "openai";
import { Persona } from "@/types/persona";
import { buildSystemPrompt } from "./utils";

// OpenAIクライアントのインスタンス化
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true, // クライアントサイドでの使用を許可
});

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  content: string;
  error?: string;
}

/**
 * 人格と対話するためのOpenAI API呼び出し
 */
export async function chatWithPersona(
  persona: Persona,
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<ChatResponse> {
  try {
    // APIキーの確認
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      throw new Error("OpenAI API キーが設定されていません");
    }

    // システムプロンプトを構築
    const systemPrompt = buildSystemPrompt(persona);

    // メッセージを構築
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-10), // 直近10件の会話履歴を使用
      { role: "user", content: userMessage },
    ];

    // OpenAI APIに送信
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini", // コスト効率の良いモデルを使用
      messages:
        messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature: 0.7, // 創造性と一貫性のバランス
      max_tokens: 500, // 応答の最大長
      presence_penalty: 0.6, // 話題の多様性を促進
      frequency_penalty: 0.3, // 繰り返しを軽減
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error("OpenAI から応答が得られませんでした");
    }

    return {
      content: assistantMessage,
    };
  } catch (error: any) {
    console.error("OpenAI API エラー:", error);

    // エラーメッセージを適切に処理
    let errorMessage =
      "申し訳ありません。現在チャット機能に問題が発生しています。";

    if (error.code === "invalid_api_key") {
      errorMessage = "OpenAI API キーが無効です。設定を確認してください。";
    } else if (error.code === "quota_exceeded") {
      errorMessage =
        "OpenAI APIの利用制限に達しました。しばらく後に再試行してください。";
    } else if (error.code === "rate_limit_exceeded") {
      errorMessage =
        "リクエストが多すぎます。少し待ってから再試行してください。";
    } else if (error.message?.includes("API キーが設定されていません")) {
      errorMessage =
        "OpenAI API キーが設定されていません。環境変数を確認してください。";
    }

    return {
      content: errorMessage,
      error: error.message || "Unknown error",
    };
  }
}

/**
 * APIキーの検証
 */
export function validateApiKey(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  return !!(apiKey && apiKey.startsWith("sk-"));
}

/**
 * OpenAI APIの接続テスト
 */
export async function testConnection(): Promise<boolean> {
  try {
    if (!validateApiKey()) {
      return false;
    }

    // 簡単なテストリクエストを送信
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5,
    });

    return !!completion.choices[0]?.message?.content;
  } catch (error) {
    console.error("OpenAI 接続テストに失敗:", error);
    return false;
  }
}
