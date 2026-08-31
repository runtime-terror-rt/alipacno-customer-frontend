"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetWishlistQuery } from "../../../redux/features/api/wishlistApi";
import { useGetOrdersQuery } from "../../../redux/features/api/ordersApi";
import { useGetMeQuery } from "../../../redux/features/api/authApi";
import { useBranchSelection } from "@/hooks/useBranchSelection";

interface HeaderProps {
  onProductClick?: (product: any) => void;
  onMenuClick?: () => void;
}

export default function Header({ onProductClick, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const { data: wishlistData } = useGetWishlistQuery();
  const { data: ordersRes } = useGetOrdersQuery();
  const { data: meRes } = useGetMeQuery();

  const { nearestBranch } = useBranchSelection();

  const wishlistItems = Array.isArray(wishlistData?.data) ? wishlistData.data : (wishlistData?.data?.data || []);

  const ordersList = ordersRes?.data || [];
  const activeOrdersCount = ordersList.filter(
    (o: any) => o.order_status !== "delivered" && o.order_status !== "cancelled"
  ).length;

  const user = meRes?.user || meRes?.data || meRes || {};
  const userName = user.name || "Charles Deo";
  const userAvatar = user.avatar_url || user.avatar || user.user_image_url || "/customer/profile.png";

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

        {/* Sophisticated Sleek Nearest Branch Suggestion */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium">
          <div className="w-6 h-6 rounded-full bg-[#F9671A]/10 border border-[#F9671A]/30 flex items-center justify-center text-[#F9671A]">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
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

      <div className="flex items-center gap-3 sm:gap-5">
        <button onClick={() => router.push("/menu")} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
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

        <Link href="/my-orders" className="text-zinc-400 hover:text-white transition-colors cursor-pointer relative flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
            <path d="M3 6h18"></path>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          {activeOrdersCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#F9671A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {activeOrdersCount}
            </span>
          )}
        </Link>

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
