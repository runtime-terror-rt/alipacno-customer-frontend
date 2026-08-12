"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetWishlistQuery, useToggleWishlistMutation } from "../../../redux/features/api/wishlistApi";
import { toast } from "react-hot-toast";

interface HeaderProps {
  onProductClick?: (product: any) => void;
  onMenuClick?: () => void;
}

export default function Header({ onProductClick, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  
  const { data: wishlistData } = useGetWishlistQuery();
  const [toggleWishlistMut] = useToggleWishlistMutation();
  const wishlistItems = Array.isArray(wishlistData?.data) ? wishlistData.data : (wishlistData?.data?.data || []);

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
      router.push('/wishlist');
    }
  };

  return (
    <header className="h-[70px] w-full flex-shrink-0 border-b border-white/5 bg-[#1E1E20] flex items-center justify-between px-4 sm:px-8 z-40 relative">
      <div className="flex items-center gap-2">
        <div className="lg:hidden flex-shrink-0 mr-2">
          <Link href="/menu">
            <Image src="/logo.png" alt="Logo" width={75} height={42} priority className="object-contain" />
          </Link>
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span className="text-zinc-400 text-sm font-medium">Nearest Branch:</span>
          <span className="text-[#F9671A] text-sm font-semibold ml-1">Cloud Gate (The Bean), Chicago</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </button>
        <div className="relative">
          <button onClick={() => setIsWishlistOpen(!isWishlistOpen)} className="text-zinc-400 hover:text-white transition-colors cursor-pointer relative flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={wishlistItems.length > 0 ? "#F9671A" : "none"} stroke={wishlistItems.length > 0 ? "#F9671A" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#F9671A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{wishlistItems.length}</span>
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
                  wishlistItems.map((wishlistItem: any) => {
                    const wItem = wishlistItem.menu_item;
                    if (!wItem) return null;
                    return (
                      <div key={wishlistItem.id} className="flex gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => handleProductClick(wItem)}>
                        <img src={getImageUrl(wItem.image_url || wItem.image)} alt={wItem.name} className="w-12 h-12 rounded-lg object-cover bg-black/20 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-bold text-white truncate">{wItem.name}</h4>
                          <div className="text-[#F9671A] text-[12px] font-extrabold mt-0.5">£{wItem.discount_price || wItem.price}</div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); toggleWishlistMut({ menu_item_id: wItem.id }); toast.success(`${wItem.name} removed from wishlist!`); }} className="text-zinc-500 hover:text-red-500 transition-colors p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 flex-shrink-0 h-fit self-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
              {wishlistItems.length > 0 && (
                <div className="p-3 bg-[#212124] border-t border-white/10 rounded-b-2xl">
                  <button onClick={() => { setIsWishlistOpen(false); router.push('/wishlist'); }} className="w-full py-2.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-xl text-[13px] font-bold transition-colors cursor-pointer shadow-lg shadow-[#F9671A]/20">
                    View Full Wishlist
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <button onClick={() => router.push("/my-orders")} className="relative text-zinc-400 hover:text-white transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
            <path d="M3 6h18"></path>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span className="absolute -top-1.5 -right-1.5 bg-[#F9671A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
        </button>

        <div onClick={() => router.push("/profile")} className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-white/10 cursor-pointer group">
          <span className="text-sm font-medium text-white group-hover:text-[#F9671A] transition-colors hidden sm:inline">Charles Deo</span>
          <div className="w-8 h-8 rounded-full bg-zinc-700 overflow-hidden relative border border-white/10 group-hover:border-[#F9671A]/30 transition-colors">
            <Image src="/customer/profile.png" alt="Avatar" fill className="object-cover" />
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white transition-colors hidden sm:inline">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        {/* Burger Menu Trigger */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer lg:hidden ml-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
          </button>
        )}
      </div>
    </header>
  );
}
