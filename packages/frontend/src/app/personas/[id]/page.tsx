import ChatInterface from "@/components/Chat/ChatInterface";

interface PersonaDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PersonaDetailPage({
  params,
}: PersonaDetailPageProps) {
  const { id } = await params;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">人格との対話</h1>
      <ChatInterface personaId={id} />
    </main>
  );
}
