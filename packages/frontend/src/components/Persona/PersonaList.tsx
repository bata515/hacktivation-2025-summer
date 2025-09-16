import PersonaCard from "./PersonaCard";
import Link from "next/link";

export default function PersonaList() {
  // TODO: 実際のデータはブロックチェーンから取得
  const mockPersonas = [
    {
      id: "1",
      name: "田中先生",
      age: 45,
      occupation: "大学教授",
      background:
        "哲学を専門とする大学教授。学生との対話を通じて深い洞察を提供します。",
    },
    {
      id: "2",
      name: "佐藤エンジニア",
      age: 32,
      occupation: "ソフトウェアエンジニア",
      background:
        "10年以上のフルスタック開発経験を持つエンジニア。技術的な問題解決が得意です。",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">あなたの人格</h2>
        <Link
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          href="/personas/create"
        >
          新しい人格を作成
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPersonas.map((persona) => (
          <PersonaCard key={persona.id} {...persona} />
        ))}
      </div>

      {mockPersonas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">まだ人格が作成されていません</p>
          <Link
            href="/personas/create"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            最初の人格を作成
          </Link>
        </div>
      )}
    </div>
  );
}
