import React from "react";
import Link from "next/link";
import Image from "next/image";

interface ProfileInfoProps {
  user: any;
  wishlistItems: any[];
  isWishlistLoading: boolean;
  handleRemoveWishlist: (item: any) => void;
  handleAddToCart: (item: any) => void;
  getImageUrl: (url: string) => string;
}

export default function ProfileInfo({
  user,
  wishlistItems,
  isWishlistLoading,
  handleRemoveWishlist,
  handleAddToCart,
  getImageUrl,
}: ProfileInfoProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* About Section */}
      <div className="lg:col-span-5 bg-[#252527] rounded-[24px] p-7 border border-white/5 shadow-md">
        <h3 className="text-[17px] font-bold text-white mb-6">About</h3>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 text-zinc-400 pb-5 border-b border-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            <span className="text-[14px]">Gender: Male</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400 pb-5 border-b border-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            <span className="text-[14px]">Phone: {user?.phone || "N/A"}</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            <span className="text-[14px]">Email: {user?.email || "N/A"}</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
            <span className="text-[14px]">Address: {user?.addresses?.[0]?.address ? `${user.addresses[0].address}, ${user.addresses[0].postcode || ''}` : "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Favourite Item Section */}
      <div className="lg:col-span-7 bg-[#252527] rounded-[24px] p-7 border border-white/5 shadow-md flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[17px] font-bold text-white">Favourite Item</h3>
          {wishlistItems.length > 0 && (
            <button className="bg-white hover:bg-zinc-200 transition-colors text-zinc-900 text-[12px] font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm cursor-pointer">
              Sort
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4" /><path d="M7 20V4" /><path d="m21 8-4-4-4 4" /><path d="M17 4v16" /></svg>
            </button>
          )}
        </div>

        {isWishlistLoading ? (
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F9671A]"></div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] text-center px-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 mb-4"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
            <h4 className="text-white font-bold mb-1 text-[15px]">No favourites yet</h4>
            <p className="text-zinc-400 text-[13px] max-w-[250px]">Items you add to your wishlist will appear here.</p>
            <Link href="/menu" className="mt-4 text-[#F9671A] hover:text-[#ff7a33] text-[13px] font-bold">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {wishlistItems.slice(0, 6).map((wishlistItem: any) => {
              const item = wishlistItem.menu_item;
              if (!item) return null;
              
              const price = `£${item.discount_price || item.price || 0}`;
              const oldPrice = (item.original_price && item.original_price !== item.price) ? `£${item.original_price}` : "";
              const rating = item.rating ? parseFloat(item.rating).toFixed(1) : "0.0";
              
              return (
                <div key={item.id} className="bg-[#1E1E20] rounded-[16px] overflow-hidden flex flex-col p-2.5 pb-4 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-full aspect-[4/3] rounded-[12px] bg-[#1a1a1c] relative overflow-hidden mb-3 group">
                    <Image 
                      src={getImageUrl(item.image)} 
                      alt={item.name} 
                      fill 
                      className="object-cover transition-transform duration-300 group-hover:scale-110" 
                    />
                    {/* Rating Pill */}
                    {parseFloat(rating) > 0 && (
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#F9671A" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        {rating}
                      </div>
                    )}
                    {/* Heart Pill (Remove) */}
                    <button 
                      onClick={() => handleRemoveWishlist(wishlistItem)}
                      className="absolute top-2 right-2 w-7 h-7 bg-white/20 hover:bg-[#eb4852] backdrop-blur-md rounded-full flex items-center justify-center transition-colors cursor-pointer z-10 group/btn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/btn:scale-110"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                    </button>
                  </div>
                  <h4 className="text-[14px] font-bold text-white mb-1.5 px-1 truncate" title={item.name}>{item.name}</h4>
                  <div className="flex items-center gap-1.5 px-1 mb-4">
                    <span className="text-[#F9671A] text-[13px] font-extrabold">{price}</span>
                    {oldPrice && <span className="text-zinc-500 text-[11px] line-through">{oldPrice}</span>}
                    <span className="text-zinc-400 text-[11px]">/portion</span>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(wishlistItem)}
                    className="w-full py-2.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[13px] font-bold transition-colors shadow-lg shadow-orange-600/20 flex items-center justify-center gap-1.5 mt-auto cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    Add to cart
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {wishlistItems.length > 6 && (
          <div className="mt-6 text-center">
            <Link href="/wishlist" className="text-[#F9671A] hover:text-[#ff7a33] text-[13px] font-bold underline transition-colors">
              View all {wishlistItems.length} items
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
