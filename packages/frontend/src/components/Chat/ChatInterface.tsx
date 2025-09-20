'use client';

/**
 * チャットインターフェースコンポーネント
 * 人格との対話を管理するメインコンポーネント
 */

import { useState, memo } from 'react';
import { Persona } from '@/types/persona';
import { buildSystemPrompt } from '@/lib/utils';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  persona: Persona;
}

function ChatInterface({ persona }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `こんにちは！私は${persona.name}です。${persona.basicInfo.occupation}をしています。何かお話ししましょうか？`,
      timestamp: new Date(),
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    // デモ用の簡単な応答生成
    // 実際のOpenAI API統合はここで行います
    try {
      // システムプロンプトを構築
      const systemPrompt = buildSystemPrompt(persona);
      
      // デモ応答（実際はOpenAI APIを呼び出し）
      await new Promise(resolve => setTimeout(resolve, 300)); // レスポンシブ感を保つ最小限の遅延
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateDemoResponse(content, persona),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '申し訳ありません。何か問題が発生しました。もう一度お試しください。',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-[600px] flex flex-col">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold">{persona.name} との対話</h2>
        <p className="text-sm text-gray-500">
          {persona.basicInfo.occupation} · {persona.basicInfo.age}歳
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} isGenerating={isGenerating} />
      </div>

      <div className="border-t">
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={isGenerating}
        />
      </div>
    </div>
  );
}

// デモ用の応答生成関数
function generateDemoResponse(userMessage: string, persona: Persona): string {
  const lowerMessage = userMessage.toLowerCase();
  
  // 簡単なキーワードベースの応答
  if (lowerMessage.includes('こんにちは') || lowerMessage.includes('はじめまして')) {
    return `はじめまして！私は${persona.name}と申します。${persona.basicInfo.occupation}として働いています。${persona.personality.speakingStyle}でお話しさせていただきますね。`;
  }
  
  if (lowerMessage.includes('仕事') || lowerMessage.includes('職業')) {
    return `私の仕事は${persona.basicInfo.occupation}です。${persona.basicInfo.background} ${persona.knowledge.expertise ? `特に${persona.knowledge.expertise.split(',')[0]}に詳しいです。` : ''}`;
  }
  
  if (lowerMessage.includes('趣味') || lowerMessage.includes('好き')) {
    const expertise = persona.knowledge.expertise.split(',');
    return `私は${expertise.length > 0 ? expertise.join('や') : '様々なこと'}に興味があります。${persona.personality.traits ? `${persona.personality.traits.split(',')[0]}な性格なので、新しいことを学ぶのが好きです。` : ''}`;
  }
  
  if (lowerMessage.includes('どう思う') || lowerMessage.includes('意見')) {
    return `${persona.values.beliefs ? `私の信念として${persona.values.beliefs.split(',')[0]}と考えています。` : ''}そのため、あなたのご質問について真剣に考えさせていただきます。`;
  }
  
  // デフォルトの応答
  return `${persona.personality.tone || '丁寧に'}お答えします。${userMessage}について、${persona.basicInfo.occupation}の立場から考えてみますね。興味深いお話ですね！`;
}

// メモ化でパフォーマンス最適化
// persona.idが変わらない限り再レンダリングを防ぐ
export default memo(ChatInterface, (prevProps, nextProps) => {
  return prevProps.persona.id === nextProps.persona.id;
});
