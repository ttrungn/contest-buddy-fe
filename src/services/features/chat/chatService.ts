import {
  CHAT_CONVERSATIONS_ENDPOINT,
  CHAT_CONVERSATIONS_DIRECT_ENDPOINT,
  CHAT_CONVERSATION_ENDPOINT,
  CHAT_MESSAGES_ENDPOINT,
  CHAT_MARK_READ_ENDPOINT,
} from "../../constant/apiConfig";
import {
  ChatServiceInterface,
  CreateDirectConversationRequest,
  CreateDirectConversationResponse,
  GetConversationsResponse,
  GetConversationResponse,
  GetMessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
  MarkAsReadRequest,
  MarkAsReadResponse,
} from "../../../interfaces/IChat";

export class ChatService implements ChatServiceInterface {
  private baseURL: string;
  private token: string;

  constructor(token: string) {
    this.token = token;
    this.baseURL = "http://localhost:8080";
  }

  // Helper method để gọi API
  private async apiCall(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  }

  // 1. Tạo cuộc trò chuyện trực tiếp
  async createDirectConversation(
    peerId: string,
  ): Promise<CreateDirectConversationResponse> {
    return await this.apiCall(CHAT_CONVERSATIONS_DIRECT_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ peerId }),
    });
  }

  // 2. Lấy danh sách cuộc trò chuyện
  async getConversations(): Promise<GetConversationsResponse> {
    return await this.apiCall(CHAT_CONVERSATIONS_ENDPOINT);
  }

  // 3. Lấy thông tin cuộc trò chuyện
  async getConversation(
    conversationId: string,
  ): Promise<GetConversationResponse> {
    return await this.apiCall(CHAT_CONVERSATION_ENDPOINT(conversationId));
  }

  // 4. Lấy tin nhắn
  async getMessages(
    conversationId: string,
    limit: number = 50,
    before: string | null = null,
  ): Promise<GetMessagesResponse> {
    let url = `${CHAT_MESSAGES_ENDPOINT(conversationId)}?limit=${limit}`;
    if (before) {
      url += `&before=${before}`;
    }
    return await this.apiCall(url);
  }

  // 5. Gửi tin nhắn
  async sendMessage(
    conversationId: string,
    content: string,
    messageType: string = "text",
  ): Promise<SendMessageResponse> {
    return await this.apiCall(CHAT_MESSAGES_ENDPOINT(conversationId), {
      method: "POST",
      body: JSON.stringify({ content, messageType }),
    });
  }

  // 6. Đánh dấu đã đọc
  async markAsRead(
    conversationId: string,
    messageId: string,
  ): Promise<MarkAsReadResponse> {
    return await this.apiCall(CHAT_MARK_READ_ENDPOINT(conversationId), {
      method: "POST",
      body: JSON.stringify({ messageId }),
    });
  }
}
