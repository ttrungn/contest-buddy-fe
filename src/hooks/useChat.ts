import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import {
  fetchConversations,
  createDirectConversation,
  fetchMessages,
  sendMessage as sendMessageAction,
  markAsRead as markAsReadAction,
  setCurrentConversation,
  addMessage,
  updateConversation,
  setConnectionStatus,
  setTypingUser,
  addOnlineUser,
  removeOnlineUser,
} from "@/services/features/chat/chatSlice";
import { ChatWebSocket } from "@/services/features/chat/chatWebSocket";
import { ChatConversation, ChatMessage } from "@/interfaces/IChat";

export const useChat = () => {
  const dispatch = useAppDispatch();
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    isConnected,
    typingUsers,
    onlineUsers,
  } = useAppSelector((state) => state.chat);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      await dispatch(fetchConversations());
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  }, [dispatch]);

  // Create or get direct conversation
  const createConversation = useCallback(
    async (peerId: string) => {
      try {
        const result = await dispatch(createDirectConversation({ peerId }));
        if (createDirectConversation.fulfilled.match(result)) {
          return result.payload;
        }
        throw new Error("Failed to create conversation");
      } catch (error) {
        console.error("Failed to create conversation:", error);
        throw error;
      }
    },
    [dispatch],
  );

  // Load messages for a conversation
  const loadMessages = useCallback(
    async (
      conversationId: string,
      limit: number = 50,
      before: string | null = null,
    ) => {
      try {
        await dispatch(fetchMessages({ conversationId, limit, before }));
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    },
    [dispatch],
  );

  // Send message
  const sendMessage = useCallback(
    async (
      conversationId: string,
      content: string,
      messageType: string = "text",
    ) => {
      try {
        const result = await dispatch(
          sendMessageAction({
            conversationId,
            content,
            messageType,
          }),
        );
        if (sendMessageAction.fulfilled.match(result)) {
          return result.payload;
        }
        throw new Error("Failed to send message");
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      }
    },
    [dispatch],
  );

  // Mark message as read
  const markAsRead = useCallback(
    async (conversationId: string, messageId: string) => {
      try {
        await dispatch(markAsReadAction({ conversationId, messageId }));
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    },
    [dispatch],
  );

  // Set current conversation
  const setCurrentConversationId = useCallback(
    (conversation: ChatConversation | null) => {
      dispatch(setCurrentConversation(conversation));
    },
    [dispatch],
  );

  // Add message to state (for real-time updates)
  const addMessageToState = useCallback(
    (message: ChatMessage) => {
      dispatch(addMessage(message));
    },
    [dispatch],
  );

  // Update conversation (for real-time updates)
  const updateConversationState = useCallback(
    (conversation: ChatConversation) => {
      dispatch(updateConversation(conversation));
    },
    [dispatch],
  );

  // Set connection status
  const setConnectionStatusState = useCallback(
    (connected: boolean) => {
      dispatch(setConnectionStatus(connected));
    },
    [dispatch],
  );

  // Set typing user
  const setTypingUserState = useCallback(
    (conversationId: string, userId: string, isTyping: boolean) => {
      dispatch(setTypingUser({ conversationId, userId, isTyping }));
    },
    [dispatch],
  );

  // Add online user
  const addOnlineUserState = useCallback(
    (userId: string) => {
      dispatch(addOnlineUser(userId));
    },
    [dispatch],
  );

  // Remove online user
  const removeOnlineUserState = useCallback(
    (userId: string) => {
      dispatch(removeOnlineUser(userId));
    },
    [dispatch],
  );

  return {
    // State
    conversations,

    currentConversation,
    messages,
    isLoading,
    error,
    isConnected,
    typingUsers,
    onlineUsers,

    // Actions
    loadConversations,
    createConversation,
    loadMessages,
    sendMessage,
    markAsRead,
    setCurrentConversationId,
    addMessageToState,
    updateConversationState,
    setConnectionStatusState,
    setTypingUserState,
    addOnlineUserState,
    removeOnlineUserState,
  };
};
