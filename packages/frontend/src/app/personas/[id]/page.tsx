import ChatInterface from "@/components/Chat/ChatInterface";

type Props = {
  params: Promise<{
    id: string;
  }>
}

export default async function PersonaDetailPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <main className="container mx-auto px-4 py-8">
      <ChatInterface personaId={id} />
    </main>
  )
}
