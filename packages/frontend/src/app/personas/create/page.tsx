import PersonaForm from "@/components/Persona/PersonaForm";

export default function CreatePersonaPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">新しい人格を作成</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          詳細な情報を入力して、あなたの理想のデジタル人格を作成してください。
          作成された人格はブロックチェーンに永続的に保存されます。
        </p>
      </div>
      <PersonaForm mode="create" />
    </main>
  );
}
