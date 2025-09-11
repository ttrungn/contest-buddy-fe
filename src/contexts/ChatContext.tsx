import { createContext, useContext, useState, ReactNode } from "react";
import { ChatConversation } from "@/types";
import { mockChatConversations, mockChatMessages } from "@/lib/mockData";

interface ChatContextType {
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  selectedConversation: ChatConversation | null;
  setSelectedConversation: (conversation: ChatConversation | null) => void;
  isInIndividualChat: boolean;
  setIsInIndividualChat: (inChat: boolean) => void;
  openChatWithUser: (userId: string, userName: string) => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [isInIndividualChat, setIsInIndividualChat] = useState(false);

  const openChatWithUser = (userId: string, userName: string) => {
    // Find existing conversation with this user
    let conversation = mockChatConversations.find(conv => 
      !conv.isGroup && conv.participantDetails.some(p => p.id === userId)
    );

    // If no existing conversation, create a new one
    if (!conversation) {
      conversation = {
        id: `conv_${userId}_${Date.now()}`,
        participants: ["1", userId],
        isGroup: false,
        participantDetails: [
          {
            id: "1", // current user
            fullName: "Nguyễn Văn A",
            username: "nguyenvana",
            avatar: "/api/placeholder/150/150",
            isOnline: true,
            lastSeen: new Date(),
          },
          {
            id: userId,
            fullName: userName,
            username: userName.toLowerCase().replace(/\s+/g, ''),
            avatar: "/api/placeholder/150/150",
            isOnline: false,
            lastSeen: new Date(),
          }
        ],
        lastMessage: null,
        lastActivity: new Date(),
        unreadCount: 0,
        type: "direct",
      };
    }

    setSelectedConversation(conversation);
    setIsInIndividualChat(true);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedConversation(null);
    setIsInIndividualChat(false);
  };

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        setIsChatOpen,
        selectedConversation,
        setSelectedConversation,
        isInIndividualChat,
        setIsInIndividualChat,
        openChatWithUser,
        closeChat,
      }}
    >
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