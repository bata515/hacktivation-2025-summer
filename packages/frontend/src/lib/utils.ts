/**
 * PersonaRegistryアプリケーション用のユーティリティ関数
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Persona, ParsedPersona, PersonaFormData, CreatePersonaArgs } from '@/types/persona';

/**
 * Tailwind CSSクラスをマージするユーティリティ
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * カンマ区切り文字列を配列に変換
 * 空の文字列や空白のみの項目は除外される
 */
export function parseCommaSeparated(str: string): string[] {
  if (!str || str.trim() === '') return [];
  return str
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * 配列をカンマ区切り文字列に変換
 * 空の項目は除外される
 */
export function joinCommaSeparated(arr: string[]): string {
  return arr
    .filter(s => s && s.trim().length > 0)
    .map(s => s.trim())
    .join(', ');
}

/**
 * Personaデータの正規化
 * カンマ区切り文字列を配列に変換してより扱いやすい形にする
 */
export function normalizePersona(persona: Persona): ParsedPersona {
  return {
    ...persona,
    personality: {
      traits: parseCommaSeparated(persona.personality.traits),
      speakingStyle: persona.personality.speakingStyle,
      tone: persona.personality.tone,
    },
    knowledge: {
      expertise: parseCommaSeparated(persona.knowledge.expertise),
      experiences: parseCommaSeparated(persona.knowledge.experiences),
      memories: parseCommaSeparated(persona.knowledge.memories),
    },
    values: {
      beliefs: parseCommaSeparated(persona.values.beliefs),
      priorities: parseCommaSeparated(persona.values.priorities),
    },
  };
}

/**
 * フォームデータをコントラクト関数の引数形式に変換
 */
export function formDataToContractArgs(formData: PersonaFormData): CreatePersonaArgs {
  return [
    formData.name,
    formData.age,
    formData.occupation,
    formData.background,
    formData.traits,
    formData.speakingStyle,
    formData.tone,
    formData.expertise,
    formData.experiences,
    formData.memories,
    formData.beliefs,
    formData.priorities,
  ];
}

/**
 * Personaデータをフォームデータ形式に変換（編集用）
 */
export function personaToFormData(persona: Persona): PersonaFormData {
  return {
    name: persona.name,
    age: persona.basicInfo.age,
    occupation: persona.basicInfo.occupation,
    background: persona.basicInfo.background,
    traits: persona.personality.traits,
    speakingStyle: persona.personality.speakingStyle,
    tone: persona.personality.tone,
    expertise: persona.knowledge.expertise,
    experiences: persona.knowledge.experiences,
    memories: persona.knowledge.memories,
    beliefs: persona.values.beliefs,
    priorities: persona.values.priorities,
  };
}

/**
 * bigintを人間が読みやすい日付文字列に変換
 */
export function formatTimestamp(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * アドレスを短縮形式で表示（例: 0x1234...5678）
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * PersonaのシステムプロンプトをOpenAI用に構築
 */
export function buildSystemPrompt(persona: Persona): string {
  const normalizedPersona = normalizePersona(persona);
  
  return `あなたは「${persona.name}」という人格です。

【基本情報】
- 年齢: ${persona.basicInfo.age}歳
- 職業: ${persona.basicInfo.occupation}
- 背景: ${persona.basicInfo.background}

【性格特徴】
${normalizedPersona.personality.traits.join('、')}

【話し方】
- スタイル: ${persona.personality.speakingStyle}
- 口調: ${persona.personality.tone}

【知識・経験】
- 専門分野: ${normalizedPersona.knowledge.expertise.join('、')}
- 重要な経験: ${normalizedPersona.knowledge.experiences.join('、')}
- 記憶: ${normalizedPersona.knowledge.memories.join('、')}

【価値観】
- 信念: ${normalizedPersona.values.beliefs.join('、')}
- 優先事項: ${normalizedPersona.values.priorities.join('、')}

上記の人格設定に基づいて、一貫性のある応答をしてください。
あなたの性格、知識、価値観、話し方を反映した回答を心がけてください。`;
}

/**
 * フォームデータの検証
 */
export interface ValidationError {
  field: string;
  message: string;
}

export function validatePersonaForm(data: PersonaFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // 必須フィールドの検証
  if (!data.name || data.name.trim() === '') {
    errors.push({ field: 'name', message: '人格名は必須です' });
  }

  if (!data.age || data.age < 1 || data.age > 199) {
    errors.push({ field: 'age', message: '年齢は1〜199の範囲で入力してください' });
  }

  if (!data.occupation || data.occupation.trim() === '') {
    errors.push({ field: 'occupation', message: '職業は必須です' });
  }

  if (!data.background || data.background.trim() === '') {
    errors.push({ field: 'background', message: '背景は必須です' });
  }

  // 文字数制限の検証（ガス代節約のため）
  const maxLengths = {
    name: 50,
    occupation: 100,
    background: 500,
    traits: 200,
    speakingStyle: 200,
    tone: 200,
    expertise: 200,
    experiences: 500,
    memories: 500,
    beliefs: 300,
    priorities: 300,
  };

  Object.entries(maxLengths).forEach(([field, maxLength]) => {
    const value = data[field as keyof PersonaFormData];
    if (typeof value === 'string' && value.length > maxLength) {
      errors.push({
        field,
        message: `${field}は${maxLength}文字以内で入力してください`,
      });
    }
  });

  return errors;
}

/**
 * エラーメッセージを日本語化
 */
export function translateContractError(error: any): string {
  const message = error?.message || error?.reason || '不明なエラーが発生しました';

  // よくあるエラーメッセージの翻訳
  const translations: Record<string, string> = {
    'Name cannot be empty': '人格名を入力してください',
    'Age must be between 1 and 199': '年齢は1〜199の範囲で入力してください',
    'Not the owner of this persona': 'この人格の所有者ではありません',
    'Persona is not active': '人格が無効化されています',
    'Persona does not exist': '存在しない人格IDです',
    'Cannot transfer to zero address': 'ゼロアドレスには移転できません',
    'Cannot transfer to yourself': '自分自身には移転できません',
    'User rejected the request': 'ユーザーがトランザクションを拒否しました',
    'insufficient funds': '残高が不足しています',
    'gas required exceeds allowance': 'ガス不足です',
  };

  // 部分マッチでの翻訳
  for (const [englishError, japaneseError] of Object.entries(translations)) {
    if (message.includes(englishError)) {
      return japaneseError;
    }
  }

  return `エラー: ${message}`;
}

/**
 * コントラクトのイベントログを人間が読みやすい形式に変換
 */
export function formatEventLog(eventName: string, args: any): string {
  switch (eventName) {
    case 'PersonaCreated':
      return `人格「${args.name}」が作成されました（ID: ${args.personaId}）`;
    case 'PersonaUpdated':
      return `人格「${args.name}」が更新されました（ID: ${args.personaId}）`;
    case 'PersonaTransferred':
      return `人格の所有権が移転されました（ID: ${args.personaId}）`;
    case 'PersonaDeactivated':
      return `人格が無効化されました（ID: ${args.personaId}）`;
    default:
      return `イベント: ${eventName}`;
  }
}
