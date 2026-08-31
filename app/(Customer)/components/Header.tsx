"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, X, MessageCircle, ChevronRight } from "lucide-react";
import { useGetWishlistQuery } from "../../../redux/features/api/wishlistApi";
import { useGetOrdersQuery } from "../../../redux/features/api/ordersApi";
import { useGetMeQuery } from "../../../redux/features/api/authApi";
import { useGetConversationsQuery } from "../../../redux/features/api/chatApi";
import { useBranchSelection } from "@/hooks/useBranchSelection";
import type { ConversationListItem } from "@/types/chat/chatTypes";

interface HeaderProps {
  onProductClick?: (product: any) => void;
  onMenuClick?: () => void;
}

// ─── Mini Conversation Row (inside header dropdown) ───────────────────────────
function MiniConvRow({ conv, onClick }: { conv: ConversationListItem; onClick: () => void }) {
  const other = conv.other_participant || conv.participants[0];
  const name = other?.name || "Chat";
  const avatarSrc = other?.avatar_url || other?.avatar || other?.user_image_url;
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const preview =
    conv.last_message?.message ||
    (conv.last_message?.has_attachment ? "Sent an attachment" : "No messages yet");
  const time = conv.last_message_at
    ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left group"
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        {avatarSrc ? (
          <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700 relative">
            <Image src={avatarSrc} alt={name} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#F9671A] flex items-center justify-center text-white text-[12px] font-bold shrink-0">
            {initials}
          </div>
        )}
        {other?.is_online && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1a1a1c]" />
        )}
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-white font-semibold text-[13px] truncate group-hover:text-[#F9671A] transition-colors">
            {name}
          </span>
          <span className="text-zinc-500 text-[11px] shrink-0">{time}</span>
        </div>
        <span className="text-zinc-500 text-[12px] truncate block">{preview}</span>
      </div>
      {/* Unread badge */}
      {conv.unread_count > 0 && (
        <span className="bg-[#F9671A] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
          {conv.unread_count}
        </span>
      )}
    </button>
  );
}

