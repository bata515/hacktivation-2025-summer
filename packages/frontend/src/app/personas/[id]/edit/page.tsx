import PersonaForm from "@/components/Persona/PersonaForm";

type Props = {
  params: Promise<{
    id: string;
  }>
}

export default async function EditPersonaPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">人格を編集</h1>
      <PersonaForm mode="edit" personaId={id} />
    </main>
  )
}
