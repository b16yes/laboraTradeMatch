import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConversationSummary, ChatMessage } from '../types/models';
import { FirestoreService, mockConversations } from '../services/firebase/firestoreService';

interface ChatContextType {
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  activeMessages: ChatMessage[];
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (text: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
  conversations: [],
  activeConversationId: null,
  activeMessages: [],
  setActiveConversationId: () => {},
  sendMessage: async () => {},
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<ConversationSummary[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-1');
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (activeConversationId) {
      FirestoreService.getMessages(activeConversationId).then(setActiveMessages);
    } else {
      setActiveMessages([]);
    }
  }, [activeConversationId]);

  const sendMessage = async (text: string) => {
    if (!activeConversationId || !text.trim()) return;

    const conv = conversations.find((c) => c.id === activeConversationId);
    const receiverId = conv?.peerId || 'tradesman-b-202';

    const newMsg = await FirestoreService.sendMessage(activeConversationId, text, receiverId);
    setActiveMessages((prev) => [...prev, newMsg]);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? { ...c, lastMessage: text, lastTimestamp: newMsg.timestamp, unreadCount: 0 }
          : c
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        activeMessages,
        setActiveConversationId,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
