import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { ChatConversation as IChatConversation } from "@/interfaces/IChat";
import { mockChatConversations, mockChatMessages } from "@/lib/mockData";
import {
  fetchConversations,
  createDirectConversation,
  setCurrentConversation,
  addMessage,
  updateConversation,
  setConnectionStatus,
  setTypingUser,
  addOnlineUser,
  removeOnlineUser,
  setMessageStatus,
  markMessageAsRead,
  sendMessage as sendMessageAction,
  fetchMessages,
} from "@/services/features/chat/chatSlice";
import { chatSocketService } from "@/services/features/chat/chatSocketService";

interface ChatContextType {
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isInIndividualChat: boolean;
  setIsInIndividualChat: (inChat: boolean) => void;
  openChatWithUser: (userId: string, userName: string) => void;
  closeChat: () => void;
  // New methods for real-time chat
  sendMessage: (conversationId: string, content: string) => Promise<any>;
  markAsRead: (conversationId: string, messageId: string) => Promise<void>;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  loadMessages: (conversationId: string) => Promise<void>;
  isConnected: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken } = useAppSelector((state) => state.auth);

  const {
    conversations,
    currentConversation,
    isConnected,
    typingUsers,
    onlineUsers
  } = useAppSelector((state) => state.chat);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInIndividualChat, setIsInIndividualChat] = useState(false);
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Initialize Socket.IO connection
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      chatSocketService.connect(accessToken);

      // Set up Socket.IO event listeners
      chatSocketService.on("connected", () => {
        dispatch(setConnectionStatus(true));
      });

      chatSocketService.on("disconnected", () => {
        dispatch(setConnectionStatus(false));
      });

      chatSocketService.on("chat:authenticated", (data) => {
        dispatch(setConnectionStatus(true));
      });

      chatSocketService.on("message:received", (data) => {
        if (data.message && data.message.id && data.message.content) {
          dispatch(addMessage(data.message));
          if (data.conversation) {
            dispatch(updateConversation(data.conversation));
          }
          // Refresh conversations list to show updated last message
          dispatch(fetchConversations());
        }
      });

      chatSocketService.on("message:read", (data) => {
        if (data.messageId && data.userId) {
          dispatch(markMessageAsRead({
            messageId: data.messageId,
            userId: data.userId,
            readAt: data.readAt || new Date().toISOString()
          }));
        }
      });

      chatSocketService.on("typing", (data) => {
        dispatch(setTypingUser({
          conversationId: data.conversationId,
          userId: data.userId,
          isTyping: data.isTyping
        }));
      });

      chatSocketService.on("error", (error) => {
        dispatch(setConnectionStatus(false));
      });
    }

    return () => {
      if (isAuthenticated) {
        chatSocketService.disconnect();
      }
    };
  }, [isAuthenticated, accessToken, dispatch]);

  // Load conversations on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchConversations());
    }
  }, [isAuthenticated, dispatch]);

  // Refresh conversations when chat is opened
  useEffect(() => {
    if (isAuthenticated && isChatOpen) {
      dispatch(fetchConversations());
    }
  }, [isAuthenticated, isChatOpen, dispatch]);

  // Auto-refresh messages every 5 seconds as fallback
  useEffect(() => {
    if (!isAuthenticated || !currentConversation) return;

    const interval = setInterval(() => {
      if (currentConversation) {
        dispatch(fetchMessages({
          conversationId: currentConversation.id,
          limit: 50,
          before: null
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, currentConversation, dispatch]);

  const openChatWithUser = async (userId: string, userName: string) => {
    try {
      // Try to create or get existing conversation
      const result = await dispatch(createDirectConversation({ peerId: userId }));

      if (createDirectConversation.fulfilled.match(result)) {
        const conversation = result.payload;
        // Use the conversation directly from API
        const uiConversation: IChatConversation = conversation;

        dispatch(setCurrentConversation(conversation));
        setIsInIndividualChat(true);
        setIsChatOpen(true);
      }
    } catch (error) {
      console.error("Failed to open chat with user:", error);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setIsInIndividualChat(false);
    dispatch(setCurrentConversation(null));
  };

  const sendMessage = async (conversationId: string, content: string) => {
    try {
      const result = await dispatch(sendMessageAction({
        conversationId,
        content,
        messageType: "text"
      }));

      if (sendMessageAction.fulfilled.match(result)) {
        const response = result.payload;
        const message = response.message || response.data?.message;

        dispatch(addMessage(message));
        dispatch(setMessageStatus({
          messageId: message.id,
          status: 'sent',
          timestamp: new Date().toISOString()
        }));

        return message;
      } else {
        throw new Error("Failed to send message via API");
      }
    } catch (error) {
      throw error;
    }
  };

  const markAsRead = async (conversationId: string, messageId: string) => {
    if (chatSocketService.getIsConnected()) {
      await chatSocketService.markAsRead(conversationId, messageId);
    }
  };

  const startTyping = (conversationId: string) => {
    if (chatSocketService.getIsConnected()) {
      chatSocketService.sendTyping(conversationId, true);

      // Clear existing timeout
      if (typingTimeoutRef.current[conversationId]) {
        clearTimeout(typingTimeoutRef.current[conversationId]);
      }

      // Set timeout to stop typing after 3 seconds
      typingTimeoutRef.current[conversationId] = setTimeout(() => {
        stopTyping(conversationId);
      }, 3000);
    }
  };

  const stopTyping = (conversationId: string) => {
    if (chatSocketService.getIsConnected()) {
      chatSocketService.sendTyping(conversationId, false);

      if (typingTimeoutRef.current[conversationId]) {
        clearTimeout(typingTimeoutRef.current[conversationId]);
        delete typingTimeoutRef.current[conversationId];
      }
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      await dispatch(fetchMessages({
        conversationId,
        limit: 50,
        before: null
      }));
    } catch (error) {
      // Handle error silently
    }
  };

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        setIsChatOpen,
        isInIndividualChat,
        setIsInIndividualChat,
        openChatWithUser,
        closeChat,
        sendMessage,
        markAsRead,
        startTyping,
        stopTyping,
        loadMessages,
        isConnected,
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