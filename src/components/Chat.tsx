import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Search,
  MoreVertical,
  Smile,
  Paperclip,
  X,
  Minimize2,
  Users,
  Circle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { mockChatConversations, mockChatMessages } from "@/lib/mockData";
import { ChatConversation, ChatMessage } from "@/types";
import { cn } from "@/lib/utils";
import { useChat } from "@/contexts/ChatContext";

interface ChatProps {}

export default function Chat({}: ChatProps) {
  const {
    isChatOpen,
    setIsChatOpen,
    selectedConversation,
    setSelectedConversation,
    isInIndividualChat,
    setIsInIndividualChat
  } = useChat();

  const [conversations] = useState(mockChatConversations);
  const [messages, setMessages] = useState(mockChatMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = "1"; // Mock current user

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participantDetails.some(
        (p) =>
          p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.username.toLowerCase().includes(searchQuery.toLowerCase()),
      ) || conv.groupName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const conversationMessages = selectedConversation
    ? messages.filter((msg) => msg.conversationId === selectedConversation.id)
    : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      content: newMessage,
      messageType: "text",
      createdAt: new Date(),
      readBy: [currentUserId],
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const formatMessageTime = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours}h trước`;
    if (diffInHours < 48) return "Hôm qua";
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  };

  const getOtherParticipant = (conversation: ChatConversation) => {
    if (conversation.isGroup) return null;
    return conversation.participantDetails.find((p) => p.id !== currentUserId);
  };

  const handleBackToGeneralChat = () => {
    setSelectedConversation(null);
    setIsInIndividualChat(false);
  };

  const handleSelectConversation = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    setIsInIndividualChat(true);
  };

  const onToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  if (!isChatOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggle}
          className="h-14 w-14 rounded-full shadow-lg relative"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
          {conversations.some((c) => c.unreadCount > 0) && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
              {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] bg-background border rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          {isInIndividualChat && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToGeneralChat}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <MessageSquare className="h-5 w-5" />
          <span className="font-semibold">
            {isInIndividualChat
              ? selectedConversation?.isGroup
                ? selectedConversation.groupName
                : getOtherParticipant(selectedConversation!)?.fullName
              : "Tin nhắn"}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm">
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List - Show only when not in individual chat */}
        {!isInIndividualChat && (
          <div className="w-full flex flex-col">
            {/* Search */}
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </div>

            {/* Conversations */}
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {filteredConversations.map((conversation) => {
                  const otherParticipant = getOtherParticipant(conversation);
                  const displayName = conversation.isGroup
                    ? conversation.groupName
                    : otherParticipant?.fullName;
                  const displayAvatar = conversation.isGroup
                    ? conversation.groupAvatar
                    : otherParticipant?.avatar;

                  return (
                    <div
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className={cn(
                        "flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-accent transition-colors",
                        selectedConversation?.id === conversation.id &&
                          "bg-accent",
                      )}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={displayAvatar} alt={displayName} />
                          <AvatarFallback className="text-sm">
                            {conversation.isGroup ? (
                              <Users className="h-5 w-5" />
                            ) : (
                              displayName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                            )}
                          </AvatarFallback>
                        </Avatar>
                        {!conversation.isGroup && otherParticipant?.isOnline && (
                          <Circle className="absolute bottom-0 right-0 h-3 w-3 text-green-500 fill-current" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">
                            {displayName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatLastActivity(conversation.lastActivity)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage?.content ||
                              "Chưa có tin nhắn"}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Individual Chat Area - Show only when in individual chat */}
        {isInIndividualChat && selectedConversation && (
          <div className="w-full flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {conversationMessages.map((message) => {
                  const isOwn = message.senderId === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        isOwn ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg p-3",
                          isOwn
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted",
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div
                          className={cn(
                            "text-xs mt-1",
                            isOwn
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground",
                          )}
                        >
                          {formatMessageTime(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-3 border-t">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 flex items-center space-x-2">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
