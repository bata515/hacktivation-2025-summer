"use client";

import { useEffect, useState } from "react";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

export default function MessageList() {
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドでのみ時刻を表示するためのフラグ
  useEffect(() => {
    setIsClient(true);
  }, []);

  // TODO: 実際のメッセージ履歴を状態管理から取得
  const mockMessages: Message[] = [
    {
      id: "1",
      content: "こんにちは！今日はどんなことについて話したいですか？",
      role: "assistant",
      timestamp: new Date("2024-01-01T12:00:00"), // 固定値に変更
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {mockMessages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
              message.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <p className="text-xs mt-1 opacity-70">
              {isClient ? message.timestamp.toLocaleTimeString() : ""}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
