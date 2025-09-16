import PersonaList from "@/components/Persona/PersonaList";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">デジタル人格一覧</h1>
      <PersonaList />
    </main>
  );
}
