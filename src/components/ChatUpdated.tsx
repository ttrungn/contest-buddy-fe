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
    Check,
    CheckCheck,
    Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useChat } from "@/contexts/ChatContext";
import { useAppSelector, useAppDispatch } from "@/services/store/store";
import { ChatConversation as IChatConversation, ChatMessage } from "@/interfaces/IChat";
import { ChatConversation } from "@/types";
import { setCurrentConversation } from "@/services/features/chat/chatSlice";

interface ChatUpdatedProps { }

export default function ChatUpdated({ }: ChatUpdatedProps) {
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const {
        isChatOpen,
        setIsChatOpen,
        isInIndividualChat,
        setIsInIndividualChat,
        sendMessage,
        markAsRead,
        startTyping,
        stopTyping,
        loadMessages,
        isConnected,
    } = useChat();

    // Get chat state from Redux
    const {
        conversations,
        currentConversation,
        messages,
        isLoading,
        error,
        typingUsers,
        onlineUsers,
    } = useAppSelector((state) => state.chat);

    // Use Redux state instead of local state
    const selectedConversation = currentConversation;

    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSending, setIsSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentUserId = user?.id || "1";

    // Calculate conversation messages
    const conversationMessages = selectedConversation
        ? messages.filter((msg) => msg.conversation_id === selectedConversation.id)
        : [];



    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedConversation]);

    // Auto-load messages when selectedConversation changes
    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.id);
        }
    }, [selectedConversation?.id]);

    // Auto mark messages as read when user opens conversation
    useEffect(() => {
        if (selectedConversation && conversationMessages.length > 0) {
            const lastMessage = conversationMessages[conversationMessages.length - 1];
            if (lastMessage && lastMessage.sender_id !== currentUserId) {
                // Mark as read immediately when user opens conversation
                markAsRead(selectedConversation.id, lastMessage.id);
            }
        }
    }, [selectedConversation?.id, conversationMessages.length, markAsRead]); // Trigger when conversation changes or messages load

    // Load conversations on mount - handled by ChatContext

    // Use real conversations only
    const displayConversations = conversations;

    const filteredConversations = displayConversations.filter((conv) =>
        conv.peer?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.peer?.username.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation || isSending) return;

        setIsSending(true);
        try {
            // Send message via ChatContext (handles both WebSocket and API)
            await sendMessage(selectedConversation.id, newMessage);
            setNewMessage("");
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewMessage(value);

        if (selectedConversation) {
            if (value.trim()) {
                startTyping(selectedConversation.id);
            } else {
                stopTyping(selectedConversation.id);
            }
        }
    };

    const handleSelectConversation = async (conversation: IChatConversation) => {
        // Use Redux action to set current conversation
        dispatch(setCurrentConversation(conversation));
        setIsInIndividualChat(true);

        // Always load messages when selecting conversation
        await loadMessages(conversation.id);

        // Mark all messages as read when entering conversation
        // This will be handled by the useEffect that triggers when selectedConversation changes
    };

    const handleBackToGeneralChat = () => {
        dispatch(setCurrentConversation(null));
        setIsInIndividualChat(false);
    };

    const formatMessageTime = (date: Date | string) => {
        const d = new Date(date);
        return new Intl.DateTimeFormat("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(d);
    };

    const formatLastActivity = (date: Date | string) => {
        const d = new Date(date);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return "Vừa xong";
        if (diffInHours < 24) return `${diffInHours}h trước`;
        if (diffInHours < 48) return "Hôm qua";
        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
        }).format(d);
    };

    const getOtherParticipant = (conversation: IChatConversation) => {
        if (conversation.type === "group") return null;
        return conversation.peer;
    };

    // Message status component
    const MessageStatusIcon = ({ message }: { message: ChatMessage }) => {
        if (message.sender_id !== currentUserId) return null;

        const status = message.metadata?.status || 'sent';

        // Check if any message in this conversation has been read by current user
        // If the latest message is read, then all previous messages are considered read
        const isAnyMessageRead = conversationMessages.some(msg =>
            msg.sender_id !== currentUserId &&
            msg.readBy &&
            msg.readBy.includes(currentUserId)
        );

        // Show as read if this specific message is read OR if any newer message is read
        const isRead = (message.readBy && message.readBy.includes(currentUserId)) || isAnyMessageRead;

        if (status === 'sending') {
            return <Clock className="h-3 w-3 text-muted-foreground" />;
        } else if (status === 'sent') {
            return <Check className="h-3 w-3 text-muted-foreground" />;
        } else if (status === 'delivered') {
            return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
        } else if (status === 'read' || isRead) {
            return <CheckCheck className="h-3 w-3 text-blue-500" />;
        }

        return <Check className="h-3 w-3 text-muted-foreground" />;
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
                    {displayConversations.some((c) => c.unread_count > 0) && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                            {displayConversations.reduce((sum, c) => sum + c.unread_count, 0)}
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
                            ? selectedConversation?.peer?.full_name || "Chat"
                            : "Tin nhắn"}
                    </span>
                    <div className="flex items-center space-x-1">
                        <div className={cn(
                            "w-2 h-2 rounded-full",
                            isConnected ? "bg-green-500" : "bg-red-500"
                        )} />
                        <span className="text-xs text-muted-foreground">
                            {isConnected ? "Đã kết nối" : "Mất kết nối"}
                        </span>
                    </div>
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
                                {isLoading && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        Đang tải cuộc trò chuyện...
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 text-center text-sm text-red-500">
                                        Lỗi: {error}
                                    </div>
                                )}

                                {filteredConversations.length === 0 && !isLoading && !error && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        Chưa có cuộc trò chuyện nào
                                    </div>
                                )}

                                {filteredConversations.map((conversation) => {
                                    const otherParticipant = getOtherParticipant(conversation);
                                    const displayName = conversation.peer?.full_name || "Unknown";
                                    const displayAvatar = conversation.peer?.avatar_url;
                                    const isOnline = onlineUsers.includes(conversation.peer?.id || "");

                                    return (
                                        <div
                                            key={conversation.id}
                                            onClick={() => handleSelectConversation(conversation)}
                                            className={cn(
                                                "flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-accent transition-colors",
                                                selectedConversation?.id === conversation.id && "bg-accent"
                                            )}
                                        >
                                            <div className="relative">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={displayAvatar} alt={displayName} />
                                                    <AvatarFallback className="text-sm">
                                                        {displayName
                                                            ?.split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {isOnline && (
                                                    <Circle className="absolute bottom-0 right-0 h-3 w-3 text-green-500 fill-current" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-sm truncate">
                                                        {displayName}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatLastActivity(conversation.last_activity)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {conversation.last_message?.content || "Chưa có tin nhắn"}
                                                    </p>
                                                    {conversation.unread_count > 0 && (
                                                        <Badge className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                                                            {conversation.unread_count}
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
                                    const isOwn = message.sender_id === currentUserId;
                                    return (
                                        <div
                                            key={message.id}
                                            className={cn("flex", isOwn ? "justify-end" : "justify-start")}
                                        >
                                            <div
                                                className={cn(
                                                    "max-w-[70%] rounded-lg p-3",
                                                    isOwn
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted"
                                                )}
                                            >
                                                <p className="text-sm">{message.content}</p>
                                                <div
                                                    className={cn(
                                                        "text-xs mt-1 flex items-center justify-between",
                                                        isOwn
                                                            ? "text-primary-foreground/70"
                                                            : "text-muted-foreground"
                                                    )}
                                                >
                                                    <span>{formatMessageTime(message.created_at)}</span>
                                                    {isOwn && (
                                                        <div className="flex items-center space-x-1 ml-2">
                                                            <MessageStatusIcon message={message} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Typing indicator */}
                                {typingUsers[selectedConversation.id]?.length > 0 && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted rounded-lg p-3 max-w-[70%]">
                                            <p className="text-sm text-muted-foreground">
                                                {typingUsers[selectedConversation.id].length === 1
                                                    ? "Đang nhập..."
                                                    : `${typingUsers[selectedConversation.id].length} người đang nhập...`}
                                            </p>
                                        </div>
                                    </div>
                                )}

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
                                        onChange={handleTyping}
                                        onKeyPress={(e) => e.key === "Enter" && !isSending && handleSendMessage()}
                                        className="flex-1"
                                    />
                                    <Button variant="ghost" size="sm">
                                        <Smile className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim() || isSending}
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
