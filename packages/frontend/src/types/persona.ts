/**
 * PersonaRegistryスマートコントラクトのTypeScript型定義
 * 設計書のデータ構造に基づいて作成
 */

// 基本情報の型定義
export interface BasicInfo {
  age: number;           // 年齢（1-199）
  occupation: string;    // 職業
  background: string;    // 背景・経歴
}

// 性格特性の型定義
export interface Personality {
  traits: string;        // 性格特徴（カンマ区切り）
  speakingStyle: string; // 話し方
  tone: string;          // 口調
}

// 知識・経験の型定義
export interface Knowledge {
  expertise: string;     // 専門分野（カンマ区切り）
  experiences: string;   // 経験（カンマ区切り）
  memories: string;      // 記憶（カンマ区切り）
}

// 価値観の型定義
export interface Values {
  beliefs: string;       // 信念（カンマ区切り）
  priorities: string;    // 優先事項（カンマ区切り）
}

// 完全な人格データの型定義（オンチェーンデータに対応）
export interface Persona {
  id: bigint;                    // 人格ID
  name: string;                  // 人格名
  basicInfo: BasicInfo;          // 基本情報
  personality: Personality;      // 性格特性
  knowledge: Knowledge;          // 知識・経験
  values: Values;                // 価値観
  owner: `0x${string}`;          // 所有者アドレス（viemのAddress型）
  createdAt: bigint;             // 作成タイムスタンプ（Unix秒）
  updatedAt: bigint;             // 更新タイムスタンプ（Unix秒）
  isActive: boolean;             // アクティブ状態
}

// フォームデータの型定義（人格作成・編集用）
export interface PersonaFormData {
  name: string;
  age: number;
  occupation: string;
  background: string;
  traits: string;
  speakingStyle: string;
  tone: string;
  expertise: string;
  experiences: string;
  memories: string;
  beliefs: string;
  priorities: string;
}

// コントラクト関数の引数型定義
export type CreatePersonaArgs = [
  string, // name
  number, // age (uint8)
  string, // occupation
  string, // background
  string, // traits
  string, // speakingStyle
  string, // tone
  string, // expertise
  string, // experiences
  string, // memories
  string, // beliefs
  string  // priorities
];

// カンマ区切り文字列を配列に変換するユーティリティ型
export interface ParsedPersona extends Omit<Persona, 'personality' | 'knowledge' | 'values'> {
  personality: {
    traits: string[];
    speakingStyle: string;
    tone: string;
  };
  knowledge: {
    expertise: string[];
    experiences: string[];
    memories: string[];
  };
  values: {
    beliefs: string[];
    priorities: string[];
  };
}

// コントラクトエラーの型定義
export interface ContractError extends Error {
  code?: string;
  reason?: string;
  data?: any;
}

// トランザクション状態の型定義
export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

// チャット関連の型定義
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isGenerating: boolean;
  error: string | null;
}
