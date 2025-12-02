"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Edit, Send, Menu, Settings, HelpCircle, LogOut, Crown, Search, MessageSquare, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChatMessage } from "@/components/chat-message";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SettingsDialog } from "@/components/settings-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js"; // Type import

interface Chat {
  id: string;
  title: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SidebarContent = ({
  isExpanded,
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onSettingsClick,
  onLogoutClick,
  onMenuClick,
}: {
  isExpanded: boolean;
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
  onMenuClick?: () => void;
}) => (
  <div className="flex flex-col h-full bg-[#1e1f20]">
    {/* Top Section */}
    <div className="p-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button variant="ghost" size="icon" className="mb-4" onClick={onMenuClick}>
              <Menu className="w-5 h-5" />
            </Button>
          </span>
        </TooltipTrigger>
        {!isExpanded && <TooltipContent side="right">Open sidebar</TooltipContent>}
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              variant="ghost"
              onClick={onNewChat}
              className={cn("w-full justify-start gap-3 rounded-full h-12 px-3 hover:bg-neutral-700/50")}
            >
              <Edit className="w-5 h-5 flex-shrink-0" />
              <span className={cn("truncate transition-opacity", !isExpanded && "opacity-0")}>New chat</span>
            </Button>
          </span>
        </TooltipTrigger>
        {!isExpanded && <TooltipContent side="right">New Chat</TooltipContent>}
      </Tooltip>
      
      {/* Search Button (Visual Only) */}
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-full h-12 px-3 hover:bg-neutral-700/50"
            >
              <Search className="w-5 h-5 flex-shrink-0" />
              <span className={cn("truncate transition-opacity", !isExpanded && "opacity-0")}>
                Search
              </span>
            </Button>
          </span>
        </TooltipTrigger>
        {!isExpanded && (
          <TooltipContent side="right" className="flex items-center gap-2">
            Search chats
          </TooltipContent>
        )}
      </Tooltip>
    </div>

    {/* Recent Chats (Scrollable) */}
    <div className={cn("flex-1 px-2 space-y-1 mt-4 overflow-y-auto", !isExpanded ? 'opacity-0' : 'opacity-100 transition-opacity duration-300')}>
        <p className="text-sm text-neutral-400 mb-2 px-3 font-medium">Recent</p>
        {chats.map((chat) => (
            <div key={chat.id} className="relative group">
                <Button
                    variant="ghost"
                    onClick={() => onSelectChat(chat.id)}
                    className={cn(
                        "w-full justify-start gap-3 rounded-full h-10 px-3 truncate",
                        currentChatId === chat.id ? "bg-neutral-700/50" : "hover:bg-neutral-700/50"
                    )}
                >
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{chat.title}</span>
                </Button>
                <AlertDialog>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="right">Delete chat</TooltipContent>
                    </Tooltip>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the chat "{chat.title}". This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteChat(chat.id)}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        ))}
    </div>

    {/* Bottom Section */}
    <div className="p-2 mt-auto border-t border-neutral-800 space-y-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-neutral-700/50 rounded-full h-12 px-3"
              onClick={onSettingsClick}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span className={cn("truncate transition-opacity", !isExpanded && "opacity-0")}>Settings</span>
            </Button>
          </span>
        </TooltipTrigger>
        {!isExpanded && <TooltipContent side="right">Settings</TooltipContent>}
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/faq">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-neutral-700/50 rounded-full h-12 px-3"
            >
              <HelpCircle className="w-5 h-5 flex-shrink-0" />
              <span className={cn("truncate transition-opacity", !isExpanded && "opacity-0")}>Help & FAQ</span>
            </Button>
          </Link>
        </TooltipTrigger>
        {!isExpanded && <TooltipContent side="right">Help & FAQ</TooltipContent>}
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-neutral-700/50 rounded-full h-12 px-3"
              onClick={onLogoutClick}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className={cn("truncate transition-opacity", !isExpanded && "opacity-0")}>Logout</span>
            </Button>
          </span>
        </TooltipTrigger>
        {!isExpanded && <TooltipContent side="right">Logout</TooltipContent>}
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/pricing">
            <Button className="w-full justify-start gap-3 bg-lime-500/10 text-lime-400 hover:bg-lime-500/20 rounded-full h-12 px-3 mt-2 border border-lime-500/20">
              <Crown className="w-5 h-5 flex-shrink-0" />
              <span className={cn("truncate transition-opacity", !isExpanded && "opacity-0")}>Upgrade to Pro</span>
            </Button>
          </Link>
        </TooltipTrigger>
        {!isExpanded && <TooltipContent side="right">Upgrade to Pro</TooltipContent>}
      </Tooltip>
    </div>
  </div>
);

