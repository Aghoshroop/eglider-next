"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  productContext: {
    id: string;
    name: string;
    image: string;
  } | null;
  setProductContext: (context: { id: string; name: string; image: string } | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [productContext, setProductContext] = useState<{ id: string; name: string; image: string } | null>(null);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <ChatContext.Provider value={{ isChatOpen, openChat, closeChat, productContext, setProductContext }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
