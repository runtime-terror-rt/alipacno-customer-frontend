"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ArrowLeft, Trash2, ShoppingCart } from "lucide-react";
import { useGetWishlistQuery, useToggleWishlistMutation } from "../../../redux/features/api/wishlistApi";
import { useAddCartItemMutation, useGetCartQuery } from "../../../redux/features/api/cartApi";
import { toast } from "react-hot-toast";
import Header from "../components/Header";

export default function WishlistPage() {
  const router = useRouter();
  const { data: wishlistData, isLoading } = useGetWishlistQuery();
  const [toggleWishlistMut] = useToggleWishlistMutation();
  const { data: cartData, refetch: refetchCart } = useGetCartQuery();
  const [addCartItemMut] = useAddCartItemMutation();

  const wishlistItems = Array.isArray(wishlistData?.data) ? wishlistData.data : (wishlistData?.data?.data || []);

  const handleRemove = async (item: any) => {
    try {
      await toggleWishlistMut({ menu_item_id: item.menu_item_id }).unwrap();
      toast.success(`${item.menu_item?.name || 'Item'} removed from wishlist`);
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = async (item: any) => {
    try {
      const cartId = cartData?.id || cartData?.data?.id;
      if (!cartId) {
        toast.error("Cart not ready");
        return;
      }
      await addCartItemMut({
        cart_id: cartId,
        menu_item_id: item.menu_item_id,
        quantity: 1
      }).unwrap();
      refetchCart();
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/customer")) return url;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1E1E20] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9671A]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#1E1E20] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/menu')}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Menu</span>
          </button>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Wishlist</h1>
        <p className="text-zinc-400 mb-10">Your favorite items saved for later.</p>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-white/5 rounded-3xl bg-[#1a1a1c]">
            <Star size={64} className="text-zinc-700 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Your wishlist is empty</h2>
            <p className="text-zinc-400 mb-8 max-w-md text-center">Looks like you haven't added any items to your wishlist yet. Explore our menu to find your favorites!</p>
            <button
              onClick={() => router.push('/menu')}
              className="bg-[#F9671A] hover:bg-[#ff7a33] text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg cursor-pointer"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((wishlistItem: any) => {
              const item = wishlistItem.menu_item;
              if (!item) return null;
              
              const price = `£${item.discount_price || item.price || 0}`;
              const oldPrice = (item.original_price && item.original_price !== item.price) ? `£${item.original_price}` : "";
              const rating = item.rating ? parseFloat(item.rating).toFixed(1) : "0.0";
              const image = getImageUrl(item.image_url || item.image);

              return (
                <div key={wishlistItem.id} className="bg-[#212124] rounded-[24px] overflow-hidden flex flex-col border border-white/5 hover:border-[#F9671A]/30 transition-colors shadow-lg group">
                  <div className="relative w-full aspect-[4/3] bg-[#1a1a1c] overflow-hidden">
                    <div className="absolute top-3 left-3 bg-[#1E1E20]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-white z-10 shadow-md">
                      <Star size={14} className="text-[#F9671A] fill-[#F9671A]" /> {rating}
                    </div>
                    <button 
                      onClick={() => handleRemove(wishlistItem)}
                      className="absolute top-3 right-3 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center z-20 border border-red-500/20 transition-colors text-red-500 shadow-lg cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                    <img src={image} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-[16px] font-bold text-white mb-2 line-clamp-1">{item.name}</h3>
                    <p className="text-zinc-400 text-[12px] mb-4 line-clamp-2">{item.description || "A delicious item from our menu."}</p>
                    <div className="flex items-center gap-2 mb-5">
                      <span className="font-extrabold text-[18px] text-[#F9671A]">{price}</span>
                      {oldPrice && <span className="text-zinc-500 line-through text-[13px]">{oldPrice}</span>}
                    </div>
                    <button 
                      onClick={() => handleAddToCart(wishlistItem)}
                      className="mt-auto w-full py-3 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#F9671A]/20"
                    >
                      <ShoppingCart size={18} />
                      Add to cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
