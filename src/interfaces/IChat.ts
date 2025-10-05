// Chat API Interfaces based on the backend guide

export interface ChatConversation {
  id: string;
  user1_id: string;
  user2_id: string;
  type: "direct" | "group";
  last_activity: string;
  peer?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  last_message?: {
    id: string;
    content: string;
    message_type: string;
    created_at: string;
    sender_id: string;
  };
  unread_count: number;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: "text" | "image" | "file" | "system";
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  readBy?: string[]; // Array of user IDs who have read this message
  metadata?: {
    status?: "sending" | "sent" | "delivered" | "read";
    sent_at?: string;
    delivered_at?: string;
    read_at?: string;
  };
}

export interface ChatReadStatus {
  conversation_id: string;
  user_id: string;
  last_read_message_id: string;
  read_at: string;
}

// API Request Interfaces
export interface CreateDirectConversationRequest {
  peerId: string;
}

export interface SendMessageRequest {
  content: string;
  messageType: "text" | "image" | "file" | "system";
}

export interface MarkAsReadRequest {
  messageId: string;
}

// API Response Interfaces
export interface CreateDirectConversationResponse {
  success: boolean;
  data: ChatConversation;
}

export interface GetConversationsResponse {
  success: boolean;
  data: ChatConversation[];
}

export interface GetConversationResponse {
  success: boolean;
  data: ChatConversation;
}

export interface GetMessagesResponse {
  success: boolean;
  data: ChatMessage[];
}

export interface SendMessageResponse {
  success: boolean;
  message?: ChatMessage;
  conversation?: ChatConversation;
  data?: {
    message: ChatMessage;
    conversation: ChatConversation;
  };
}

export interface MarkAsReadResponse {
  success: boolean;
  data: ChatReadStatus;
}

// WebSocket Message Types
export interface WebSocketMessage {
  type:
    | "new_message"
    | "message_read"
    | "typing"
    | "user_online"
    | "user_offline";
  conversationId: string;
  data: any;
}

export interface NewMessageWebSocket {
  type: "new_message";
  conversationId: string;
  data: ChatMessage;
}

export interface MessageReadWebSocket {
  type: "message_read";
  conversationId: string;
  data: {
    messageId: string;
    userId: string;
    readAt: string;
  };
}

export interface TypingWebSocket {
  type: "typing";
  conversationId: string;
  data: {
    userId: string;
    isTyping: boolean;
  };
}

export interface UserStatusWebSocket {
  type: "user_online" | "user_offline";
  conversationId: string;
  data: {
    userId: string;
    status: "online" | "offline";
    lastSeen?: string;
  };
}

// Chat State Interface
export interface ChatState {
  conversations: ChatConversation[];
  currentConversation: ChatConversation | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  typingUsers: Record<string, string[]>; // conversationId -> userIds
  onlineUsers: string[];
}

// Chat Service Interface
export interface ChatServiceInterface {
  createDirectConversation(
    peerId: string,
  ): Promise<CreateDirectConversationResponse>;
  getConversations(): Promise<GetConversationsResponse>;
  getConversation(conversationId: string): Promise<GetConversationResponse>;
  getMessages(
    conversationId: string,
    limit?: number,
    before?: string,
  ): Promise<GetMessagesResponse>;
  sendMessage(
    conversationId: string,
    content: string,
    messageType?: string,
  ): Promise<SendMessageResponse>;
  markAsRead(
    conversationId: string,
    messageId: string,
  ): Promise<MarkAsReadResponse>;
}

// WebSocket Service Interface
export interface WebSocketServiceInterface {
  connect(token: string): void;
  disconnect(): void;
  sendMessage(conversationId: string, content: string): void;
  markAsRead(conversationId: string, messageId: string): void;
  sendTyping(conversationId: string, isTyping: boolean): void;
  on(event: string, callback: (data: any) => void): void;
  off(event: string, callback: (data: any) => void): void;
}
