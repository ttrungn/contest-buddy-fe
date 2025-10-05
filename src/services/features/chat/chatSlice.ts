import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ChatService } from "./chatService";
import {
  ChatState,
  ChatConversation,
  ChatMessage,
  CreateDirectConversationRequest,
  SendMessageRequest,
  MarkAsReadRequest,
  WebSocketMessage,
} from "../../../interfaces/IChat";

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  isConnected: false,
  typingUsers: {},
  onlineUsers: [],
};

// Async thunks
export const createDirectConversation = createAsyncThunk(
  "chat/createDirectConversation",
  async (request: CreateDirectConversationRequest, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const chatService = new ChatService(token);
      const response = await chatService.createDirectConversation(
        request.peerId,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const chatService = new ChatService(token);
      const response = await chatService.getConversations();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchConversation = createAsyncThunk(
  "chat/fetchConversation",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const chatService = new ChatService(token);
      const response = await chatService.getConversation(conversationId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (
    {
      conversationId,
      limit = 50,
      before = null,
    }: {
      conversationId: string;
      limit?: number;
      before?: string | null;
    },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const chatService = new ChatService(token);
      const response = await chatService.getMessages(
        conversationId,
        limit,
        before,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    {
      conversationId,
      content,
      messageType = "text",
    }: {
      conversationId: string;
      content: string;
      messageType?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const chatService = new ChatService(token);
      const response = await chatService.sendMessage(
        conversationId,
        content,
        messageType,
      );

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const markAsRead = createAsyncThunk(
  "chat/markAsRead",
  async (
    {
      conversationId,
      messageId,
    }: { conversationId: string; messageId: string },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      const chatService = new ChatService(token);
      const response = await chatService.markAsRead(conversationId, messageId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentConversation: (
      state,
      action: PayloadAction<ChatConversation | null>,
    ) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const message = action.payload;

      // Add validation for message properties
      if (
        !message ||
        !message.id ||
        !message.content ||
        !message.conversation_id ||
        !message.sender_id
      ) {
        return; // Do not add invalid message to state
      }

      const existingIndex = state.messages.findIndex(
        (m) => m.id === message.id,
      );

      if (existingIndex === -1) {
        state.messages.push(message);
      } else {
        state.messages[existingIndex] = message;
      }
    },
    updateMessage: (state, action: PayloadAction<ChatMessage>) => {
      const message = action.payload;
      const index = state.messages.findIndex((m) => m.id === message.id);
      if (index !== -1) {
        state.messages[index] = message;
      }
    },
    updateConversation: (state, action: PayloadAction<ChatConversation>) => {
      const conversation = action.payload;
      const index = state.conversations.findIndex(
        (c) => c.id === conversation.id,
      );
      if (index !== -1) {
        state.conversations[index] = conversation;
      } else {
        state.conversations.push(conversation);
      }
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setTypingUser: (
      state,
      action: PayloadAction<{
        conversationId: string;
        userId: string;
        isTyping: boolean;
      }>,
    ) => {
      const { conversationId, userId, isTyping } = action.payload;

      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }

      if (isTyping) {
        if (!state.typingUsers[conversationId].includes(userId)) {
          state.typingUsers[conversationId].push(userId);
        }
      } else {
        state.typingUsers[conversationId] = state.typingUsers[
          conversationId
        ].filter((id) => id !== userId);
      }
    },
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action: PayloadAction<string>) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload,
      );
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    resetChatState: (state) => {
      return initialState;
    },
    // Message status updates
    setMessageStatus: (
      state,
      action: PayloadAction<{
        messageId: string;
        status: "sending" | "sent" | "delivered" | "read";
        timestamp?: string;
      }>,
    ) => {
      const { messageId, status, timestamp } = action.payload;
      const message = state.messages.find((m) => m.id === messageId);
      if (message) {
        // Add status to message metadata
        if (!message.metadata) {
          message.metadata = {};
        }
        message.metadata.status = status;
        if (timestamp) {
          message.metadata[`${status}_at`] = timestamp;
        }
      }
    },
    markMessageAsRead: (
      state,
      action: PayloadAction<{
        messageId: string;
        userId: string;
        readAt: string;
      }>,
    ) => {
      const { messageId, userId, readAt } = action.payload;
      const message = state.messages.find((m) => m.id === messageId);
      if (message) {
        // Mark the specific message as read
        if (!message.readBy) {
          message.readBy = [];
        }
        if (!message.readBy.includes(userId)) {
          message.readBy.push(userId);
        }
        if (!message.metadata) {
          message.metadata = {};
        }
        message.metadata.read_at = readAt;
        message.metadata.status = "read";

        // Mark all older messages in the same conversation as read
        const conversationId = message.conversation_id;
        const messageCreatedAt = new Date(message.created_at);

        state.messages.forEach((msg) => {
          if (
            msg.conversation_id === conversationId &&
            msg.sender_id !== userId && // Don't mark own messages
            new Date(msg.created_at) < messageCreatedAt
          ) {
            if (!msg.readBy) {
              msg.readBy = [];
            }
            if (!msg.readBy.includes(userId)) {
              msg.readBy.push(userId);
            }
            if (!msg.metadata) {
              msg.metadata = {};
            }
            msg.metadata.status = "read";
            msg.metadata.read_at = readAt;
          }
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Direct Conversation
      .addCase(createDirectConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDirectConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        const conversation = action.payload;
        const existingIndex = state.conversations.findIndex(
          (c) => c.id === conversation.id,
        );
        if (existingIndex === -1) {
          state.conversations.unshift(conversation);
        } else {
          state.conversations[existingIndex] = conversation;
        }
      })
      .addCase(createDirectConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Conversation
      .addCase(fetchConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentConversation = action.payload;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const response = action.payload;

        // Check if response has the correct structure
        if (!response || (!response.message && !response.data?.message)) {
          return;
        }

        // Extract message from correct location
        const message = response.message || response.data?.message;

        if (
          !message.id ||
          !message.content ||
          !message.conversation_id ||
          !message.sender_id
        ) {
          return;
        }

        const existingIndex = state.messages.findIndex(
          (m) => m.id === message.id,
        );
        if (existingIndex === -1) {
          state.messages.push(message);
        } else {
          state.messages[existingIndex] = message;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Mark as Read
      .addCase(markAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update conversation unread count
        const { conversation_id } = action.payload;
        const conversation = state.conversations.find(
          (c) => c.id === conversation_id,
        );
        if (conversation) {
          conversation.unread_count = 0;
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentConversation,
  addMessage,
  updateMessage,
  updateConversation,
  setConnectionStatus,
  setTypingUser,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  clearMessages,
  clearError,
  resetChatState,
  setMessageStatus,
  markMessageAsRead,
} = chatSlice.actions;

export default chatSlice.reducer;
