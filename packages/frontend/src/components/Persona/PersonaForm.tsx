'use client';

/**
 * 人格作成・編集フォームコンポーネント
 * PersonaRegistryコントラクトとの連携を含む
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useCreatePersona, useUpdatePersona, usePersona } from '@/hooks/usePersonaContract';
import { PersonaFormData, Persona } from '@/types/persona';
import { validatePersonaForm, personaToFormData } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PersonaFormProps {
  mode: 'create' | 'edit';
  personaId?: bigint;
  onSuccess?: (personaId?: bigint) => void;
  onCancel?: () => void;
}

export default function PersonaForm({ mode, personaId, onSuccess, onCancel }: PersonaFormProps) {
  const router = useRouter();
  const { isConnected } = useAccount();

  // 既存の人格データ取得（編集モードの場合）
  const { persona, isLoading: isLoadingPersona } = usePersona(mode === 'edit' ? personaId : undefined);

  // コントラクト操作フック
  const { createPersona, isPending: isCreating, error: createError } = useCreatePersona();
  const { updatePersona, isPending: isUpdating, error: updateError } = useUpdatePersona();

  // フォームの状態管理
  const [formData, setFormData] = useState<PersonaFormData>({
    name: '',
    age: 25,
    occupation: '',
    background: '',
    traits: '',
    speakingStyle: '',
    tone: '',
    expertise: '',
    experiences: '',
    memories: '',
    beliefs: '',
    priorities: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 編集モードの場合、既存データでフォームを初期化
  useEffect(() => {
    if (mode === 'edit' && persona) {
      setFormData(personaToFormData(persona));
    }
  }, [mode, persona]);

  // フォーム入力ハンドラー
  const handleInputChange = (field: keyof PersonaFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // フォーム送信ハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('ウォレットに接続してください');
      return;
    }

    // バリデーション
    const validationErrors = validatePersonaForm(formData);
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach(({ field, message }) => {
        errorMap[field] = message;
      });
      setErrors(errorMap);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (mode === 'create') {
        await createPersona(formData);
        onSuccess?.();
        router.push('/');
      } else if (mode === 'edit' && personaId) {
        await updatePersona(personaId, formData);
        onSuccess?.(personaId);
      }
    } catch (error) {
      console.error('フォーム送信エラー:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ローディング表示
  if (mode === 'edit' && isLoadingPersona) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">人格データを読み込み中...</p>
        </div>
      </div>
    );
  }

  const isPending = isCreating || isUpdating || isSubmitting;
  const currentError = createError || updateError;

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* エラー表示 */}
        {currentError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">
              <strong>エラー:</strong> {currentError}
            </div>
          </div>
        )}

        {/* 接続チェック */}
        {!isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="text-yellow-800">
              ⚠️ ウォレットに接続してください
            </div>
          </div>
        )}

        {/* 基本情報セクション */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">基本情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">名前 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={cn(
                  "w-full p-2 border rounded-md",
                  errors.name ? "border-red-300" : "border-gray-300"
                )}
                placeholder="人格の名前"
                maxLength={50}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">年齢 <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                className={cn(
                  "w-full p-2 border rounded-md",
                  errors.age ? "border-red-300" : "border-gray-300"
                )}
                placeholder="年齢"
                min={1}
                max={199}
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">職業 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                className={cn(
                  "w-full p-2 border rounded-md",
                  errors.occupation ? "border-red-300" : "border-gray-300"
                )}
                placeholder="職業"
                maxLength={100}
              />
              {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">背景 <span className="text-red-500">*</span></label>
            <textarea
              value={formData.background}
              onChange={(e) => handleInputChange('background', e.target.value)}
              className={cn(
                "w-full p-2 border rounded-md",
                errors.background ? "border-red-300" : "border-gray-300"
              )}
              rows={3}
              placeholder="人格の背景情報"
              maxLength={500}
            />
            {errors.background && <p className="text-red-500 text-sm mt-1">{errors.background}</p>}
          </div>
        </section>

        {/* 性格セクション */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">性格</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">特徴</label>
              <input
                type="text"
                value={formData.traits}
                onChange={(e) => handleInputChange('traits', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="性格の特徴（カンマ区切り）例: 好奇心旺盛, 慎重, 楽観的"
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">話し方</label>
              <input
                type="text"
                value={formData.speakingStyle}
                onChange={(e) => handleInputChange('speakingStyle', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="話し方のスタイル 例: 丁寧で分かりやすい説明を心がける"
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">口調</label>
              <input
                type="text"
                value={formData.tone}
                onChange={(e) => handleInputChange('tone', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="口調の特徴 例: 敬語を使うが親しみやすい"
                maxLength={200}
              />
            </div>
          </div>
        </section>

        {/* 知識セクション */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">知識・経験</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">専門分野</label>
              <input
                type="text"
                value={formData.expertise}
                onChange={(e) => handleInputChange('expertise', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="専門分野（カンマ区切り）例: プログラミング, 数学, 物理学"
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">経験</label>
              <textarea
                value={formData.experiences}
                onChange={(e) => handleInputChange('experiences', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="重要な経験（カンマ区切り）例: 大学での研究, 企業での開発経験"
                maxLength={500}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">記憶</label>
              <textarea
                value={formData.memories}
                onChange={(e) => handleInputChange('memories', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="記憶（カンマ区切り）例: 初めてプログラムを書いた日, 重要なプロジェクト"
                maxLength={500}
              />
            </div>
          </div>
        </section>

        {/* 価値観セクション */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">価値観</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">信念</label>
              <textarea
                value={formData.beliefs}
                onChange={(e) => handleInputChange('beliefs', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="信念（カンマ区切り）例: 技術は人々の生活を豊かにするべき, 学習は生涯続ける"
                maxLength={300}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">優先事項</label>
              <textarea
                value={formData.priorities}
                onChange={(e) => handleInputChange('priorities', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="優先事項（カンマ区切り）例: 品質重視, ユーザー体験の向上, チーム協力"
                maxLength={300}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel || (() => router.back())}
            disabled={isPending}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isPending || !isConnected}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {isPending && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>
              {isPending
                ? `${mode === 'create' ? '作成' : '更新'}中...`
                : mode === 'create'
                ? '作成'
                : '更新'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
