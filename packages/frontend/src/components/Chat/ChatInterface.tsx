"use client";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

type Props = {
  personaId: string
}

export default function ChatInterface({ personaId }: Props) {
  return (
    <div className="max-w-4xl mx-auto h-[600px] flex flex-col bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">人格との対話</h2>
        <p className="text-sm text-gray-500">Persona ID: {personaId}</p>
      </div>

      <div className="flex-1 overflow-hidden">
        <MessageList />
      </div>

      <div className="border-t">
        <MessageInput />
      </div>
    </div>
  )
}
