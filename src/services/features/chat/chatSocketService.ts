import { io, Socket } from "socket.io-client";
import { ChatConversation, ChatMessage } from "@/interfaces/IChat";

export interface ChatSocketEvents {
  "chat:connected": (data: { userId: string }) => void;
  "chat:new-message": (data: {
    conversationId: string;
    message: ChatMessage;
    conversation: ChatConversation;
  }) => void;
  "chat:read-receipt": (data: {
    conversationId: string;
    userId: string;
    messageId: string;
    conversation: ChatConversation;
  }) => void;
  "chat:typing": (data: {
    conversationId: string;
    userId: string;
    isTyping: boolean;
  }) => void;
  "chat:error": (error: { message: string }) => void;
}

export class ChatSocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private isConnected = false;
  private eventHandlers: Map<string, ((data: any) => void)[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  constructor() {
    this.setupEventListeners();
  }

  // Kết nối socket với authentication
  connect(token: string): void {
    if (this.socket && this.isConnected) {
      return;
    }

    this.token = token;
    this.socket = io(
      import.meta.env.VITE_API_URL ||
        "https://contest-buddy-be-594444870778.asia-southeast1.run.app",
      {
        auth: {
          token: token,
        },
        transports: ["websocket", "polling"],
        timeout: 20000,
      },
    );

    this.setupSocketEventListeners();
  }

  private setupEventListeners(): void {
    // Auto-reconnect logic
    setInterval(() => {
      if (
        !this.isConnected &&
        this.token &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.reconnectAttempts++;
        this.connect(this.token);
      }
    }, this.reconnectDelay);
  }

  private setupSocketEventListeners(): void {
    if (!this.socket) return;

    // Log all events for debugging
    this.socket.onAny((eventName, ...args) => {
      // Log all events for debugging
    });

    this.socket.on("connect", () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit("connected", {});
    });

    this.socket.on("disconnect", (reason) => {
      this.isConnected = false;
      this.emit("disconnected", { reason });
    });

    this.socket.on("connect_error", (error) => {
      this.isConnected = false;
      this.emit("error", { message: error.message });
    });

    this.socket.on("chat:connected", (data) => {
      this.emit("chat:authenticated", data);
    });

    this.socket.on("chat:new-message", (data) => {
      this.emit("message:received", data);
    });

    this.socket.on("chat:read-receipt", (data) => {
      this.emit("message:read", data);
    });

    this.socket.on("chat:typing", (data) => {
      this.emit("typing", data);
    });

    this.socket.on("chat:error", (error) => {
      this.emit("error", error);
    });
  }

  // Generic event emitter
  on(event: string, handler: (data: any) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  off(event: string, handler: (data: any) => void): void {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event)!;
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event)!.forEach((handler) => handler(data));
    }
  }

  // Socket.IO specific methods
  joinConversation(conversationId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit(
        "chat:join-conversation",
        { conversationId },
        (response: any) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.message));
          }
        },
      );
    });
  }

  leaveConversation(conversationId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit("chat:leave-conversation", { conversationId });
    }
  }

  sendMessage(
    conversationId: string,
    content: string,
    messageType: string = "text",
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit(
        "chat:send-message",
        {
          conversationId,
          content,
          messageType,
        },
        (response: any) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.message));
          }
        },
      );
    });
  }

  markAsRead(conversationId: string, messageId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit(
        "chat:mark-read",
        {
          conversationId,
          messageId,
        },
        (response: any) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.message));
          }
        },
      );
    });
  }

  sendTyping(conversationId: string, isTyping: boolean): void {
    if (this.socket && this.isConnected) {
      this.socket.emit("chat:typing", {
        conversationId,
        isTyping,
      });
    }
  }

  // Disconnect
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.token = null;
    }
  }

  // Getters
  getSocket(): Socket | null {
    return this.socket;
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const chatSocketService = new ChatSocketService();