export default function ChatUIPage() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [user, setUser] = useState<User | null>(null); // Typed User
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isThinking, setIsThinking] = useState(false); // New Thinking State
    const router = useRouter();
    const supabase = createClient();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages, isThinking]); // Scroll when thinking starts/stops
  
    // Close sidebar on outside click (Desktop)
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
          if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            // Only close if it's open AND we are on a large screen
            // (Standard logic often keeps it open on desktop, but your code had this)
            if (window.innerWidth > 768 && isSidebarOpen) { 
               // setIsSidebarOpen(false); // Optional: Standard behavior is usually sidebar stays fixed on desktop
            }
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [sidebarRef, isSidebarOpen]);
  
    // Fetch User & Chats
    useEffect(() => {
      const fetchInitialData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const { data: userChats, error } = await supabase
            .from('chats')
            .select('id, title')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error("Error fetching chats:", error);
          } else {
            setChats(userChats || []);
          }
        }
      };
      fetchInitialData();
    }, [supabase]);
  
    const handleLogout = async () => {
      await supabase.auth.signOut();
      router.push("/");
    };

    const handleNewChat = () => {
        setMessages([]);
        setCurrentChatId(null);
        // Mobile: close sidebar when starting new chat
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleSelectChat = async (chatId: string) => {
        setCurrentChatId(chatId);
        // Mobile: Close sidebar on selection
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }

        const { data, error } = await supabase
            .from('messages')
            .select('id, role, content')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Error fetching messages:", error);
            setMessages([]);
        } else {
            setMessages(data || []);
        }
    };

    const handleDeleteChat = async (chatId: string) => {
        const { error } = await supabase.from('chats').delete().eq('id', chatId);
        if (error) {
            toast.error("Error deleting chat", { description: error.message });
        } else {
            setChats(prev => prev.filter(chat => chat.id !== chatId));
            if (currentChatId === chatId) {
                setCurrentChatId(null);
                setMessages([]);
            }
            toast.success("Chat deleted successfully.");
        }
    };
  
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user) return;
    
        const userMessageContent = input;
        setInput("");

        const newMessages: Message[] = [
            ...messages,
            { id: Date.now().toString(), role: "user", content: userMessageContent },
        ];
    
        setMessages(newMessages);
        setIsLoading(true);
        setIsThinking(true); // Start Thinking
    
        let chatId = currentChatId;
    
        try {
          if (!chatId) {
            const { data, error } = await supabase
              .from("chats")
              .insert({ user_id: user.id, title: userMessageContent.substring(0, 40) })
              .select()
              .single();
    
            if (error) throw new Error(`Error creating chat: ${error.message}`);
            chatId = data.id;
            setCurrentChatId(chatId);
            setChats(prevChats => [data, ...prevChats]);
          }
    
          const { error: userMessageError } = await supabase.from("messages").insert({
            chat_id: chatId,
            user_id: user.id,
            role: "user",
            content: userMessageContent,
          });
    
          if (userMessageError) throw new Error(`Error saving user message: ${userMessageError.message}`);
    
          const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: newMessages }),
          });
    
          if (!response.ok || !response.body) {
            throw new Error("Failed to get a streaming response from the AI.");
          }
    
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let fullResponse = "";
          
          setIsThinking(false); // Stop thinking once stream starts

          const assistantMessageId = (Date.now() + 1).toString();
          setMessages((prev) => [
            ...prev,
            { id: assistantMessageId, role: "assistant", content: "" },
          ]);
    
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            fullResponse += chunk;
    
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId ? { ...msg, content: fullResponse } : msg
              )
            );
          }
    
          const { error: assistantMessageError } = await supabase.from("messages").insert({
            chat_id: chatId,
            user_id: user.id,
            role: "assistant",
            content: fullResponse,
          });
    
          if (assistantMessageError) {
            console.error("Error saving assistant message:", assistantMessageError.message);
          }
    
        } catch (error) {
          console.error("Error during chat:", error);
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "Sorry, I'm having trouble connecting. Please try again later.",
          };
          setMessages((prev) => [...prev.filter(m => m.id !== (Date.now() + 1).toString()), errorMessage]);
        } finally {
          setIsLoading(false);
          setIsThinking(false);
        }
      };
  
    return (
        <>
        <TooltipProvider delayDuration={0}>
          <div className="h-screen bg-[#131314] text-white overflow-hidden relative">
            
            {/* Desktop Sidebar */}
            <div
              ref={sidebarRef}
              className={cn(
                "fixed top-0 left-0 h-full flex-col z-20 hidden md:flex",
                "transition-[width] duration-200 ease-out",
                isSidebarOpen ? "w-64" : "w-20"
              )}
            >
              <SidebarContent 
                isExpanded={isSidebarOpen}
                chats={chats}
                currentChatId={currentChatId}
                onSelectChat={handleSelectChat}
                onNewChat={handleNewChat}
                onDeleteChat={handleDeleteChat}
                onSettingsClick={() => setIsSettingsOpen(true)}
                onLogoutClick={handleLogout}
                onMenuClick={() => setIsSidebarOpen(prev => !prev)}
              />
            </div>
  
            <div
              className={cn(
                "h-full flex flex-col",
                "transition-[padding-left] duration-200 ease-out",
                isSidebarOpen ? "md:pl-64" : "md-pl-20"
              )}
            >
              <div className="p-2 flex items-center border-b border-neutral-800 md:hidden">
                  <Sheet open={!isSidebarOpen} onOpenChange={(open) => setIsSidebarOpen(!open)}>
                      <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                          <Menu className="w-5 h-5" />
                      </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="p-0 w-64 bg-transparent border-r-0 text-white">
                          <SidebarContent 
                            isExpanded={true}
                            chats={chats}
                            currentChatId={currentChatId}
                            onSelectChat={handleSelectChat}
                            onNewChat={handleNewChat}
                            onDeleteChat={handleDeleteChat}
                            onSettingsClick={() => setIsSettingsOpen(true)}
                            onLogoutClick={handleLogout}
                          />
                      </SheetContent>
                  </Sheet>
                  <span className="ml-2 font-bold">SkillNova</span>
              </div>
  
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-6">
                  {messages.length === 0 ? <EmptyState /> : messages.map((msg) => <ChatMessage key={msg.id} role={msg.role} content={msg.content} />)}
                  
                  {/* Thinking Indicator */}
                  {isThinking && (
                     <div className="flex items-center gap-3 animate-pulse bg-white/5 p-4 rounded-lg w-fit">
                        <Loader2 className="w-5 h-5 text-lime-400 animate-spin" />
                        <span className="text-sm text-gray-400">SkillNova is thinking...</span>
                     </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="p-4 bg-gradient-to-t from-[#131314] to-transparent">
                <div className="max-w-4xl mx-auto">
                  <form onSubmit={handleSendMessage} className="relative">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything about your career..."
                      className="bg-[#1e1f20] border-neutral-700 text-white placeholder:text-gray-400 rounded-2xl text-base py-7 pl-6 pr-16 focus-visible:ring-lime-500/50"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-full w-10 h-10 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      <span className="sr-only">Send message</span>
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>
        <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      </>
    );
}