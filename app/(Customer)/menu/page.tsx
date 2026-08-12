"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { useGetCategoriesQuery } from "../../../redux/features/api/categoriesApi";
import { useGetSubcategoriesQuery } from "../../../redux/features/api/subcategoriesApi";
import { useGetMenuItemsQuery, useGetMenuItemQuery } from "../../../redux/features/api/menuItemsApi";
import { useGetCartQuery, useAddCartItemMutation, useUpdateCartItemMutation, useRemoveCartItemMutation } from "../../../redux/features/api/cartApi";
import { useGetWishlistQuery, useToggleWishlistMutation } from "../../../redux/features/api/wishlistApi";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/features/slice/authSlice";
import { useLogoutMutation } from "../../../redux/features/api/authApi";
import { toast } from "react-hot-toast";
import Header from "../components/Header";

export default function MenuPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [logoutApi] = useLogoutMutation();
  const categoryParam = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam || null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTagId, setActiveTagId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalQty, setModalQty] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [selectedCookingPref, setSelectedCookingPref] = useState<any>(null);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<any>(null);
  const [selectedToppings, setSelectedToppings] = useState<any[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    setSelectedSize(null);
    setSelectedCookingPref(null);
    setSelectedSpiceLevel(null);
    setSelectedToppings([]);
    setSpecialInstructions("");
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

  const cartItems = (cartData?.items || cartData?.data?.items || []).map((item: any) => {
    const descArr = [
      (item.size || item.size)?.name,
      (item.cooking_preference || item.cookingPreference)?.name,
      (item.spice_level || item.spiceLevel)?.name,
      item.toppings?.length > 0 ? `Toppings: ${item.toppings.map((t:any) => t.topping?.name).join(', ')}` : null,
      item.special_instructions ? `Note: ${item.special_instructions}` : null
    ].filter(Boolean);

    return {
      id: item.id, // the cart_item id
      menuItemId: item.menu_item_id,
      name: (item.menu_item || item.menuItem)?.name,
      desc: descArr.join(' | '),
      price: parseFloat(item.unit_price || (item.menu_item || item.menuItem)?.price || 0),
      qty: item.quantity,
      image: (item.menu_item || item.menuItem)?.image_url || "/placeholder.png",
    };
  });

  const addToCart = async (item: any, explicitQty: number = 1, options: any = {}) => {
    try {
      const cartId = cartData?.id || cartData?.data?.id;
      if (!cartId) {
        console.error("Cart not initialized yet");
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
        special_instructions: options.special_instructions
      }).unwrap();
      
      refetchCart();
    } catch (e) {
      console.error("Failed to add to cart", e);
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

  const cartObj = cartData?.data || cartData || {};
  const subtotal = parseFloat(cartObj.subtotal || 0);
  const vat = parseFloat(cartObj.vat || 0);
  const total = parseFloat(cartObj.total || 0);
  const loyaltyPointsEarned = cartObj.loyalty_points || 0;
  const loyaltyDiscount = parseFloat(cartObj.discount || 0);
  const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.qty, 0);

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case "Steaks": return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="w-full h-full">
          <path d="M13.6667 11.4168C14.3502 10.9031 14.9023 10.235 15.2781 9.46696C15.6538 8.69896 15.8424 7.85293 15.8284 6.99807C15.8144 6.1432 15.5983 5.30379 15.1977 4.54848C14.7971 3.79317 14.2233 3.14342 13.5234 2.65238C12.8235 2.16134 12.0173 1.84295 11.1707 1.72326C10.3242 1.60357 9.46132 1.68598 8.65272 1.96374C7.84411 2.2415 7.11275 2.70673 6.51844 3.32137C5.92413 3.93601 5.48375 4.68261 5.23334 5.50009C4.31667 8.10843 4.58334 8.7501 2.58334 10.5668C2.18481 10.8935 1.89698 11.3354 1.75926 11.832C1.62154 12.3286 1.64065 12.8556 1.81398 13.3409C1.98731 13.8263 2.30638 14.2462 2.72753 14.5432C3.14868 14.8402 3.65133 14.9998 4.16667 15.0001C7.5 15.0001 11.1667 13.5001 13.6667 11.4168Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15.4167 5L17.2417 8.75C17.591 9.82405 17.5948 10.9806 17.2524 12.0569C16.9101 13.1332 16.2389 14.0751 15.3333 14.75C12.8333 16.8333 9.16667 18.3333 5.83333 18.3333C5.36937 18.3327 4.91475 18.203 4.52032 17.9587C4.12589 17.7144 3.80723 17.3651 3.6 16.95L2 13.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.4167 9.16667C11.5673 9.16667 12.5 8.23393 12.5 7.08333C12.5 5.93274 11.5673 5 10.4167 5C9.26611 5 8.33337 5.93274 8.33337 7.08333C8.33337 8.23393 9.26611 9.16667 10.4167 9.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      case "Starters": return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="w-full h-full">
          <path d="M10 17.5C11.9891 17.5 13.8968 16.7098 15.3033 15.3033C16.7098 13.8968 17.5 11.9891 17.5 10H2.5C2.5 11.9891 3.29018 13.8968 4.6967 15.3033C6.10322 16.7098 8.01088 17.5 10 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.83337 17.5H14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.25 10L18.3333 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.5417 2.5C13.7667 2.58333 14.2083 2.94167 14.1667 3.63333C14.1167 4.325 13.3917 4.63333 13.3333 5.31667C13.2917 5.96667 13.6167 6.35 13.9417 6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.37504 2.5C9.60004 2.58333 10.0417 2.94167 9.99171 3.63333C9.95004 4.325 9.21671 4.63333 9.17504 5.31667C9.12504 5.96667 9.45004 6.35 9.77504 6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.20829 2.5C5.43329 2.58333 5.87496 2.94167 5.83329 3.63333C5.78329 4.325 5.05829 4.63333 4.99996 5.31667C4.95829 5.96667 5.28329 6.35 5.61662 6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      case "Sides": return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="w-full h-full">
          <path d="M9.99996 13.3333H3.33329C2.89127 13.3333 2.46734 13.1577 2.15478 12.8452C1.84222 12.5326 1.66663 12.1087 1.66663 11.6667C1.66663 11.2246 1.84222 10.8007 2.15478 10.4882C2.46734 10.1756 2.89127 10 3.33329 10H16.6666C17.1087 10 17.5326 10.1756 17.8451 10.4882C18.1577 10.8007 18.3333 11.2246 18.3333 11.6667C18.3333 12.1087 18.1577 12.5326 17.8451 12.8452C17.5326 13.1577 17.1087 13.3333 16.6666 13.3333H13.125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.16667 10C3.72464 10 3.30072 9.8244 2.98816 9.51184C2.67559 9.19928 2.5 8.77536 2.5 8.33333C2.5 6.78624 3.29018 5.30251 4.6967 4.20854C6.10322 3.11458 8.01088 2.5 10 2.5C11.9891 2.5 13.8968 3.11458 15.3033 4.20854C16.7098 5.30251 17.5 6.78624 17.5 8.33333C17.5 8.77536 17.3244 9.19928 17.0118 9.51184C16.6993 9.8244 16.2754 10 15.8333 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.16667 13.3335C3.72464 13.3335 3.30072 13.5091 2.98816 13.8217C2.67559 14.1342 2.5 14.5581 2.5 15.0002C2.5 15.6632 2.76339 16.2991 3.23223 16.7679C3.70107 17.2368 4.33696 17.5002 5 17.5002H15C15.663 17.5002 16.2989 17.2368 16.7678 16.7679C17.2366 16.2991 17.5 15.6632 17.5 15.0002C17.5 14.5581 17.3244 14.1342 17.0118 13.8217C16.6993 13.5091 16.2754 13.3335 15.8333 13.3335" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.55835 10L10.6667 13.8333C11.0203 14.0986 11.4648 14.2124 11.9024 14.1499C12.1191 14.119 12.3275 14.0456 12.5158 13.9341C12.7042 13.8226 12.8687 13.6751 13 13.5L15.625 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      case "Drinks": return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="w-full h-full">
          <path d="M6.66663 18.3335H13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.83337 8.3335H14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 12.5V18.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 12.4998C11.1051 12.4998 12.1649 12.0609 12.9463 11.2794C13.7277 10.498 14.1667 9.43824 14.1667 8.33317C14.1667 6.6665 13.75 4.99984 12.5 1.6665H7.50004C6.25004 4.99984 5.83337 6.6665 5.83337 8.33317C5.83337 9.43824 6.27236 10.498 7.05376 11.2794C7.83516 12.0609 8.89497 12.4998 10 12.4998Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      case "Desserts": return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="w-full h-full">
          <path d="M6.66671 17.4998H13.3334M10 14.9998V17.4998M4.28337 9.16643C4.15404 8.7312 4.1281 8.27178 4.20763 7.82475C4.28715 7.37773 4.46995 6.95544 4.74146 6.59152C5.01296 6.2276 5.36568 5.93209 5.77154 5.72852C6.17739 5.52495 6.62516 5.41895 7.07921 5.41895C7.53325 5.41895 7.98103 5.52495 8.38688 5.72852C8.79273 5.93209 9.14545 6.2276 9.41696 6.59152C9.68847 6.95544 9.87126 7.37773 9.95079 7.82475C10.0303 8.27178 10.0044 8.7312 9.87504 9.16643M10 14.1664C14.1667 14.1664 16.6667 11.9248 16.6667 9.16643H3.33337C3.33337 11.9248 5.83337 14.1664 10 14.1664Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.1167 9.16643C9.98735 8.7312 9.96141 8.27178 10.0409 7.82475C10.1205 7.37773 10.3033 6.95544 10.5748 6.59152C10.8463 6.2276 11.199 5.93209 11.6048 5.72852C12.0107 5.52495 12.4585 5.41895 12.9125 5.41895C13.3666 5.41895 13.8143 5.52495 14.2202 5.72852C14.626 5.93209 14.9788 6.2276 15.2503 6.59152C15.5218 6.95544 15.7046 7.37773 15.7841 7.82475C15.8636 8.27178 15.8377 8.7312 15.7083 9.16643" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12.9167 5.41667C12.9167 5.03364 12.8413 4.65437 12.6947 4.30051C12.5481 3.94664 12.3333 3.62511 12.0624 3.35427C11.7916 3.08343 11.4701 2.86859 11.1162 2.72202C10.7623 2.57544 10.3831 2.5 10 2.5C9.61702 2.5 9.23775 2.57544 8.88388 2.72202C8.53001 2.86859 8.20848 3.08343 7.93765 3.35427C7.66681 3.62511 7.45197 3.94664 7.30539 4.30051C7.15882 4.65437 7.08337 5.03364 7.08337 5.41667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      case "Lunch Special": return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="w-full h-full">
          <g clipPath="url(#clip0_253_1448)">
            <path d="M9.18084 2.34488C9.21654 2.15372 9.31798 1.98106 9.46758 1.85681C9.61719 1.73256 9.80553 1.66455 10 1.66455C10.1945 1.66455 10.3828 1.73256 10.5324 1.85681C10.682 1.98106 10.7835 2.15372 10.8192 2.34488L11.695 6.97655C11.7572 7.30584 11.9172 7.60873 12.1542 7.84569C12.3912 8.08265 12.694 8.24267 13.0233 8.30488L17.655 9.18071C17.8462 9.21642 18.0188 9.31786 18.1431 9.46746C18.2673 9.61706 18.3353 9.80541 18.3353 9.99988C18.3353 10.1943 18.2673 10.3827 18.1431 10.5323C18.0188 10.6819 17.8462 10.7833 17.655 10.819L13.0233 11.6949C12.694 11.7571 12.3912 11.9171 12.1542 12.1541C11.9172 12.391 11.7572 12.6939 11.695 13.0232L10.8192 17.6549C10.7835 17.846 10.682 18.0187 10.5324 18.1429C10.3828 18.2672 10.1945 18.3352 10 18.3352C9.80553 18.3352 9.61719 18.2672 9.46758 18.1429C9.31798 18.0187 9.21654 17.846 9.18084 17.6549L8.305 13.0232C8.2428 12.6939 8.08277 12.391 7.84581 12.1541C7.60885 11.9171 7.30596 11.7571 6.97667 11.6949L2.345 10.819C2.15384 10.7833 1.98118 10.6819 1.85693 10.5323C1.73269 10.3827 1.66467 10.1943 1.66467 9.99988C1.66467 9.80541 1.73269 9.61706 1.85693 9.46746C1.98118 9.31786 2.15384 9.21642 2.345 9.18071L6.97667 8.30488C7.30596 8.24267 7.60885 8.08265 7.84581 7.84569C8.08277 7.60873 8.2428 7.30584 8.305 6.97655L9.18084 2.34488Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.6666 1.6665V4.99984" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.3333 3.3335H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.33329 18.3333C4.25377 18.3333 4.99996 17.5871 4.99996 16.6667C4.99996 15.7462 4.25377 15 3.33329 15C2.41282 15 1.66663 15.7462 1.66663 16.6667C1.66663 17.5871 2.41282 18.3333 3.33329 18.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_253_1448">
              <rect width="20" height="20" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      );
      default: return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="12" cy="12" r="10" /></svg>
      );
    }
  };

  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery({ all: 1 });
  
  const fallbackCategories: { name: string; icon: string; hasDropdown?: boolean }[] = [
    { name: "Steaks", icon: "/customer/menu/steaks.svg" },
    { name: "Starters", icon: "/customer/menu/starters.svg" },
    { name: "Sides", icon: "/customer/menu/sides.svg" },
    { name: "Drinks", icon: "/customer/menu/drinks.svg" },
    { name: "Desserts", icon: "/customer/menu/desserts.svg" },
    { name: "Lunch Special", icon: "/customer/menu/lunch.svg" },
  ];

  const categories = categoriesData?.data?.length > 0 ? categoriesData.data : fallbackCategories;

  useEffect(() => {
    // If there's no active category set yet, we set it to the first available one
    if (!activeCategory && categories?.length > 0) {
      setActiveCategory(categories[0].name);
    }
  }, [categories]);

  // Handle URL param changes dynamically without locking
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
      // We don't need to replaceState anymore because we initialized state with categoryParam
      // and if the user clicks another category, setActiveCategory will just update the state
      // while the URL might still have ?category=... which is fine for deep linking
    }
  }, [categoryParam]);

  const renderCategoryIcon = (cat: any, isActive: boolean) => {
    const knownCategories = ["Steaks", "Starters", "Sides", "Drinks", "Desserts", "Lunch Special"];
    if (knownCategories.includes(cat.name)) {
      return getCategoryIcon(cat.name);
    }
    if (cat.icon) {
      const imgSrc = cat.icon.startsWith('http') ? cat.icon : `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}${cat.icon}`;
      return <img src={imgSrc} alt={cat.name} className={`w-full h-full object-contain ${isActive ? "" : "opacity-70 group-hover:opacity-100"}`} />;
    }
    return getCategoryIcon(cat.name);
  };

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
      category_id: activeCategoryId, 
      subcategory_id: activeSubcategory !== 'all' ? subcategoriesList.find((s: any) => s.name === activeSubcategory)?.id : undefined,
      search: searchQuery || undefined,
      per_page: 50 
    },
    { skip: !activeCategoryId }
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

  const steaks = [
    { id: 1, name: "Grilled chicken pieces", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/happypricing-1.png" },
    { id: 2, name: "Ribeye Steak", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/happypricing-2.png" },
    { id: 3, name: "Vegetable Stir Fry", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/happypricing-3.png" },
    { id: 4, name: "Pork Belly Bao", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/happypricing-4.png" },
  ];

  const popularSteaks = [
    { id: 5, name: "Filet Mignon", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/most-popular-1.png" },
    { id: 6, name: "Ribeye Steak", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/most-popular-2.png" },
    { id: 7, name: "Vegetable Stir Fry", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/most-popular-3.png" },
    { id: 8, name: "Pork Belly Bao", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/most-popular-4.png" },
    { id: 9, name: "New York Strip Steak", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/most-popular-5.png" },
    { id: 10, name: "T-Bone Steak", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/most-popular-6.png" },
    { id: 11, name: "Sirloin Steak", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/most-popular-7.png" },
    { id: 12, name: "Chateaubriand", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/most-popular-8.png" },
  ];

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
                  key={i}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center w-full px-6 py-4 transition-colors duration-200 group border-l-[4px] cursor-pointer ${isActive ? "bg-[#EBE5E0] border-[#F9671A]" : "border-transparent hover:bg-white/5"
                    }`}
                >
                  <div className={`w-[22px] h-[22px] mr-4 flex items-center justify-center ${isActive ? "text-[#F9671A]" : "text-zinc-500 group-hover:text-zinc-400"}`}>
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
          <header className="h-[70px] flex items-center justify-between px-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <h1 className="text-[20px] font-bold">Menu</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer lg:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
              </button>
            </div>
          </header>

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
                className={`px-5 py-2.5 min-w-max rounded-full text-[14px] font-bold transition-all flex items-center justify-center cursor-pointer ${
                  activeSubcategory === 'all'
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
                  className={`px-5 py-2.5 min-w-max rounded-full text-[14px] font-bold transition-all flex items-center justify-center cursor-pointer ${
                    activeSubcategory === item.name
                      ? "bg-white text-black shadow-md"
                      : "bg-[#212124] text-white hover:bg-[#2a2a2c] border border-white/5"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Happy Hour Section */}
            <div className="flex flex-row items-center justify-between sm:justify-start gap-2 sm:gap-4 mb-6">
              <h2 className="text-[12px] min-[375px]:text-[13px] min-[400px]:text-[15px] sm:text-[17px] font-bold text-white flex items-center whitespace-nowrap">
                Happy hour pricing: <span className="text-[#F9671A] ml-1 sm:ml-2">03h : 22m : 31s</span>
              </h2>
              <div className="bg-[#3a2016] text-[#F9671A] border border-[#F9671A]/20 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full whitespace-nowrap">
                35% OFF
              </div>
            </div>

            {/* Happy Hour Grid */}
            {happyHourItems.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {happyHourItems.map((item: any) => (
                  <div key={`happy-${item.id}`} className="bg-[#212124] rounded-[16px] overflow-hidden flex flex-col border border-white/5 group hover:border-[#F9671A]/30 transition-colors shadow-lg">
                    <div className="relative w-full aspect-[4/3] bg-[#1a1a1c] overflow-hidden">
                      <div className="absolute top-2.5 left-2.5 bg-[#1E1E20]/90 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold text-white z-10 shadow-md">
                        <Star size={12} className="text-[#F9671A] fill-[#F9671A]" /> {item.rating}
                      </div>

                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500 z-0" />
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
              <div className="flex flex-col items-center justify-center py-10 mb-10 border border-white/5 rounded-[16px] bg-[#1a1a1c]">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 mb-3"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                <p className="text-zinc-400 font-medium text-sm">No happy hour items available.</p>
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
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500 z-0" />
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
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
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
                  <span className="font-medium text-white">{cartItems.length > 0 ? "Free" : "£0.00"}</span>
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
                  <span className="text-zinc-400">Use loyalty ponints</span>
                  <div className="w-8 h-4 bg-zinc-700 rounded-full relative cursor-pointer">
                    <div className="w-3 h-3 bg-zinc-400 rounded-full absolute left-0.5 top-0.5"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mb-5 pt-4 border-t border-white/10">
                <span className="text-[16px] font-bold text-white">Total</span>
                <span className="text-[18px] font-extrabold text-[#F9671A]">£{total.toFixed(2)}</span>
              </div>
              <button onClick={() => router.push("/checkout")} className="w-full py-3.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[14px] font-bold transition-colors shadow-lg shadow-orange-600/20 cursor-pointer">
                Proceed to checkout
              </button>
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
                  <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
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
                  <div className="text-[24px] font-extrabold text-[#F9671A]">{selectedProduct.price}</div>
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



              {/* Special Instructions */}
              <div>
                <h3 className="text-[16px] font-bold text-white mb-4">Special Instructions</h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests?"
                  className="w-full bg-[#212124] border border-white/5 rounded-2xl p-4 text-[13px] text-white placeholder-zinc-500 outline-none focus:border-[#F9671A]/50 transition-colors resize-none h-[100px]"
                ></textarea>
              </div>
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
                    toppings: selectedToppings.map((t:any) => t.id),
                    special_instructions: specialInstructions.trim() || undefined
                  };
                  
                  addToCart(selectedProduct, modalQty, opts);
                  setSelectedProduct(null);
                }}
                className="flex-1 bg-[#F9671A] text-white py-3.5 rounded-full font-bold text-[15px] hover:bg-[#ff7a33] transition shadow-lg shadow-orange-600/20 cursor-pointer "
              >
                Add to Cart - £{(parseFloat((selectedProduct.price || "").replace('£', '')) * modalQty).toFixed(2)}
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
