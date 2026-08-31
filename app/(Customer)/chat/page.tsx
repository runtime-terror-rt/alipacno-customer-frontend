"use client";

import { useState, useEffect, useRef, useLayoutEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  MessageCircle,
  Search,
  Send,
  Paperclip,
  X,
  Loader2,
  CheckCheck,
  Store,
  Plus,
  ChevronLeft,
  ImageIcon,
} from "lucide-react";
import Header from "@/app/(Customer)/components/Header";
import CategorySidebar from "@/app/(Customer)/my-orders/components/CategorySidebar";
import { categories } from "@/components/categories";
import {
  useGetConversationsQuery,
  useGetConversationDetailQuery,
  useGetChatContactsQuery,
  useCreateConversationMutation,
  useSendMessageMutation,
} from "@/redux/features/api/chatApi";
import type {
  ConversationListItem,
  ChatMessageItem,
  ChatUserParticipant,
  ConversationDetailResponse,
} from "@/types/chat/chatTypes";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const sortAsc = (arr: ChatMessageItem[]): ChatMessageItem[] =>
  [...arr].sort((a, b) => {
    const d = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return d !== 0 ? d : a.id - b.id;
  });

function Avatar({
  src,
  name,
  size = 40,
  isBranch = false,
}: {
  src?: string | null;
  name: string;
  size?: number;
  isBranch?: boolean;
}) {
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  if (isBranch)
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-[#F9671A]/10 border border-[#F9671A] flex items-center justify-center text-[#F9671A] shrink-0"
      >
        <Store size={size * 0.45} />
      </div>
    );
  if (src)
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full overflow-hidden border border-zinc-700 relative shrink-0"
      >
        <Image src={src} alt={name} fill className="object-cover" sizes={`${size}px`} />
      </div>
    );
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.3 }}
      className="rounded-full bg-[#F9671A] flex items-center justify-center text-white font-bold shrink-0"
    >
      {initials}
    </div>
  );
}

// ─── Conversation List Panel ──────────────────────────────────────────────────