// ─── Chat Modal Dropdown ──────────────────────────────────────────────────────
function ChatDropdown({
  conversations,
  onClose,
  onViewAll,
  onSelectConv,
  onNewChat,
}: {
  conversations: ConversationListItem[];
  onClose: () => void;
  onViewAll: () => void;
  onSelectConv: (id: number) => void;
  onNewChat: () => void;
}) {
  return (
    <div className="absolute top-full right-0 mt-3 w-[360px] bg-[#1a1a1c] border border-white/10 rounded-2xl shadow-2xl z-[9999] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#212124]">
        <span className="text-white font-extrabold text-[13px] uppercase tracking-wider">
          Messages
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F9671A]/10 hover:bg-[#F9671A]/20 text-[#F9671A] text-[11px] font-bold rounded-lg transition border border-[#F9671A]/20"
          >
            <Plus size={13} />
            New Chat
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Conversations list */}
      <div className="max-h-[320px] overflow-y-auto divide-y divide-white/5">
        {conversations.length === 0 ? (
          <div className="py-10 text-center text-zinc-500 text-xs px-6">
            <MessageCircle size={28} className="mx-auto mb-2 text-zinc-700" />
            <p className="font-semibold text-zinc-400">No conversations yet</p>
            <p className="mt-1">Start a chat with your branch admin or driver</p>
          </div>
        ) : (
          conversations.slice(0, 6).map((conv) => (
            <MiniConvRow
              key={conv.id}
              conv={conv}
              onClick={() => {
                onSelectConv(conv.id);
                onClose();
              }}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-[#212124]/60">
        <button
          onClick={onViewAll}
          className="w-full flex items-center justify-center gap-1.5 py-3 text-[#F9671A] text-[13px] font-bold hover:bg-[#F9671A]/5 transition"
        >
          View All Messages
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
export default function Header({ onProductClick }: HeaderProps) {
  const router = useRouter();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatDropdownRef = useRef<HTMLDivElement>(null);

  const { data: wishlistData } = useGetWishlistQuery();
  const { data: ordersRes } = useGetOrdersQuery();
  const { data: meRes } = useGetMeQuery();
  const { data: convsRes } = useGetConversationsQuery(undefined, { pollingInterval: 5000 });

  const { nearestBranch } = useBranchSelection();

  const wishlistItems = Array.isArray(wishlistData?.data)
    ? wishlistData.data
    : wishlistData?.data?.data || [];

  const conversations: ConversationListItem[] = convsRes?.data || [];
  const totalUnread = conversations.reduce((a, c) => a + (c.unread_count || 0), 0);

  const ordersList = ordersRes?.data || [];
  const activeOrdersCount = ordersList.filter(
    (o: any) => o.order_status !== "delivered" && o.order_status !== "cancelled"
  ).length;

  const user = meRes?.user || meRes?.data || meRes || {};
  const userName = user.name || "Charles Deo";
  const userAvatar =
    user.avatar_url || user.avatar || user.user_image_url || "/customer/profile.png";

  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/customer")) return url;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const handleProductClick = (product: any) => {
    setIsWishlistOpen(false);
    if (onProductClick) {
      onProductClick(product);
    } else {
      router.push("/wishlist");
    }
  };

  // Close chat dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (chatDropdownRef.current && !chatDropdownRef.current.contains(e.target as Node)) {
        setIsChatOpen(false);
      }
    };
    if (isChatOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isChatOpen]);

  const goToChat = (convId?: number) => {
    if (convId) {
      router.push(`/chat?conv=${convId}`);
    } else {
      router.push("/chat");
    }
  };

  return (
    <header className="h-[70px] w-full flex-shrink-0 border-b border-white/5 bg-[#1E1E20] flex items-center justify-between px-4 sm:px-8 z-40 relative">
      {/* Left: Logo + Branch */}
      <div className="flex items-center gap-2">
        <div className="lg:hidden flex-shrink-0 mr-2">
          <Link href="/menu">
            <Image src="/logo.png" alt="Logo" width={75} height={42} priority className="object-contain" />
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs font-medium">
          <div className="w-6 h-6 rounded-full bg-[#F9671A]/10 border border-[#F9671A]/30 flex items-center justify-center text-[#F9671A]">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <span className="text-zinc-400 text-sm font-medium">Nearest Branch:</span>
          <span className="text-[#F9671A] text-sm font-bold ml-0.5">
            {nearestBranch?.name || "Pacino's Main Store"}
          </span>
          {nearestBranch?.formattedDistance && (
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold ml-1">
              {nearestBranch.formattedDistance}
            </span>
          )}
        </div>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Search */}
        <button onClick={() => router.push("/menu")} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>

        {/* Wishlist */}
        <div className="relative">
          <button onClick={() => { setIsWishlistOpen(!isWishlistOpen); setIsChatOpen(false); }} className="text-zinc-400 hover:text-white transition-colors cursor-pointer relative flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={wishlistItems.length > 0 ? "#F9671A" : "none"} stroke={wishlistItems.length > 0 ? "#F9671A" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#F9671A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </button>

          {isWishlistOpen && (
            <div className="absolute top-full right-0 mt-4 w-[280px] sm:w-[320px] bg-[#1a1a1c] border border-white/10 rounded-2xl shadow-2xl z-[9999] flex flex-col transform origin-top-right transition-all">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#212124] rounded-t-2xl">
                <h3 className="font-bold text-white text-[15px]">My Wishlist</h3>
                <span className="text-[11px] bg-[#F9671A]/20 text-[#F9671A] px-2 py-0.5 rounded-full font-bold">{wishlistItems.length} Items</span>
              </div>
              <div className="max-h-[300px] sm:max-h-[350px] overflow-y-auto scrollbar-hide bg-[#1a1a1c]">
                {wishlistItems.length === 0 ? (
                  <div className="p-6 text-center text-zinc-400 text-sm">Your wishlist is empty.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {wishlistItems.map((item: any) => {
                      const p = item.menu_item || item.product || item;
                      const pName = p.name || p.title || "Menu Item";
                      const pPrice = p.price ? `$${parseFloat(p.price).toFixed(2)}` : "$0.00";
                      const pImg = getImageUrl(p.image_url || p.image);
                      return (
                        <div key={item.id || p.id} className="p-3.5 flex items-center justify-between hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3 cursor-pointer min-w-0" onClick={() => handleProductClick(p)}>
                            <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0 bg-zinc-800 border border-white/10">
                              <Image src={pImg} alt={pName} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate max-w-[140px]">{pName}</h4>
                              <p className="text-[11px] font-semibold text-[#F9671A] mt-0.5">{pPrice}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Chat Icon + Dropdown ── */}
        <div className="relative" ref={chatDropdownRef}>
          <button
            id="header-chat-icon"
            aria-label="Messages"
            onClick={() => { setIsChatOpen(!isChatOpen); setIsWishlistOpen(false); }}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer relative flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {totalUnread > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#F9671A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            )}
          </button>

          {isChatOpen && (
            <ChatDropdown
              conversations={conversations}
              onClose={() => setIsChatOpen(false)}
              onViewAll={() => { setIsChatOpen(false); router.push("/chat"); }}
              onSelectConv={(id) => goToChat(id)}
              onNewChat={() => { setIsChatOpen(false); router.push("/chat?new=1"); }}
            />
          )}
        </div>

        {/* Orders */}
        <Link href="/my-orders" className="text-zinc-400 hover:text-white transition-colors cursor-pointer relative flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {activeOrdersCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#F9671A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {activeOrdersCount}
            </span>
          )}
        </Link>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-full overflow-hidden relative border border-white/20 bg-zinc-800 flex-shrink-0">
            <Image src={userAvatar} alt="User Avatar" fill className="object-cover" />
          </div>
          <span className="hidden sm:block text-xs font-bold text-white max-w-[100px] truncate">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
}
