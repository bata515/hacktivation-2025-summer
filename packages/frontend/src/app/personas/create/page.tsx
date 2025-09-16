import PersonaForm from "@/components/Persona/PersonaForm";

export default function CreatePersonaPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">新しい人格を作成</h1>
      <PersonaForm mode="create" />
    </main>
  );
}