function ConversationPanel({
  conversations,
  isLoading,
  selectedId,
  onSelect,
  onNewChat,
  mobileHidden,
}: {
  conversations: ConversationListItem[];
  isLoading: boolean;
  selectedId: number | null;
  onSelect: (id: number) => void;
  onNewChat: () => void;
  mobileHidden: boolean;
}) {
  const [search, setSearch] = useState("");
  const filtered = conversations.filter((c) =>
    (c.other_participant?.name || c.participants[0]?.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const totalUnread = conversations.reduce((a, c) => a + (c.unread_count || 0), 0);

  return (
    <div
      className={`w-full md:w-[280px] lg:w-[300px] shrink-0 flex flex-col border-r border-[#353535] bg-[#1E1E20] ${
        mobileHidden ? "hidden md:flex" : "flex"
      }`}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-[#353535] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold text-[17px]">Conversations</h2>
            {totalUnread > 0 && (
              <span className="bg-[#F9671A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">
                {totalUnread}
              </span>
            )}
          </div>
          <button
            onClick={onNewChat}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#F9671A]/10 hover:bg-[#F9671A]/20 text-[#F9671A] text-[11px] font-bold rounded-lg border border-[#F9671A]/20 transition"
          >
            <Plus size={13} />
            New Chat
          </button>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900/60 border border-[#3d3d3d] rounded-xl px-3 py-2 focus-within:border-[#F9671A] transition-colors">
          <Search size={14} className="text-zinc-500 shrink-0" />
          <input
            type="text"
            placeholder="Search Conversations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-[13px] text-white placeholder-[#626262] outline-none w-full"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#343436]/50">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center gap-2 text-zinc-500 text-xs">
            <Loader2 size={20} className="animate-spin text-[#F9671A]" />
            <span>Loading conversations...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs px-6">
            <MessageCircle size={28} className="mx-auto mb-2 text-zinc-700" />
            <p className="font-semibold text-zinc-400">No conversations yet</p>
            <p className="mt-1">Chat with your branch admin or driver</p>
          </div>
        ) : (
          filtered.map((conv) => {
            const other = conv.other_participant || conv.participants[0];
            const name = other?.name || "Chat";
            const isBranch = conv.type === "branch" || !!conv.branch_id;
            const src = other?.avatar_url || other?.avatar || other?.user_image_url;
            const preview =
              conv.last_message?.message ||
              (conv.last_message?.has_attachment ? "Sent an attachment" : "No messages yet");
            const time = conv.last_message_at
              ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "";
            const selected = conv.id === selectedId;

            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`w-full flex items-start justify-between px-4 py-3 text-left transition-colors ${
                  selected
                    ? "bg-[#F9671A]/10 border-l-2 border-l-[#F9671A]"
                    : "hover:bg-[#3d3d3d]/30"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <Avatar src={src} name={name} size={42} isBranch={isBranch} />
                    {other?.is_online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1E1E20]" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-white font-semibold text-[14px] truncate">{name}</span>
                    <span className="text-[#626262] text-[12px] truncate">{preview}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                  <span className="text-[#626262] text-[11px]">{time}</span>
                  {conv.unread_count > 0 && (
                    <span className="bg-[#F9671A] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Chat Window ─────────────────────────────────────────────────────────────

function ChatWindow({
  convDetail,
  activeConv,
  isLoading,
  page,
  onLoadOlder,
  onSend,
  isSending,
  onBack,
}: {
  convDetail?: ConversationDetailResponse;
  activeConv?: ConversationListItem;
  isLoading: boolean;
  page: number;
  onLoadOlder: (p: number) => void;
  onSend: (text: string, file: File | null) => Promise<void>;
  isSending: boolean;
  onBack: () => void;
}) {
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef(0);
  const autoScroll = useRef(true);

  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [prevConvId, setPrevConvId] = useState<number | null>(null);

  const other =
    convDetail?.other_participant ||
    activeConv?.other_participant ||
    activeConv?.participants[0];
  const currentId = convDetail?.conversation?.id || activeConv?.id || null;
  const pagination = convDetail?.messages;
  const curPage = pagination?.current_page || 1;
  const lastPage = pagination?.last_page || 1;
  const isBranch = activeConv?.type === "branch" || !!activeConv?.branch_id;
  const name = other?.name || (isBranch ? "Branch Chat" : "Chat");
  const src = other?.avatar_url || other?.avatar || other?.user_image_url;

  useEffect(() => {
    if (!pagination?.data) return;
    const incoming = sortAsc(pagination.data);
    if (currentId !== prevConvId || page === 1) {
      setMessages(incoming);
      setPrevConvId(currentId);
      autoScroll.current = true;
    } else if (page > 1) {
      setMessages((prev) => {
        const map = new Map<number, ChatMessageItem>();
        [...incoming, ...prev].forEach((m) => map.set(m.id, m));
        return sortAsc(Array.from(map.values()));
      });
    }
  }, [pagination?.data, currentId, page, prevConvId]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (autoScroll.current) {
      el.scrollTop = el.scrollHeight;
    } else if (prevScrollHeight.current > 0) {
      el.scrollTop = el.scrollHeight - prevScrollHeight.current;
      prevScrollHeight.current = 0;
    }
  }, [messages]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    autoScroll.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (el.scrollTop < 30 && curPage < lastPage) {
      prevScrollHeight.current = el.scrollHeight;
      autoScroll.current = false;
      onLoadOlder(curPage + 1);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !file) return;
    autoScroll.current = true;
    await onSend(input, file);
    setInput("");
    setFile(null);
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-[#F9671A]/5 border-b border-[#343436] shrink-0">
        <button
          onClick={onBack}
          className="md:hidden p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="relative">
          <Avatar src={src} name={name} size={40} isBranch={isBranch} />
          {other?.is_online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1E1E20]" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-white font-semibold text-[17px]">{name}</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${other?.is_online ? "bg-emerald-500" : "bg-zinc-500"}`} />
            <span className={`text-[12px] ${other?.is_online ? "text-emerald-400" : "text-zinc-400"}`}>
              {other?.is_online ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto flex flex-col gap-5 p-5"
      >
        {isLoading && messages.length === 0 ? (
          <div className="m-auto flex flex-col items-center gap-3 text-zinc-500 text-xs">
            <Loader2 size={24} className="animate-spin text-[#F9671A]" />
            <span>Loading conversation...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="m-auto flex flex-col items-center gap-3 text-zinc-500 text-xs text-center px-8">
            <div className="w-14 h-14 rounded-full bg-[#F9671A]/10 border border-[#F9671A]/30 flex items-center justify-center">
              <MessageCircle size={24} className="text-[#F9671A]" />
            </div>
            <p className="font-semibold text-zinc-300">No messages yet</p>
            <p>Send a message to start the conversation!</p>
          </div>
        ) : (
          <>
            {curPage < lastPage && (
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 shrink-0">
                <Loader2 size={11} className="animate-spin text-[#F9671A]" />
                Scroll to top for older messages
              </div>
            )}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex-1 h-px bg-[#3d3d3d]" />
              <span className="text-[#626262] text-[12px] px-3 py-1 rounded-full border border-[#626262] bg-[#3d3d3d]">
                Messages
              </span>
              <div className="flex-1 h-px bg-[#3d3d3d]" />
            </div>

            {messages.map((msg) => {
              const isOwn = msg.sender_id !== other?.id;
              const time = new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const senderSrc = msg.sender?.avatar_url || (isOwn ? undefined : src);

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-3 ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  {!isOwn && (
                    <div className="w-9 h-9 rounded-full bg-[#3d3d3d] flex items-center justify-center shrink-0 overflow-hidden border border-zinc-700 text-white font-bold text-xs">
                      {senderSrc ? (
                        <Image src={senderSrc} alt="Avatar" width={36} height={36} className="object-cover" />
                      ) : (
                        (msg.sender?.name || name).slice(0, 2).toUpperCase()
                      )}
                    </div>
                  )}
                  <div className={`flex flex-col max-w-[68%] ${isOwn ? "items-end" : "items-start"}`}>
                    {!isOwn && (
                      <span className="text-[#F9671A] text-[11px] font-semibold mb-1">
                        {msg.sender?.name || name}
                      </span>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                        isOwn
                          ? "bg-[#3d3d3d]/60 border border-zinc-700/60 text-[#fff7f3] rounded-br-sm"
                          : "bg-[#101010] border border-zinc-800 text-[#fff7f3] rounded-bl-sm"
                      }`}
                    >
                      {msg.message && <p className="whitespace-pre-wrap">{msg.message}</p>}
                      {msg.attachment_url && (
                        <div className="mt-2">
                          {msg.attachment_type === "image" ||
                          /\.(jpg|jpeg|png|gif|webp)$/i.test(msg.attachment_url) ? (
                            <div className="relative max-w-[260px] rounded-xl overflow-hidden border border-zinc-700">
                              <Image src={msg.attachment_url} alt="Attachment" width={260} height={180} className="object-cover" />
                            </div>
                          ) : (
                            <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-[#F9671A] underline mt-1">
                              <Paperclip size={13} />
                              View Attachment
                            </a>
                          )}
                        </div>
                      )}
                      <div className={`flex items-center gap-1.5 mt-1.5 text-[11px] text-[#9c9c9c] ${isOwn ? "justify-end" : "justify-start"}`}>
                        <span>{time}</span>
                        {isOwn && <CheckCheck size={13} className="text-[#F9671A]" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[#3d3d3d] m-4 border rounded-xl bg-[#161619] flex flex-col gap-2 shrink-0">
        {file && (
          <div className="px-4 pt-2.5 flex items-center justify-between bg-zinc-800/60 rounded-t-xl text-xs text-zinc-300">
            <span className="truncate max-w-[280px]">📎 {file.name}</span>
            <button onClick={() => setFile(null)} className="text-zinc-400 hover:text-white ml-2">
              <X size={14} />
            </button>
          </div>
        )}
        <div className="px-4 pt-3 min-h-[50px]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message..."
            className="w-full bg-transparent text-[14px] text-white placeholder-[#626262] resize-none outline-none leading-relaxed"
            rows={2}
          />
        </div>
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex items-center gap-4 text-[#626262]">
            <input type="file" ref={fileRef} onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
            <button onClick={() => fileRef.current?.click()} className="hover:text-white transition-colors cursor-pointer">
              <Paperclip size={21} />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={isSending || (!input.trim() && !file)}
            className="w-8 h-8 bg-[#F9671A] hover:bg-orange-600 disabled:opacity-40 rounded-lg flex items-center justify-center transition cursor-pointer"
          >
            {isSending ? (
              <Loader2 size={15} className="text-white animate-spin" />
            ) : (
              <Send size={15} className="text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Right Info Panel ─────────────────────────────────────────────────────────

function RightPanel({
  convDetail,
  activeConv,
}: {
  convDetail?: ConversationDetailResponse;
  activeConv?: ConversationListItem;
}) {
  const other = convDetail?.other_participant || activeConv?.other_participant;
  const participants = convDetail?.conversation?.participants || activeConv?.participants || [];
  const isBranch = activeConv?.type === "branch" || !!activeConv?.branch_id;
  const name = other?.name || (isBranch ? "Branch Chat" : "Chat");
  const messages = convDetail?.messages?.data || [];
  const attachments = messages.filter((m) => m.attachment_url);

  return (
    <div className="w-[260px] shrink-0 flex flex-col gap-4 p-4 border-l border-[#353535] overflow-y-auto">
      {/* Contact info */}
      <div className="bg-[#F9671A]/5 border border-[#F9671A]/20 rounded-xl px-3 py-3 flex items-center gap-3">
        <Avatar src={other?.avatar_url || other?.avatar} name={name} size={40} isBranch={isBranch} />
        <div className="min-w-0">
          <p className="text-white font-semibold text-[13px] truncate">{name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${other?.is_online ? "bg-emerald-500" : "bg-zinc-500"}`} />
            <span className={`text-[11px] ${other?.is_online ? "text-emerald-400" : "text-zinc-400"}`}>
              {other?.is_online ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div>
        <p className="text-white text-[11px] font-bold uppercase tracking-wider mb-2">
          Participants ({participants.length})
        </p>
        <div className="flex flex-col divide-y divide-[#343436]">
          {participants.map((p) => {
            const pSrc = p.avatar_url || p.avatar || p.user_image_url;
            const initials = p.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
            return (
              <div key={p.id} className="flex items-center gap-2.5 py-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-700 border border-zinc-600 flex items-center justify-center overflow-hidden text-white text-[11px] font-bold shrink-0">
                  {pSrc ? (
                    <Image src={pSrc} alt={p.name} width={32} height={32} className="object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-[12px] font-medium truncate">{p.name}</p>
                  <p className="text-zinc-500 text-[10px] capitalize">
                    {p.user_type?.replace(/_/g, " ") || "Member"}
                  </p>
                </div>
                {p.is_online && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ml-auto" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Shared Media */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-white text-[14px] font-semibold">Shared Media</p>
          <span className="text-zinc-500 text-[11px]">({attachments.length})</span>
        </div>
        {attachments.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-4">No media shared yet</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {attachments.slice(0, 6).map((att) => (
              <a
                key={att.id}
                href={att.attachment_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-16 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 block hover:opacity-80 transition"
              >
                {att.attachment_type === "image" ||
                /\.(jpg|jpeg|png|gif|webp)$/i.test(att.attachment_url || "") ? (
                  <Image src={att.attachment_url!} alt="Media" fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[#F9671A]">
                    <ImageIcon size={18} />
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── New Chat Modal ───────────────────────────────────────────────────────────

function NewChatModal({
  onClose,
  onSelect,
  isCreating,
}: {
  onClose: () => void;
  onSelect: (c: ChatUserParticipant) => void;
  isCreating: boolean;
}) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("branch_admin");

  const { data: contactsRes, isLoading } = useGetChatContactsQuery({
    user_type: roleFilter || undefined,
    search: search || undefined,
  });

  const contacts = (contactsRes?.data || []).filter((c) => {
    const t = (c.user_type || "").toLowerCase();
    return t.includes("branch_admin") || t.includes("branch admin") || t === "driver";
  });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#161619] border border-zinc-800 rounded-2xl shadow-2xl z-10 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <Plus size={15} className="text-[#F9671A]" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Start New Conversation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition"
          >
            <X size={14} />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F9671A]"
            />
          </div>
          <div className="flex gap-2">
            {[
              { id: "branch_admin", label: "Branch Admin" },
              { id: "driver", label: "Driver" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setRoleFilter(p.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                  roleFilter === p.id
                    ? "bg-[#F9671A] text-white border-orange-600"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-zinc-800/60 rounded-xl border border-zinc-800 bg-zinc-950/40">
            {isLoading || isCreating ? (
              <div className="py-10 flex flex-col items-center gap-2 text-zinc-500 text-xs">
                <Loader2 size={20} className="animate-spin text-[#F9671A]" />
                <span>Loading contacts...</span>
              </div>
            ) : contacts.length === 0 ? (
              <div className="py-10 text-center text-xs text-zinc-500 font-semibold">
                No contacts found
              </div>
            ) : (
              contacts.map((c) => {
                const cSrc = c.avatar_url || c.avatar || c.user_image_url;
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelect(c)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-zinc-800/60 transition text-left group"
                  >
                    <Avatar src={cSrc} name={c.name} size={38} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate group-hover:text-[#F9671A] transition-colors">
                        {c.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 capitalize">
                        {c.user_type?.replace(/_/g, " ") || "Contact"}
                        {c.phone ? ` • ${c.phone}` : ""}
                      </p>
                    </div>
                    {c.is_online && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Inner (needs useSearchParams → wrapped in Suspense) ─────────────────────

function ChatPageInner() {
  const searchParams = useSearchParams();
  const initConvId = searchParams.get("conv") ? Number(searchParams.get("conv")) : null;
  const openNew = searchParams.get("new") === "1";

  const [selectedConvId, setSelectedConvId] = useState<number | null>(initConvId);
  const [page, setPage] = useState(1);
  const [isNewChatOpen, setIsNewChatOpen] = useState(openNew);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [activeCategory, setActiveCategory] = useState("Steaks");
  const router = useRouter();

  const { data: convsRes, isLoading: isLoadingConvs } = useGetConversationsQuery(undefined, {
    pollingInterval: 5000,
  });
  const conversations = convsRes?.data || [];

  useEffect(() => {
    if (conversations.length > 0 && !selectedConvId) {
      setSelectedConvId(conversations[0].id);
    }
  }, [conversations, selectedConvId]);

  const handleSelectConv = (id: number) => {
    setSelectedConvId(id);
    setPage(1);
    setMobileView("chat");
  };

  const { data: convDetail, isLoading: isLoadingDetail } = useGetConversationDetailQuery(
    { conversationId: selectedConvId!, page },
    { skip: !selectedConvId, pollingInterval: 3000 }
  );

  const [createConv, { isLoading: isCreating }] = useCreateConversationMutation();
  const [sendMsg, { isLoading: isSending }] = useSendMessageMutation();

  const activeConv = conversations.find((c) => c.id === selectedConvId);

  const handleSelectContact = async (contact: ChatUserParticipant) => {
    try {
      const res = await createConv({ receiver_id: contact.id }).unwrap();
      const id = res?.conversation?.id;
      if (id) {
        handleSelectConv(id);
        setIsNewChatOpen(false);
      }
    } catch {
      const existing = conversations.find((c) =>
        c.participants.some((p) => p.id === contact.id)
      );
      if (existing) {
        handleSelectConv(existing.id);
        setIsNewChatOpen(false);
      }
    }
  };

  const handleSend = async (text: string, file: File | null) => {
    if (!selectedConvId) return;
    const other =
      convDetail?.other_participant ||
      activeConv?.other_participant ||
      activeConv?.participants[0];
    try {
      await sendMsg({
        conversationId: selectedConvId,
        receiver_id: other?.id,
        message: text || undefined,
        attachment: file || undefined,
      }).unwrap();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      alert(e?.data?.message || "Failed to send message");
    }
  };

  return (
    // Outer shell — same pattern as my-orders: sidebar left + flex-col right
    <div className="h-[100dvh] w-full bg-[#1E1E20] flex text-white overflow-hidden font-sans select-none relative">
      {/* Left: Category Sidebar (same as other pages) */}
      <CategorySidebar
        categories={categories}
        activeCategory={activeCategory}
        onSelect={(name) => {
          setActiveCategory(name);
          router.push(`/menu?category=${encodeURIComponent(name)}`);
        }}
      />

      {/* Right column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#1e1e20] ]">
        {/* Header */}
        <Header />

        {/* Chat panels row */}
        <div className="flex-1 flex overflow-hidden rounded-xl border border-gray-500/30 m-6">
          {/* Conversations list */}
          <ConversationPanel
            conversations={conversations}
            isLoading={isLoadingConvs}
            selectedId={selectedConvId}
            onSelect={handleSelectConv}
            onNewChat={() => setIsNewChatOpen(true)}
            mobileHidden={mobileView === "chat"}
          />

          {/* Chat window */}
          <div
            className={`flex-1 min-w-0 flex flex-col overflow-hidden ${
              mobileView === "list" ? "hidden md:flex" : "flex"
            }`}
          >
            {selectedConvId && activeConv ? (
              <ChatWindow
                convDetail={convDetail}
                activeConv={activeConv}
                isLoading={isLoadingDetail}
                page={page}
                onLoadOlder={setPage}
                onSend={handleSend}
                isSending={isSending}
                onBack={() => setMobileView("list")}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-500 px-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#F9671A]/10 border border-[#F9671A]/30 flex items-center justify-center">
                  <MessageCircle size={28} className="text-[#F9671A]" />
                </div>
                <div>
                  <p className="font-bold text-zinc-300 text-[16px]">Your Messages</p>
                  <p className="text-sm mt-1">
                    Select a conversation or start a new chat with your branch admin or driver.
                  </p>
                </div>
                <button
                  onClick={() => setIsNewChatOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#F9671A] hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition"
                >
                  <Plus size={16} />
                  New Chat
                </button>
              </div>
            )}
          </div>

          {/* Right info panel — desktop only */}
          {selectedConvId && activeConv && (
            <div className="hidden lg:flex">
              <RightPanel convDetail={convDetail} activeConv={activeConv} />
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {isNewChatOpen && (
        <NewChatModal
          onClose={() => setIsNewChatOpen(false)}
          onSelect={handleSelectContact}
          isCreating={isCreating}
        />
      )}
    </div>
  );
}

// ─── Page Export ─────────────────────────────────────────────────────────────

export default function CustomerChatPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[100dvh] w-full bg-[#1E1E20] flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-[#F9671A]" />
        </div>
      }
    >
      <ChatPageInner />
    </Suspense>
  );
}
