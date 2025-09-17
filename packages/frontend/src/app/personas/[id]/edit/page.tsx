'use client';

import { use } from 'react';
import PersonaForm from "@/components/Persona/PersonaForm";

type Props = {
  params: Promise<{
    id: string;
  }>
}

export default function EditPersonaPage({
  params,
}: Props) {
  const { id } = use(params);
  const personaId = BigInt(id);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">人格を編集</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          人格情報を更新できます。変更はブロックチェーンに記録されます。
        </p>
      </div>
      <PersonaForm mode="edit" personaId={personaId} />
    </main>
  )
}
