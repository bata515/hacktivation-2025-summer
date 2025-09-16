"use client";

interface PersonaFormProps {
  mode: "create" | "edit";
  personaId?: string;
}

export default function PersonaForm({ mode, personaId }: PersonaFormProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <form className="space-y-6">
        {/* 基本情報セクション */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">基本情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">名前</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="人格の名前"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">年齢</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                placeholder="年齢"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">職業</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="職業"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">背景</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="人格の背景情報"
            />
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
                className="w-full p-2 border rounded-md"
                placeholder="性格の特徴（カンマ区切り）"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">話し方</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="話し方のスタイル"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">口調</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="口調の特徴"
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
                className="w-full p-2 border rounded-md"
                placeholder="専門分野（カンマ区切り）"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">経験</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="重要な経験（カンマ区切り）"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">記憶</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="記憶（カンマ区切り）"
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
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="信念（カンマ区切り）"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">優先事項</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="優先事項（カンマ区切り）"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {mode === "create" ? "作成" : "更新"}
          </button>
        </div>
      </form>
    </div>
  );
}
