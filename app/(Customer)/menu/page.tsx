"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { useGetCategoriesQuery } from "../../../redux/features/api/categoriesApi";
import { useGetSubcategoriesQuery } from "../../../redux/features/api/subcategoriesApi";
import { useGetMenuItemsQuery, useGetMenuItemQuery } from "../../../redux/features/api/menuItemsApi";
import { useGetCartQuery, useCreateCartMutation, useAddCartItemMutation, useUpdateCartItemMutation, useRemoveCartItemMutation, extractCartData } from "../../../redux/features/api/cartApi";
import { useGetWishlistQuery, useToggleWishlistMutation } from "../../../redux/features/api/wishlistApi";
import { useBranchSelection } from "@/hooks/useBranchSelection";
import { useMatchDeliveryFeeTierQuery } from "@/redux/features/api/deliveryFeeApi";
import { kmToMiles } from "@/utils/location";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/features/slice/authSlice";
import { useLogoutMutation } from "../../../redux/features/api/authApi";
import { toast } from "react-hot-toast";
import Header from "../components/Header";
import FoodItemImage from "@/components/FoodItemImage";
import CategoryIcon, { renderCategoryIcon } from "@/public/CategoryIcon";

export default function MenuPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [logoutApi] = useLogoutMutation();
  const categoryParam = searchParams.get('category');

  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery({ all: 1 });
  const categories = categoriesData?.data?.length > 0 ? categoriesData.data : [];

  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam || null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>('all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");

  useEffect(() => {
    if (!activeCategory && categories?.length > 0) {
      setActiveCategory(categories[0].name);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    const s = searchParams.get('search');
    if (s !== null) {
      setSearchQuery(s);
    }
  }, [searchParams]);
  const [activeTagId, setActiveTagId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalQty, setModalQty] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [selectedCookingPref, setSelectedCookingPref] = useState<any>(null);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<any>(null);
  const [selectedToppings, setSelectedToppings] = useState<any[]>([]);

  // Live countdown timer for Happy Hour section (e.g. 03h : 22m : 31s)
  const [happyHourTimeLeft, setHappyHourTimeLeft] = useState(3 * 3600 + 22 * 60 + 31);
  useEffect(() => {
    const timer = setInterval(() => {
      setHappyHourTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hhHours = Math.floor(happyHourTimeLeft / 3600);
  const hhMins = Math.floor((happyHourTimeLeft % 3600) / 60);
  const hhSecs = happyHourTimeLeft % 60;
  const formattedHappyHourTime = `${String(hhHours).padStart(2, "0")}h : ${String(hhMins).padStart(2, "0")}m : ${String(hhSecs).padStart(2, "0")}s`;

  useEffect(() => {
    setSelectedSize(null);
    setSelectedCookingPref(null);
    setSelectedSpiceLevel(null);
    setSelectedToppings([]);
  }, [selectedProduct]);

  const handleLogout = async () => {
    try {
      await logoutApi({}).unwrap();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local state and redirect
      dispatch(logout());
      router.push('/login');
    }
  };

  const { data: cartData, refetch: refetchCart } = useGetCartQuery();
  const [createCartMut] = useCreateCartMutation();
  const [addCartItemMut] = useAddCartItemMutation();
  const [updateCartItemMut] = useUpdateCartItemMutation();
  const [removeCartItemMut] = useRemoveCartItemMutation();

  const { data: wishlistData } = useGetWishlistQuery();
  const [toggleWishlistMut] = useToggleWishlistMutation();

  const wishlistItems = Array.isArray(wishlistData?.data) ? wishlistData.data : (wishlistData?.data?.data || []);

  const isWishlisted = (id: number) => wishlistItems.some((item: any) => item.menu_item_id === id);

  const toggleWishlist = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    const wasWishlisted = isWishlisted(item.id);
    try {
      await toggleWishlistMut({ menu_item_id: item.id }).unwrap();
      if (wasWishlisted) {
        toast.success(`${item.name} removed from wishlist!`);
      } else {
        toast.success(`${item.name} added to wishlist!`);
      }
    } catch (error) {
      console.error("Failed to toggle wishlist", error);
      toast.error("Failed to update wishlist");
    }
  };

  const { cartObj, items: rawCartItems } = extractCartData(cartData);

  const cartItems = rawCartItems.map((item: any) => {
    const descArr = [
      (item.size || item.size)?.name,
      (item.cooking_preference || item.cookingPreference)?.name,
      (item.spice_level || item.spiceLevel)?.name,
      item.toppings?.length > 0 ? `Toppings: ${item.toppings.map((t: any) => t.topping?.name || t.name).join(', ')}` : null,
      item.special_instructions ? `Note: ${item.special_instructions}` : null
    ].filter(Boolean);

    return {
      id: item.id, // the cart_item id
      menuItemId: item.menu_item_id,
      name: (item.menu_item || item.menuItem)?.name || item.name || "Item",
      desc: descArr.join(' | '),
      price: parseFloat(item.total_price || (item.unit_price ? parseFloat(item.unit_price) * item.quantity : 0) || (item.menu_item || item.menuItem)?.price || 0),
      qty: item.quantity || 1,
      image: (item.menu_item || item.menuItem)?.image_url || (item.menu_item || item.menuItem)?.image || item.image || "/placeholder.png",
    };
  });

  const addToCart = async (item: any, explicitQty: number = 1, options: any = {}) => {
    try {
      // Read cart_id from localStorage (saved when cart was created on home page)
      let cartId = null;
      if (typeof window !== "undefined") {
        const local = localStorage.getItem("cart_id");
        if (local && local !== "undefined" && local !== "null") {
          cartId = parseInt(local);
        }
      }
      if (!cartId || isNaN(cartId)) {
        cartId = cartObj?.id || cartData?.id || cartData?.data?.id;
      }

      if (!cartId) {
        const createRes = await createCartMut({ order_type: "delivery", branch_id: 1 }).unwrap();
        const newCartId = createRes?.data?.id || createRes?.id;
        if (newCartId) {
          cartId = newCartId;
          if (typeof window !== "undefined") {
            localStorage.setItem("cart_id", String(newCartId));
          }
        }
      }

      if (!cartId) {
        toast.error("Could not initialize cart. Please try again.");
        return;
      }

      await addCartItemMut({
        cart_id: cartId,
        menu_item_id: item.id,
        quantity: explicitQty,
        size_id: options.size_id,
        cooking_preference_id: options.cooking_preference_id,
        spice_level_id: options.spice_level_id,
        toppings: options.toppings,
      }).unwrap();

      toast.success(`${item.name} added to cart!`);
      refetchCart();
    } catch (e) {
      console.error("Failed to add to cart", e);
      toast.error("Failed to add item to cart.");
    }
  };

  const updateQty = async (id: number, delta: number) => {
    const item = cartItems.find((i: any) => i.id === id);
    if (!item) return;
    const newQty = item.qty + delta;
    try {
      if (newQty <= 0) {
        await removeCartItemMut(id).unwrap();
      } else {
        await updateCartItemMut({ id, quantity: newQty }).unwrap();
      }
      refetchCart();
    } catch (e) {
      console.error("Failed to update cart qty", e);
    }
  };

  const { selectedBranch } = useBranchSelection();
  const distanceKm = selectedBranch?.distanceKm;
  const effectiveKm = distanceKm ?? (selectedBranch as any)?.dist ?? null;
  const distanceMiles = (distanceKm != null ? kmToMiles(distanceKm) : null) ?? 0;
  const { data: feeTierRes } = useMatchDeliveryFeeTierQuery({ distance: distanceMiles });

  const matchedFee = feeTierRes?.data?.fee;
  const deliveryFeeAmount = cartItems.length > 0
    ? (matchedFee != null ? parseFloat(String(matchedFee)) : parseFloat(String(cartObj?.delivery_fee || 0)))
    : 0;

  const subtotal = parseFloat(cartObj.subtotal || 0);
  const vat = parseFloat(cartObj.vat || 0);
  const baseTotal = parseFloat(cartObj.total || 0);
  const total = cartItems.length > 0 ? baseTotal + deliveryFeeAmount : 0;
  const loyaltyPointsEarned = cartObj.loyalty_points || 0;
  const loyaltyDiscount = parseFloat(cartObj.discount || 0);
  const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.qty, 0);

  const activeCategoryObj = categories?.find((c: any) => c.name === activeCategory);
  const activeCategoryId = activeCategoryObj?.id;
  // Reset active tag when category changes
  useEffect(() => {
    setActiveTagId(null);
  }, [activeCategoryId]);

  const { data: subcategoriesData } = useGetSubcategoriesQuery({ all: 1 });
  const subcategoriesListRaw = Array.isArray(subcategoriesData?.data) ? subcategoriesData.data : (subcategoriesData?.data?.data || []);
  const subcategoriesList = subcategoriesListRaw.filter((s: any) => s.category_id === activeCategoryId);

  const { data: menuItemsData, isLoading: isLoadingMenuItems } = useGetMenuItemsQuery(
    {
      category_id: searchQuery ? undefined : activeCategoryId,
      subcategory_id: activeSubcategory !== 'all' ? subcategoriesList.find((s: any) => s.name === activeSubcategory)?.id : undefined,
      search: searchQuery || undefined,
      per_page: 50
    },
    { skip: !searchQuery && !activeCategoryId }
  );

  const { data: popularMenuItemsData } = useGetMenuItemsQuery(
    {
      category_id: activeCategoryId,
      subcategory_id: activeSubcategory !== 'all' ? subcategoriesList.find((s: any) => s.name === activeSubcategory)?.id : undefined,
      search: searchQuery || undefined,
      is_popular: 1,
      per_page: 8
    },
    { skip: !activeCategoryId }
  );

  const { data: happyHourMenuItemsData } = useGetMenuItemsQuery(
    {
      category_id: activeCategoryId,
      subcategory_id: activeSubcategory !== 'all' ? subcategoriesList.find((s: any) => s.name === activeSubcategory)?.id : undefined,
      search: searchQuery || undefined,
      is_happy_hour_eligible: 1,
      per_page: 4
    },
    { skip: !activeCategoryId }
  );

  const { data: productDetails, isLoading: isLoadingDetails } = useGetMenuItemQuery(
    selectedProduct?.id,
    { skip: !selectedProduct?.id }
  );

  const { data: activeTagDetails, isFetching: isFetchingActiveTag } = useGetMenuItemQuery(
    activeTagId!,
    { skip: !activeTagId }
  );

  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/customer")) return url;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const formatItem = (item: any) => ({
    ...item,
    id: item.id,
    name: item.name,
    price: `£${item.discount_price || item.price || 0}`,
    oldPrice: (item.original_price && item.original_price !== item.price) ? `£${item.original_price}` : "",
    rating: item.rating ? parseFloat(item.rating).toFixed(1) : "0.0",
    image: getImageUrl(item.image_url || item.image)
  });

  const apiMenuItems = (Array.isArray(menuItemsData?.data) ? menuItemsData.data : (menuItemsData?.data?.data || [])).map(formatItem);


  const clean = (str?: string) => (str || "").replace(/\\/g, "");

  const happyHourRaw = Array.isArray(happyHourMenuItemsData?.data) ? happyHourMenuItemsData.data : (happyHourMenuItemsData?.data?.data || []);
  const happyHourItems = happyHourRaw.map(formatItem);

  const popularRaw = Array.isArray(popularMenuItemsData?.data) ? popularMenuItemsData.data : (popularMenuItemsData?.data?.data || []);
  const popularItems = popularRaw.map(formatItem);

  return (
    <div className="h-[100dvh] w-full bg-[#1E1E20] flex flex-col lg:flex-row text-white overflow-hidden font-sans select-none">
      {/* 1. Left Sidebar */}
      <div className="hidden lg:flex w-[240px] md:w-[260px] flex-shrink-0 border-r border-white/5 bg-[#1a1a1c] flex-col">
        {/* Logo */}
        <div className="h-[90px] flex items-center justify-center px-6 mt-4">
          <Link href="/home">
            <Image src="/logo.png" alt="Logo" width={130} height={80} priority />
          </Link>
        </div>
        <div className="border-b border-white/5  mt-4"></div>
        {/* Categories */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-6">
          <h3 className="text-white font-bold text-[18px] mb-4 pl-6">Menu Categories</h3>
          <div className="flex flex-col">
            {categories.map((cat: any, i: number) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.id || i}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center w-full px-6 py-4 transition-colors duration-200 group border-l-[4px] cursor-pointer ${
                    isActive ? "bg-[#EBE5E0] border-[#F9671A]" : "border-transparent hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`w-[22px] h-[22px] mr-4 flex items-center justify-center ${
                      isActive ? "text-[#F9671A]" : "text-zinc-500 group-hover:text-zinc-400"
                    }`}
                  >
                    {renderCategoryIcon(cat, isActive)}
                  </div>
                  <span className={`text-[16px] font-medium flex-1 text-left ${isActive ? "text-[#F9671A]" : "text-zinc-500 group-hover:text-zinc-400"}`}>
                    {cat.name}
                  </span>
                  {cat.hasDropdown && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`ml-2 ${isActive ? "text-[#F9671A]" : "text-zinc-500"}`}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {/* Logout Button */}
        <div className="p-6 border-t border-white/5 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors duration-200 group cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 transition-transform group-hover:-translate-x-1">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span className="font-medium text-[16px]">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          onProductClick={(product) => setSelectedProduct(product)}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />

        {/* Mobile Delivery Bar - Only visible on lg:hidden */}
        <div className="flex items-center gap-2 px-6 py-3 bg-[#1E1E20] border-b border-white/5 lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span className="text-zinc-400 text-xs font-medium">Delivery:</span>
          <span className="text-[#F9671A] text-xs font-semibold">Direct Street, Chicago</span>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative">
          {/* Main Content Area */}
          <main className="flex-1 h-auto lg:h-full px-4 sm:px-8 py-6 pb-20 overflow-visible lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* Banner */}
            <div className="w-full bg-gradient-to-r from-[#FFF8F4] to-[#FFB894] rounded-[16px] sm:rounded-[24px] pl-3 sm:pl-10 pr-0 py-0 flex items-center justify-between relative shadow-xl overflow-hidden border border-[#2d2d2d] flex-shrink-0 h-[100px] min-[400px]:h-[120px] sm:h-[180px] md:h-[220px] mb-6 sm:mb-8"
              style={{ background: 'linear-gradient(110deg, #1E1E20 0%, #1E1E20 45%, #6b2a0e 62%, #b05020 75%, #f5ece5 100%)' }}
            >
              <div className="flex-1 z-10 text-left py-1 sm:py-2 overflow-hidden pl-1 sm:pl-2">
                <p className="text-zinc-400 text-[8px] min-[400px]:text-[10px] sm:text-[16px] font-normal mb-0.5 sm:mb-1 whitespace-nowrap mt-1 sm:mt-2">
                  Order Restaurant food, takeaway and groceries.
                </p>

                <h1 className="text-white text-[12px] min-[400px]:text-[15px] sm:text-[36px] md:text-[52px] leading-[1.1] tracking-tight font-normal whitespace-nowrap">
                  Food ordering is now more
                </h1>

                <h1 className="text-[#F9671A] text-[13px] min-[400px]:text-[16px] sm:text-[38px] md:text-[46px] leading-[1.1] tracking-tight font-normal whitespace-nowrap">
                  personalized and instant
                </h1>

                <div className="relative max-w-[180px] min-[400px]:max-w-[220px] sm:max-w-[350px] mb-1 sm:mb-6 mt-1.5 sm:mt-2">
                  <span className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 text-[#F9671A] flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[10px] h-[10px] sm:w-[15px] sm:h-[15px]">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                    </svg>
                  </span>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Are you hungry...."
                    className="w-full rounded-full py-1 sm:py-2.5 pl-7 sm:pl-9 pr-3 sm:pr-4 text-[9px] sm:text-[13px] text-white placeholder:text-white/50 outline-none focus:ring-1 focus:ring-[#F9671A] whitespace-nowrap"
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
                  />
                </div>
              </div>

              <div className="h-full flex items-end justify-end relative z-10 flex-shrink-0 w-[110px] min-[400px]:w-[140px] sm:w-[320px] md:w-[400px]">
                <img src="/customer/banner-men.png" alt="Delivery Man" className="h-[85%] sm:h-[98%] w-auto object-contain object-bottom -mr-[35%] sm:-mr-[32%] z-0" />
                <img src="/customer/banner-woman.png" alt="Woman Eating" className="h-[90%] sm:h-[96%] w-auto object-contain object-bottom z-10" />
              </div>
            </div>

            {/* Subcategories (Tags) */}
            <div className="flex items-center gap-3 mb-6 overflow-x-auto scrollbar-hide pb-2">
              <button
                onClick={() => setActiveSubcategory('all')}
                className={`px-5 py-2.5 min-w-max rounded-full text-[14px] font-bold transition-all flex items-center justify-center cursor-pointer ${activeSubcategory === 'all'
                    ? "bg-white text-black shadow-md"
                    : "bg-[#212124] text-white hover:bg-[#2a2a2c] border border-white/5"
                  }`}
              >
                All Items
              </button>
              {subcategoriesList.map((item: any) => (
                <button
                  key={`sub-${item.id}`}
                  onClick={() => setActiveSubcategory(item.name)}
                  className={`px-5 py-2.5 min-w-max rounded-full text-[14px] font-bold transition-all flex items-center justify-center cursor-pointer ${activeSubcategory === item.name
                      ? "bg-white text-black shadow-md"
                      : "bg-[#212124] text-white hover:bg-[#2a2a2c] border border-white/5"
                    }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {searchQuery ? (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[19px] font-bold text-white">
                    Search Results for <span className="text-[#F9671A]">"{searchQuery}"</span>
                  </h2>
                  <span className="text-xs text-zinc-400 font-semibold">{apiMenuItems.length} Items</span>
                </div>
                {apiMenuItems.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {apiMenuItems.map((item: any) => (
                      <div key={`search-${item.id}`} className="bg-[#212124] rounded-[16px] overflow-hidden flex flex-col border border-white/5 group hover:border-[#F9671A]/30 transition-colors shadow-lg">
                        <div className="relative w-full aspect-[4/3] bg-[#1a1a1c] overflow-hidden">
                          <div className="absolute top-2.5 left-2.5 bg-[#1E1E20]/90 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold text-white z-10 shadow-md">
                            <Star size={12} className="text-[#F9671A] fill-[#F9671A]" /> {item.rating}
                          </div>
                          <button onClick={(e) => toggleWishlist(e, item)} className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-md z-20 border border-white/10 transition-colors shadow-lg cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted(item.id) ? "#F9671A" : "currentColor"} stroke={isWishlisted(item.id) ? "#F9671A" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isWishlisted(item.id) ? "text-[#F9671A]" : "text-white"}>
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                            </svg>
                          </button>
                          <FoodItemImage src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500 z-0" />
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="text-[14px] font-bold text-white mb-1.5 truncate">{item.name}</h3>
                          <div className="flex items-center gap-1.5 text-xs mb-4">
                            <span className="font-extrabold text-[#F9671A]">{item.price}</span>
                            {item.oldPrice && <span className="text-zinc-500 line-through text-[11px]">{item.oldPrice}</span>}
                          </div>
                          <button onClick={() => { setSelectedProduct(item); setModalQty(1); }} className="mt-auto w-full py-2 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                            Add to cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 border border-white/5 rounded-[16px] bg-[#1a1a1c]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 mb-3">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </svg>
                    <p className="text-zinc-300 font-bold text-base mb-1">No items found</p>
                    <p className="text-zinc-500 text-xs">We couldn't find any menu items matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Happy Hour Section - Only displayed when happy hour items are available */}
                {happyHourItems.length > 0 && (
                  <div className="mb-10">
                    <div className="flex flex-row items-center justify-between sm:justify-start gap-2 sm:gap-4 mb-6">
                      <h2 className="text-[12px] min-[375px]:text-[13px] min-[400px]:text-[15px] sm:text-[17px] font-bold text-white flex items-center whitespace-nowrap">
                        Happy hour pricing: <span className="text-[#F9671A] ml-1 sm:ml-2 font-mono">{formattedHappyHourTime}</span>
                      </h2>
                      <div className="bg-[#3a2016] text-[#F9671A] border border-[#F9671A]/20 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full whitespace-nowrap">
                        35% OFF
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {happyHourItems.map((item: any) => (
                        <div key={`happy-${item.id}`} className="bg-[#212124] rounded-[16px] overflow-hidden flex flex-col border border-white/5 group hover:border-[#F9671A]/30 transition-colors shadow-lg">
                          <div className="relative w-full aspect-[4/3] bg-[#1a1a1c] overflow-hidden">
                            <div className="absolute top-2.5 left-2.5 bg-[#1E1E20]/90 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold text-white z-10 shadow-md">
                              <Star size={12} className="text-[#F9671A] fill-[#F9671A]" /> {item.rating}
                            </div>

                            <FoodItemImage src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500 z-0" />
                          </div>
                          <div className="p-4 flex flex-col flex-1">
                            <h3 className="text-[14px] font-bold text-white mb-1.5 truncate">{item.name}</h3>
                            <div className="flex items-center gap-1.5 text-xs mb-4">
                              <span className="font-extrabold text-[#F9671A]">{item.price}</span>
                              <span className="text-zinc-500 line-through text-[11px]">{item.oldPrice}</span>
                              <span className="text-zinc-400 text-[11px]">/portion</span>
                            </div>
                            <button onClick={() => { setSelectedProduct(item); setModalQty(1); }} className="mt-auto w-full py-2 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                              Add to cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Most popular Steaks Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[19px] font-bold text-white">Most popular {activeCategory}</h2>
                  <button className="bg-white/5 border border-white/10 text-white text-[12px] font-medium px-4 py-1.5 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer">
                    Sort
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M7 12h10"></path><path d="M10 18h4"></path></svg>
                  </button>
                </div>

                {/* Most Popular Grid */}
                {popularItems.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {popularItems.map((item: any) => (
                      <div key={`pop-${item.id}`} className="bg-[#212124] rounded-[16px] overflow-hidden flex flex-col border border-white/5 group hover:border-[#F9671A]/30 transition-colors shadow-lg">
                        <div className="relative w-full aspect-[4/3] bg-[#1a1a1c] overflow-hidden">
                          <div className="absolute top-2.5 left-2.5 bg-[#1E1E20]/90 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold text-white z-10 shadow-md">
                            <Star size={12} className="text-[#F9671A] fill-[#F9671A]" /> {item.rating}
                          </div>
                          <button onClick={(e) => toggleWishlist(e, item)} className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-md z-20 border border-white/10 transition-colors shadow-lg cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted(item.id) ? "#F9671A" : "currentColor"} stroke={isWishlisted(item.id) ? "#F9671A" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isWishlisted(item.id) ? "text-[#F9671A]" : "text-white"}>
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                            </svg>
                          </button>
                          <FoodItemImage src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500 z-0" />
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="text-[14px] font-bold text-white mb-1.5 truncate">{item.name}</h3>
                          <div className="flex items-center gap-1.5 text-xs mb-4">
                            <span className="font-extrabold text-[#F9671A]">{item.price}</span>
                            <span className="text-zinc-500 line-through text-[11px]">{item.oldPrice}</span>
                            <span className="text-zinc-400 text-[11px]">/portion</span>
                          </div>
                          <button onClick={() => { setSelectedProduct(item); setModalQty(1); }} className="mt-auto w-full py-2 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                            Add to cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 border border-white/5 rounded-[16px] bg-[#1a1a1c]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 mb-3"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                    <p className="text-zinc-400 font-medium text-sm">No popular items found for this category.</p>
                  </div>
                )}
              </>
            )}

          </main>

          {/* Right Sidebar (Cart) */}
          <aside className="w-full lg:w-[355px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 bg-[#1E1E20] flex flex-col h-auto lg:h-full">
            <div className="p-6 pb-2 flex items-center justify-between border-b border-white/5 mx-6 px-0 mb-4 h-[70px] flex-shrink-0">
              <h2 className="text-[17px] font-bold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                  <path d="M3 6h18"></path>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Order Carts
              </h2>
              <div className="bg-[#3a2016] text-[#F9671A] text-[10px] font-extrabold px-2 py-0.5 rounded border border-[#F9671A]/20">
                {totalItems} ITEMS
              </div>
            </div>

            <div className="flex-1 overflow-visible lg:overflow-y-auto px-6 flex flex-col gap-6 scrollbar-hide">
              {/* Cart Items */}
              <div className="flex flex-col gap-5">
                {cartItems.length === 0 && (
                  <div className="text-zinc-500 text-center py-4 text-sm font-medium">Cart is empty.</div>
                )}
                {cartItems.map((item: any) => (
                  <div key={`cart-${item.id}`} className="flex gap-3">
                    <div className="w-[60px] h-[60px] rounded-[12px] bg-[#2a2a2c] overflow-hidden flex-shrink-0 relative">
                      <FoodItemImage src={item.image} alt={item.name} className="w-full h-full object-cover" iconSize={20} />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-[13px] font-bold text-white leading-tight mb-1">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-zinc-400">{item.desc}</p>
                        </div>
                        <span className="text-[14px] font-extrabold text-[#F9671A]">£{item.price}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <button onClick={() => updateQty(item.id, -1)} className="w-5 h-5 rounded flex items-center justify-center border border-white/20 text-white hover:bg-white/10 cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path></svg>
                        </button>
                        <span className="text-[13px] font-bold text-white">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-5 h-5 rounded flex items-center justify-center border border-white/20 text-white hover:bg-white/10 cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Loyalty Points */}
              <div className="bg-[#2a2a2c] rounded-[16px] p-4 flex gap-3 items-center border border-white/5">
                <div className="w-10 h-10 rounded-full bg-[#3a2016] flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#F9671A" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-white mb-0.5">You'll earn {loyaltyPointsEarned} loyalty points</h4>
                  <p className="text-[10px] text-zinc-400">1 point per £10 spends - 100 points = £1 discount</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-6 border-t border-white/5 mt-auto bg-[#1a1a1c]/50">
              <div className="flex flex-col gap-3 mb-5">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="font-medium text-white">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-zinc-400">Delivery fee</span>
                  <span className="font-medium text-white">{cartItems.length === 0 ? "£0.00" : deliveryFeeAmount > 0 ? `£${deliveryFeeAmount.toFixed(2)}` : "Free"}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-zinc-400">Incl. VAT</span>
                  <span className="font-medium text-white">£{cartItems.length > 0 ? vat.toFixed(2) : "0.00"}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-zinc-400">Loyalty discount</span>
                  <span className="font-medium text-white">{loyaltyDiscount > 0 ? `-£${loyaltyDiscount.toFixed(2)}` : "00.00"}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] mt-1">
                  <span className="text-zinc-400">Use loyalty points</span>
                  <div className="w-8 h-4 bg-zinc-700 rounded-full relative cursor-pointer">
                    <div className="w-3 h-3 bg-zinc-400 rounded-full absolute left-0.5 top-0.5"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mb-5 pt-4 border-t border-white/10">
                <span className="text-[16px] font-bold text-white">Total</span>
                <span className="text-[18px] font-extrabold text-[#F9671A]">£{total.toFixed(2)}</span>
              </div>
              {cartItems.length === 0 ? (
                <button disabled className="w-full py-3.5 bg-[#F9671A]/30 text-white rounded-full text-[14px] font-bold cursor-not-allowed">
                  Your bag is empty
                </button>
              ) : (
                <button onClick={() => router.push("/checkout")} className="w-full py-3.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[14px] font-bold transition-colors shadow-lg shadow-orange-600/20 cursor-pointer">
                  Proceed to checkout
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed top-0 left-0 bottom-0 right-0 lg:right-[355px] z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-hidden">
          <div className="relative w-full max-w-[600px] max-h-[90vh] bg-[#1a1a1c] border border-white/10 rounded-[24px] flex flex-col shadow-2xl">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-5 right-5 text-zinc-400 hover:text-white bg-[#212124] p-1.5 rounded-full border border-white/10 z-20 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {/* Header */}
              <div className="flex flex-col sm:flex-row gap-5 mb-8">
                <div className="relative w-full sm:w-[220px] h-[160px] rounded-[16px] overflow-hidden flex-shrink-0 bg-[#212124]">
                  <FoodItemImage src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" iconSize={40} />
                  <div className="absolute top-3 left-3 bg-[#1E1E20]/90 backdrop-blur-md px-2 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1 border border-white/10">
                    <Star size={12} className="text-[#F9671A] fill-[#F9671A]" /> {selectedProduct.rating}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#1E1E20]/90 backdrop-blur-md p-1.5 rounded-full text-white border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                  </div>
                </div>
                <div className="flex-1 pr-6">
                  <h2 className="text-[22px] font-bold text-white mb-3 leading-tight">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-3 text-[12px] text-zinc-400 mb-3">
                    <span>Distance: 2.3 km</span>
                    <span>Estimated Time: <span className="text-[#F9671A]">25-30 mins</span></span>
                  </div>
                  <p className="text-[13px] text-zinc-400 leading-relaxed mb-4">Premium center-cut filet mignon grilled to perfection with garlic herb butter. Tender, juicy, and rich in flavor.</p>
                  <div className="text-[24px] font-extrabold text-[#F9671A]">
                    {(() => {
                      const basePrice = parseFloat((selectedProduct.price || "").replace('£', '')) || 0;
                      const sizeExtra = selectedSize ? parseFloat(selectedSize.extra_price || 0) : 0;
                      const toppingsExtra = selectedToppings.reduce((sum: number, t: any) => sum + parseFloat(t.price || 0), 0);
                      const unitPrice = basePrice + sizeExtra + toppingsExtra;
                      return `£${unitPrice.toFixed(2)}`;
                    })()}
                  </div>
                </div>
              </div>

              {/* Choose Size */}
              {(productDetails?.data?.sizes || selectedProduct?.sizes)?.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-[16px] font-bold text-white">Choose Size</h3>
                    <span className="text-[#F9671A] bg-[#F9671A]/10 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Required</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(productDetails?.data?.sizes || selectedProduct?.sizes).map((size: any) => {
                      const isSelected = selectedSize?.id === size.id;
                      return (
                        <div key={size.id} onClick={() => setSelectedSize(size)} className={`relative p-3.5 rounded-[16px] cursor-pointer flex flex-col transition-all ${isSelected ? 'bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] shadow-lg border border-[#F9671A]/30' : 'border border-white/5 bg-[#212124] hover:border-white/10'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[15px] font-bold text-white">{size.name}</span>
                            {isSelected ? (
                              <div className="w-5 h-5 bg-[#F9671A] rounded-full flex items-center justify-center shadow-md"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-zinc-500"></div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] text-zinc-400">{size.size_description}</span>
                            {parseFloat(size.extra_price) > 0 && (
                              <span className="text-[12px] text-[#F9671A] font-semibold">+£{size.extra_price}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cooking Preference */}
              {(productDetails?.data?.cooking_preferences || selectedProduct?.cooking_preferences)?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[16px] font-bold text-white mb-4">Cooking Preference</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {(productDetails?.data?.cooking_preferences || selectedProduct?.cooking_preferences).map((pref: any) => {
                      const isSelected = selectedCookingPref?.id === pref.id;
                      return (
                        <button key={pref.id} onClick={() => setSelectedCookingPref(pref)} className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-colors ${isSelected ? 'bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] text-white shadow-md border border-[#F9671A]/30' : 'border border-white/5 bg-[#212124] text-zinc-300 hover:border-white/10 hover:text-white'}`}>
                          {isSelected && <div className="w-4 h-4 bg-[#F9671A] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>}
                          {pref.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Spice Level */}
              {(productDetails?.data?.spice_levels || selectedProduct?.spice_levels)?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[16px] font-bold text-white mb-4">Spice Level</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {(productDetails?.data?.spice_levels || selectedProduct?.spice_levels).map((spice: any) => {
                      const isSelected = selectedSpiceLevel?.id === spice.id;
                      return (
                        <button key={spice.id} onClick={() => setSelectedSpiceLevel(spice)} className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-colors ${isSelected ? 'bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] text-white shadow-md border border-[#F9671A]/30' : 'border border-white/5 bg-[#212124] text-zinc-300 hover:border-white/10 hover:text-white'}`}>
                          {isSelected && <div className="w-4 h-4 bg-[#F9671A] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>}
                          {spice.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Modify Toppings */}
              {(productDetails?.data?.toppings || selectedProduct?.toppings)?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[16px] font-bold text-white mb-4">Modify Toppings</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {(productDetails?.data?.toppings || selectedProduct?.toppings).map((topping: any) => {
                      const isSelected = selectedToppings.some((t: any) => t.id === topping.id);
                      return (
                        <button key={topping.id} onClick={() => {
                          if (isSelected) {
                            setSelectedToppings(selectedToppings.filter((t: any) => t.id !== topping.id));
                          } else {
                            setSelectedToppings([...selectedToppings, topping]);
                          }
                        }} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-colors ${isSelected ? 'bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] text-white shadow-md border border-[#F9671A]/30' : 'border border-white/5 bg-[#212124] text-zinc-300 hover:border-white/10 hover:text-white'}`}>
                          {isSelected && <div className="w-4 h-4 bg-[#F9671A] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>}
                          {topping.name} {parseFloat(topping.price) > 0 && <span className={isSelected ? 'text-zinc-300 font-medium' : 'text-zinc-500 font-medium'}>+£{topping.price}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}




            </div>

            {/* Footer */}
            <div className="p-5 bg-[#1E1E20] border-t border-white/5 flex items-center gap-4 flex-shrink-0 rounded-b-[24px]">
              <div className="bg-[#2a2a2c] rounded-full flex items-center px-2 py-2 gap-5 border border-white/5">
                <button onClick={() => setModalQty(Math.max(1, modalQty - 1))} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path></svg>
                </button>
                <span className="text-[16px] font-bold text-white w-2 text-center">{modalQty}</span>
                <button onClick={() => setModalQty(modalQty + 1)} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                </button>
              </div>
              <button
                onClick={() => {
                  const opts = {
                    size_id: selectedSize?.id,
                    cooking_preference_id: selectedCookingPref?.id,
                    spice_level_id: selectedSpiceLevel?.id,
                    toppings: selectedToppings.map((t: any) => t.id),
                  };

                  addToCart(selectedProduct, modalQty, opts);
                  setSelectedProduct(null);
                }}
                className="flex-1 bg-[#F9671A] text-white py-3.5 rounded-full font-bold text-[15px] hover:bg-[#ff7a33] transition shadow-lg shadow-orange-600/20 cursor-pointer "
              >
                {(() => {
                  const basePrice = parseFloat((selectedProduct.price || "").replace('£', '')) || 0;
                  const sizeExtra = selectedSize ? parseFloat(selectedSize.extra_price || 0) : 0;
                  const toppingsExtra = selectedToppings.reduce((sum: number, t: any) => sum + parseFloat(t.price || 0), 0);
                  const total = (basePrice + sizeExtra + toppingsExtra) * modalQty;
                  return `Add to Cart - £${total.toFixed(2)}`;
                })()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer (Sidebar Categories) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-[280px] max-w-[80vw] bg-[#1a1a1c] h-full flex flex-col shadow-2xl border-r border-white/5 z-10 transition-transform duration-300 translate-x-0">
            {/* Header / Logo */}
            <div className="h-[70px] flex items-center justify-between px-5 border-b border-white/5">
              <Link href="/home" onClick={() => setIsMobileSidebarOpen(false)}>
                <Image src="/logo.png" alt="Logo" width={90} height={50} priority className="object-contain" />
              </Link>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer bg-white/5 p-1.5 rounded-full border border-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>

            {/* Navigation / Categories */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pt-6">
              <h3 className="text-white font-bold text-[16px] mb-4 px-6 uppercase tracking-wider text-zinc-500">Menu Categories</h3>
              <div className="flex flex-col">
                {categories.map((cat: any, i: number) => {
                  const isActive = activeCategory === cat.name;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveCategory(cat.name);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`flex items-center w-full px-6 py-4 transition-colors duration-200 group border-l-[4px] cursor-pointer ${isActive ? "bg-[#EBE5E0] border-[#F9671A]" : "border-transparent hover:bg-white/5"
                        }`}
                    >
                      <div className={`w-[22px] h-[22px] mr-4 flex items-center justify-center ${isActive ? "text-[#F9671A]" : "text-zinc-500"}`}>
                        {renderCategoryIcon(cat, isActive)}
                      </div>
                      <span className={`text-[16px] font-medium flex-1 text-left ${isActive ? "text-[#F9671A]" : "text-zinc-500"}`}>
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
