"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CheckoutMap from "@/components/CheckoutMap";
import { Eye, EyeOff } from "lucide-react";
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation, extractCartData } from "../../../redux/features/api/cartApi";
import { useGetCategoriesQuery } from "@/redux/features/api/categoriesApi";
import { useCreateOrderMutation } from "../../../redux/features/api/ordersApi";
import { useGetBranchesQuery } from "@/redux/features/api/branchesApi";
import { useBranchSelection } from "@/hooks/useBranchSelection";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/features/slice/authSlice";
import { useLogoutMutation, useGetMeQuery } from "../../../redux/features/api/authApi";
import Header from "../components/Header";

import { toast } from "react-hot-toast";
import OrderSuccessModal from "@/components/OrderSuccessModal";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  const [activeCategory, setActiveCategory] = useState("Steaks");
  const [tip, setTip] = useState("No Tip");
  const [time, setTime] = useState("ASAP");
  const [pay, setPay] = useState("Card");
  const [loyalty, setLoyalty] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeBranchId, setActiveBranchId] = useState<number | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [showCvc, setShowCvc] = useState(false);

  const { data: cartData } = useGetCartQuery();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const { data: meRes } = useGetMeQuery();
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const [debouncedAddress, setDebouncedAddress] = useState(deliveryAddress);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedAddress(deliveryAddress), 600);
    return () => clearTimeout(t);
  }, [deliveryAddress]);


  const gpsCoordsRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const addressSourceRef = useRef<"gps" | "manual" | "profile">("manual");

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user_delivery_address");
      if (saved && saved.trim()) {
        addressSourceRef.current = "profile";
        setDeliveryAddress(saved);
      }
    }
    const user = meRes?.user || meRes?.data || meRes;
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
      const defaultAddr = user.addresses?.[0]?.address || user.address || "";
      if (defaultAddr && !deliveryAddress) {
        addressSourceRef.current = "profile";
        setDeliveryAddress(defaultAddr);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meRes]);

  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const { getUserLocation, reverseGeocode } = await import("@/utils/location");
      const pos = await getUserLocation();
      if (!pos) {
        toast.error("Could not access location. Please allow location access or enter address manually.");
        return;
      }
      setUserLocation(pos);
      gpsCoordsRef.current = pos;
      addressSourceRef.current = "gps";

      const addr = await reverseGeocode(pos.latitude, pos.longitude);
      if (addr) {
        setDeliveryAddress(addr);
        if (typeof window !== "undefined") {
          localStorage.setItem("user_delivery_address", addr);
        }
        toast.success("Location detected!");
      } else {
        setDeliveryAddress(`${pos.latitude.toFixed(4)}, ${pos.longitude.toFixed(4)}`);
        toast.success("Location detected!");
      }
    } catch (e) {
      console.error("Location detection failed:", e);
      toast.error("Location detection failed.");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleAddressChange = (val: string) => {
    // Any manual edit invalidates the cached GPS coordinates — the address
    // no longer necessarily matches where the GPS fix pointed to, so future
    // distance calculations must forward-geocode the new typed address.
    addressSourceRef.current = "manual";
    gpsCoordsRef.current = null;
    setDeliveryAddress(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("user_delivery_address", val);
    }
  };

  const { data: categoriesRes } = useGetCategoriesQuery({ all: 1 });
  const categoriesList = categoriesRes?.data || categoriesRes || [];

  const handleLogout = async () => {
    try {
      await logoutApi({}).unwrap();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      dispatch(logout());
      router.push('/login');
    }
  };

  const { branches: branchesWithDistance, selectedBranch, nearestBranch, selectBranch } = useBranchSelection(userLocation);

  const branches = branchesWithDistance;

  const currentBranch = branches.find((b: any) => b.id === (activeBranchId || selectedBranch?.id || nearestBranch?.id)) || selectedBranch || nearestBranch || branches[0];
  const modalSelectedBranch = branches.find((b: any) => b.id === (selectedBranchId || currentBranch?.id)) || currentBranch;

  // Sync active branch to selected/nearest branch automatically
  useEffect(() => {
    if (selectedBranch?.id) {
      setActiveBranchId(selectedBranch.id);
      setSelectedBranchId(selectedBranch.id);
    }
  }, [selectedBranch?.id]);

  // Persist the currently selected branch to localStorage so the order success
  // page can show the correct branch on the map without hardcoded coordinates.
  useEffect(() => {
    if (!currentBranch) return;
    const lat = parseFloat(String(currentBranch.latitude ?? ""));
    const lng = parseFloat(String(currentBranch.longitude ?? ""));
    if (!isNaN(lat) && !isNaN(lng) && typeof window !== "undefined") {
      localStorage.setItem(
        "checkout_selected_branch",
        JSON.stringify({ name: currentBranch.name || "Branch", lat, lng })
      );
    }
  }, [currentBranch?.id, currentBranch?.name, currentBranch?.latitude, currentBranch?.longitude]);

  const [routeInfo, setRouteInfo] = useState<{ formattedDistance?: string; formattedDeliveryTime?: string } | null>(null);

  // Auto-detect delivery address coordinates and compute distance & driving time to selected branch.
  useEffect(() => {
    let isMounted = true;
    const myRequestId = ++requestIdRef.current;

    const calculateDistance = async () => {
  const { forwardGeocode, calculateDistanceKm, getBranchCoordinates, getGoogleRouteInfo } = await import("@/utils/location");
  const branch = currentBranch as any;
  if (!branch) return;

  let coords: { latitude: number; longitude: number } | null = null;

  if (addressSourceRef.current === "gps" && gpsCoordsRef.current) {
    coords = gpsCoordsRef.current;
  } else if (debouncedAddress && debouncedAddress.trim()) {
    coords = await forwardGeocode(debouncedAddress);
  }

  if (!isMounted || myRequestId !== requestIdRef.current) return;

  setUserLocation(coords);
  const branchCoords = getBranchCoordinates(branch); // now Coordinates | null

  if (coords && branchCoords) {
    const googleRoute = await getGoogleRouteInfo(branchCoords, coords);
    if (!isMounted || myRequestId !== requestIdRef.current) return;

    if (googleRoute) {
      setDistanceKm(googleRoute.distanceKm);
      setRouteInfo({
        formattedDistance: googleRoute.formattedDistance,
        formattedDeliveryTime: googleRoute.formattedDeliveryTime,
      });
      return;
    }
    const km = calculateDistanceKm(branchCoords.latitude, branchCoords.longitude, coords.latitude, coords.longitude);
    setDistanceKm(km);
    setRouteInfo(null);
  } else {
    setDistanceKm(null);
    setRouteInfo(null);
  }
};
    calculateDistance();
    return () => {
      isMounted = false;
    };
  }, [currentBranch?.id, (currentBranch as any)?.name, (currentBranch as any)?.address, debouncedAddress]);

  const { formatDistance, formatDeliveryTime } = require("@/utils/location");
  const distanceText = routeInfo?.formattedDistance || (distanceKm != null ? formatDistance(distanceKm) : (currentBranch as any)?.dist || "Distance N/A");
  const deliveryTimeText = routeInfo?.formattedDeliveryTime || (distanceKm != null ? formatDeliveryTime(distanceKm) : (currentBranch as any)?.time || "Est. delivery time");



  const [createOrderMut, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  const { cartObj, items: rawCartItems } = extractCartData(cartData);

  const cartItems = rawCartItems.map((item: any) => {
    const descArr = [
      (item.size || item.size)?.name,
      (item.cooking_preference || item.cookingPreference)?.name,
      (item.spice_level || item.spiceLevel)?.name,
      item.toppings?.length > 0 ? `Toppings: ${item.toppings.map((t:any) => t.topping?.name || t.name).join(', ')}` : null,
      item.special_instructions ? `Note: ${item.special_instructions}` : null
    ].filter(Boolean);

    return {
      id: item.id,
      menuItem: item.menu_item || item.menuItem,
      name: (item.menu_item || item.menuItem)?.name || item.name || "Item",
      desc: descArr.join(' | '),
      price: parseFloat(item.total_price || (item.unit_price ? parseFloat(item.unit_price) * item.quantity : 0) || 0),
      img: (item.menu_item || item.menuItem)?.image_url || (item.menu_item || item.menuItem)?.image || item.image || "/placeholder.png",
    };
  });

  const tipAmt = tip === "£2" ? 2 : tip === "£5" ? 5 : tip === "£10" ? 10 : 0;

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successOrderInfo, setSuccessOrderInfo] = useState<{
    orderNumber?: string;
    sessionId?: string;
    totalAmount?: number | string;
  }>({});

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!customerPhone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }
    if (!deliveryAddress.trim()) {
      toast.error("Please enter your delivery address.");
      return;
    }

    try {
      const cartId = Number(cartObj?.id || cartData?.id || cartData?.data?.id || 1);

      // Build items payload from cart items
      const itemsPayload = rawCartItems.map((item: any) => ({
        menu_item_id: Number(item.menu_item_id || item.menu_item?.id || item.id || 1),
        quantity: Number(item.quantity || 1),
        size_id: item.size_id ? Number(item.size_id) : (item.size?.id ? Number(item.size.id) : null),
        cooking_preference_id: item.cooking_preference_id ? Number(item.cooking_preference_id) : (item.cooking_preference?.id ? Number(item.cooking_preference.id) : null),
        spice_level_id: item.spice_level_id ? Number(item.spice_level_id) : (item.spice_level?.id ? Number(item.spice_level.id) : null),
        unit_price: parseFloat(String(item.unit_price || item.menu_item?.price || item.price || 0)),
        special_instructions: item.special_instructions || null,
      }));

      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const successUrl = `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}/checkout`;

      const currentUser = (() => {
        if (meRes?.data?.id) return meRes.data;
        if (meRes?.data?.user?.id) return meRes.data.user;
        if (meRes?.user?.id) return meRes.user;
        if (meRes?.id) return meRes;
        if (typeof window !== "undefined") {
          try {
            const saved = localStorage.getItem("user");
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed?.id) return parsed;
            }
          } catch (e) {}
        }
        return null;
      })();

      const userId: number | undefined = currentUser?.id ? Number(currentUser.id) : undefined;

      const payMethod = pay.toLowerCase() === "card" ? "stripe" : "cash";

      const res = await createOrderMut({
        branch_id: Number(currentBranch?.id || 1),
        user_id: userId,
        cart_id: cartId,
        order_type: cartObj?.order_type || "delivery",
        payment_method: payMethod,
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        table_id: null,
        notes: undefined,
        tip: tipAmt,
        rider_tip: 0,
        use_loyalty_points: loyalty,
        items: itemsPayload.length > 0 ? itemsPayload : undefined,
        success_url: successUrl,
        cancel_url: cancelUrl,
      }).unwrap();

      toast.success(res?.message || "Order placed successfully!");

      const stripeUrl = res?.stripe?.url || res?.data?.stripe?.url;

      if (payMethod === "stripe" && stripeUrl) {
        window.location.href = stripeUrl;
      } else {
        const orderData = res?.data || res?.order || res;
        const orderNum = orderData?.order_number || res?.order_number || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        setSuccessOrderInfo({
          orderNumber: orderNum,
          totalAmount: total,
        });
        setIsSuccessModalOpen(true);
      }
    } catch (e: any) {
      console.error("Order API failed:", e);
      const errMsg = e?.data?.message || e?.message || "Order placement failed. Please try again.";
      toast.error(errMsg);
    }
  };

  const subtotal = parseFloat(cartObj?.subtotal || 0);
  const vat = parseFloat(cartObj?.vat || 0);
  const loyaltyDiscount = parseFloat(cartObj?.discount || 0);
  const baseTotal = parseFloat(cartObj?.total || 0);
  const total = baseTotal + tipAmt;

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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      );
    }
  };

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

  // Categories are now dynamically loaded from categoriesList

  return (
    <div className="h-[100dvh] w-full bg-[#1E1E20] flex flex-col lg:flex-row text-white overflow-hidden font-sans select-none">
      {/* 1. Left Sidebar (Same to Same as Menu Page) */}
      <div className="hidden lg:flex w-[240px] md:w-[260px] flex-shrink-0 border-r border-white/5 bg-[#1a1a1c] flex-col">
        {/* Logo */}
        <div className="h-[90px] flex items-center justify-center px-6 mt-4">
          <Link href="/home">
            <Image src="/logo.png" alt="Logo" width={130} height={80} priority />
          </Link>
        </div>
        <div className="border-b border-white/5 mt-4"></div>
        {/* Categories */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-6">
          <h3 className="text-white font-bold text-[18px] mb-4 pl-6">Menu Categories</h3>
          <div className="flex flex-col">
            {categoriesList.map((cat: any, i: number) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={i}
                  onClick={() => router.push(`/menu?category=${encodeURIComponent(cat.name)}`)}
                  className={`flex items-center w-full px-6 py-4 transition-colors duration-200 group border-l-[4px] cursor-pointer ${isActive ? "bg-[#EBE5E0] border-[#F9671A]" : "border-transparent hover:bg-white/5"}`}
                >
                  <div className={`w-[22px] h-[22px] mr-4 flex items-center justify-center ${isActive ? "text-[#F9671A]" : "text-zinc-500 group-hover:text-zinc-400"}`}>
                    {renderCategoryIcon(cat, isActive)}
                  </div>
                  <span className={`text-[16px] font-medium flex-1 text-left ${isActive ? "text-[#F9671A]" : "text-zinc-500 group-hover:text-zinc-400"}`}>
                    {cat.name}
                  </span>
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
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Top Header */}
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />

        {/* Mobile Delivery Bar - Only visible on lg:hidden */}
        <div className="flex items-center gap-2 px-6 py-3 bg-[#1E1E20] border-b border-white/5 lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span className="text-zinc-400 text-xs font-medium">Delivery:</span>
          <span className="text-[#F9671A] text-xs font-semibold truncate max-w-[200px]">
            {deliveryAddress || (isDetectingLocation ? "Detecting…" : "Enter address below")}
          </span>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative">
          {/* Main Content Area: Checkout Form */}
          <main className="flex-1 h-auto lg:h-full px-6 sm:px-8 py-6 overflow-visible lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* Back + Title */}
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => router.push("/menu")} className="text-white hover:text-zinc-300 transition-colors cursor-pointer flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <h1 className="text-[20px] font-bold text-white">Checkout</h1>
            </div>

            {/* Your Order from Banner (No border, Regular Card bg style) */}
            <div className="rounded-[20px] p-5 sm:p-6 mb-6 shadow-xl bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c]">
              {/* Mobile Layout */}
              <div className="flex flex-col lg:hidden gap-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white text-[13px] font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>
                    Your Order from
                  </div>
                  <button onClick={() => setIsBranchModalOpen(true)} className="bg-[#F9671A] hover:bg-[#ff7a33] text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md shadow-orange-600/20 transition-all cursor-pointer">
                    Change Branch
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </button>
                </div>

                <h2 className="text-[16px] font-bold text-white leading-tight mt-0.5">{currentBranch?.name || "Loading..."}</h2>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start gap-2 text-[#d1d1d1] text-[13.5px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    <span className="leading-tight">{currentBranch?.address || "Loading..."}</span>
                  </div>

                  <div className="flex items-center gap-4 text-[#d1d1d1] text-[13px]">
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4" /><circle cx="7" cy="21" r="1" /><circle cx="20" cy="21" r="1" /></svg>
                      {distanceText}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      {deliveryTimeText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-zinc-400 text-[12px] font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    Your Order from
                  </div>
                  <h2 className="text-[20px] font-bold text-white leading-tight">{currentBranch?.name || "Loading..."}</h2>
                  <div className="flex items-center gap-1.5 text-zinc-300 text-[13px] mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    {currentBranch?.address || "Loading..."}
                  </div>
                  <div className="flex items-center gap-6 mt-1.5 text-zinc-400 text-[12px]">
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4" /><circle cx="7" cy="21" r="1" /><circle cx="20" cy="21" r="1" /></svg>
                      {distanceText}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      {deliveryTimeText}
                    </span>
                  </div>
                </div>
                <button onClick={() => setIsBranchModalOpen(true)} className="bg-[#F9671A] hover:bg-[#ff7a33] text-white text-[13px] font-bold px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-orange-600/20 transition-all cursor-pointer flex-shrink-0">
                  Change Branch
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>
            </div>

            {/* Your Information (No border on inputs) */}
            <div className="mb-6">
              <h3 className="text-[16px] font-bold text-white mb-3">Your Information</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[12px] text-zinc-400 mb-1.5 block">Name</label>
                  <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. Alan Cattach" className="w-full bg-[#212124] rounded-[12px] px-4 py-3 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                </div>
                <div>
                  <label className="text-[12px] text-zinc-400 mb-1.5 block">Phone Number</label>
                  <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="e.g. +1 0123456789" className="w-full bg-[#212124] rounded-[12px] px-4 py-3 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                </div>
                <div>
                  <label className="text-[12px] text-zinc-400 mb-1.5 block">Delivery Address</label>
                  <div className="relative">
                    <input value={deliveryAddress} onChange={e => handleAddressChange(e.target.value)} placeholder="e.g. NW1 6XE, London" className="w-full bg-[#212124] rounded-[12px] px-4 py-3 pr-10 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isDetectingLocation}
                      title="Detect my location"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F9671A] hover:text-orange-400 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isDetectingLocation ? (
                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isDetectingLocation}
                    className="mt-1.5 text-[11px] text-[#F9671A] hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {isDetectingLocation ? "Detecting your location..." : "Use my current location"}
                  </button>
                </div>
              </div>
            </div>

            {/* Tip (No border, Regular Card bg style for active) */}
            <div className="mb-6">
              <h3 className="text-[16px] font-bold text-white mb-3">Add a Tip (Optional)</h3>
              <div className="flex items-center gap-2.5 flex-wrap">
                {["No Tip", "£2", "£5", "£10"].map(t => (
                  <button
                    key={t}
                    onClick={() => setTip(t)}
                    className={`px-5 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${tip === t ? "bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] text-white shadow-lg shadow-orange-600/10" : "bg-[#212124] text-zinc-300 hover:text-white"}`}
                  >
                    {t}
                    {tip === t && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection (No border, Regular Card bg style for active) */}
            <div className="mb-6">
              <h3 className="text-[16px] font-bold text-white mb-3">Time Selection</h3>
              <div className="flex items-center gap-2.5 flex-wrap">
                {["ASAP", "In 15 mins", "In 30 mins", "In 45 mins", "Schedule Time"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`px-5 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${time === t ? "bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] text-white shadow-lg shadow-orange-600/10" : "bg-[#212124] text-zinc-300 hover:text-white"}`}
                  >
                    {t}
                    {time === t && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method (No border, Regular Card bg style for active) */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                <h3 className="text-[16px] font-bold text-white">Payment Method</h3>
              </div>
              <p className="text-zinc-500 text-[12px] mb-4 font-medium">Payment will be processed via Stripe</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  {
                    id: "Card", label: "Card", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                    )
                  },
                  {
                    id: "Cash", label: "Cash", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                    )
                  }
                ].map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => setPay(pm.id)}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-[14px] text-[14px] font-bold transition-all cursor-pointer ${pay === pm.id ? "bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] text-white shadow-lg shadow-orange-600/10" : "bg-[#212124] text-zinc-300 hover:text-white"}`}
                  >
                    {pm.icon}
                    {pm.label}
                  </button>
                ))}
              </div>

              {/* Card Details (No border on inputs) */}
              {/* {pay === "Card" && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-[14px] font-bold text-white mb-1">Card details</h4>
                  <div>
                    <label className="text-[12.5px] text-zinc-400 mb-1.5 block font-medium">Cardholder name</label>
                    <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="e.g. Alan Cattach" className="w-full bg-[#212124] rounded-[12px] px-4 py-3 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                  </div>
                  <div>
                    <label className="text-[12.5px] text-zinc-400 mb-1.5 block font-medium">Card Number</label>
                    <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="e.g. 1234 5678 9101 1121" className="w-full bg-[#212124] rounded-[12px] px-4 py-3 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[12.5px] text-zinc-400 mb-1.5 block font-medium">Expire Date</label>
                      <input value={cardExp} onChange={e => setCardExp(e.target.value)} placeholder="MM/YY" className="w-full bg-[#212124] rounded-[12px] px-4 py-3 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                    </div>
                    <div>
                      <label className="text-[12.5px] text-zinc-400 mb-1.5 block font-medium">CVC</label>
                      <div className="relative w-full">
                        <input value={cardCvc} onChange={e => setCardCvc(e.target.value)} type={showCvc ? "text" : "password"} placeholder="e.g. 123" className="w-full bg-[#212124] rounded-[12px] px-4 py-3 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner pr-12" />
                        <button
                          type="button"
                          onClick={() => setShowCvc(!showCvc)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors duration-200 flex items-center justify-center cursor-pointer"
                          tabIndex={-1}
                        >
                          {showCvc ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}
            </div>
            <div className="pb-10"></div>
          </main>

          {/* Right Sidebar (Map & Order Summary - Same width and structure as Menu Page Cart) */}
          <aside className="w-full lg:w-[355px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 bg-[#1E1E20] flex flex-col h-auto lg:h-full relative z-30">
            {/* Map Section (No border on map container) */}
            <div className="p-6 pb-4 border-b border-white/5 mx-6 px-0 mb-4 flex flex-col gap-4 flex-shrink-0">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-[17px] font-bold text-white">Map Location</h3>
              </div>
              <div className="w-full h-[250px] rounded-[16px] overflow-hidden shadow-lg bg-[#252527]">
                <CheckoutMap 
                  distance={distanceKm} 
                  userLoc={userLocation} 
                  branches={branches} 
                  closestBranchId={currentBranch?.id} 
                />
              </div>
            </div>

            {/* Order Summary Section (No border on items) */}
            <div className="flex-1 overflow-y-auto px-6 flex flex-col scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[17px] font-bold text-white">Order Summary</h3>
                <div className="bg-[#3a2016] text-[#F9671A] text-[10px] font-extrabold px-2 py-0.5 rounded border border-[#F9671A]/20">
                  {cartItems.length} ITEMS
                </div>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-4 mb-6">
                {cartItems.map((item: any) => {
                  const catName = item.menuItem?.category?.name || categoriesList.find((c: any) => c.id === item.menuItem?.category_id)?.name || item.category || 'Burgers';
                  return (
                  <div key={item.id} className="flex items-center gap-3 bg-[#212124] p-3 rounded-[16px] shadow-sm">
                    <div className="w-[52px] h-[52px] rounded-[12px] overflow-hidden flex-shrink-0 relative bg-[#28282b]">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[14px] font-bold text-white truncate mb-0.5">{item.name}</h4>
                      <p className="text-[11px] text-zinc-400 truncate">{item.desc}</p>
                    </div>
                    <span className="text-[#F9671A] text-[15px] font-extrabold flex-shrink-0 pl-2">£{item.price}</span>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Footer / Total Row (Same structure as Menu Page Cart Footer) */}
            <div className="p-6 border-t border-white/5 mt-auto bg-[#1a1a1c]/50 flex flex-col flex-shrink-0">
              {/* Price Breakdown */}
              <div className="flex flex-col gap-3 mb-5">
                {[
                  ["Subtotal", `£${subtotal.toFixed(2)}`],
                  ["Delivery", "Free"],
                  ["Incl. VAT", `£${vat.toFixed(2)}`],
                  ["Rider's Tip", tipAmt > 0 ? `£${tipAmt.toFixed(2)}` : "00.00"],
                  ["Loyalty discount", loyaltyDiscount > 0 ? `-£${loyaltyDiscount.toFixed(2)}` : "00.00"]
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between items-center text-[13px]">
                    <span className="text-zinc-400">{l}</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-[13px] mt-1">
                  <span className="text-zinc-400">Use loyalty points</span>
                  <div onClick={() => setLoyalty(!loyalty)} className="w-8 h-4 bg-zinc-700 rounded-full relative cursor-pointer transition-colors" style={loyalty ? { backgroundColor: "#F9671A" } : {}}>
                    <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${loyalty ? "left-[18px]" : "left-0.5 bg-zinc-400"}`} />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-5 pt-4 border-t border-white/10">
                <span className="text-[16px] font-bold text-white">Total</span>
                <span className="text-[18px] font-extrabold text-[#F9671A]">£{total.toFixed(2)}</span>
              </div>

              <button onClick={handlePlaceOrder} disabled={isCreatingOrder} className="w-full py-3.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[14px] font-bold transition-colors shadow-lg shadow-orange-600/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isCreatingOrder ? "Processing..." : "Place Order"}
                {!isCreatingOrder && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>}
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Change Branch Modal Overlay - fixed z-20, right sidebar is z-30 so stays bright */}
      {isBranchModalOpen && (
        <div
          className="fixed top-0 bottom-0 left-0 right-0 lg:right-[355px] z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center lg:pl-[260px] p-4"
          onClick={() => setIsBranchModalOpen(false)}
        >
          <div
            className="bg-[#1E1E20] border border-white/10 rounded-[24px] w-full max-w-[520px] p-6 shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[20px] font-bold text-white">Change Branch</h3>
              <button onClick={() => setIsBranchModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>
            <p className="text-[14px] text-zinc-400 mb-5">Select Branch</p>
            <div className="flex flex-col gap-3 mb-6">
              {branches.map((b: any) => {
                const sel = modalSelectedBranch?.id === b.id;
                // Calculate per-branch distance if user location and branch coords are available
                let branchDistText = b.dist || "";
                if (userLocation && b.latitude && b.longitude) {
                  const { calculateDistanceKm } = require("@/utils/location");
                  const km = calculateDistanceKm(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
                  if (km != null) {
                    const mins = Math.max(15, Math.round(km * 3) + 10);
                    branchDistText = `${km} km away · ${mins} mins delivery`;
                  }
                }
                return (
                  <div key={b.id} onClick={() => setSelectedBranchId(b.id)} className={`p-5 rounded-[20px] cursor-pointer relative flex flex-col gap-1.5 transition-all ${sel ? "bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] shadow-lg" : "bg-[#212124] hover:bg-[#252528]"}`}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-[16px] font-bold text-white pr-8">{b.name}</h4>
                      {sel && <div className="absolute top-5 right-5 w-5 h-5 bg-[#F9671A] rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>}
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-300 text-[13px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                      {b.address || "Address not specified"}
                    </div>
                    {branchDistText && (
                      <div className="flex items-center gap-1.5 text-[#F9671A] text-[12px] font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        {branchDistText}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <button
              onClick={() => {
                if (selectedBranchId) {
                  setActiveBranchId(selectedBranchId);
                  selectBranch(selectedBranchId);
                }
                setIsBranchModalOpen(false);
              }}
              className="w-full mt-auto py-3.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[14px] font-bold transition-colors shadow-lg shadow-orange-600/20 cursor-pointer flex items-center justify-center"
            >
              Confirm Branch
            </button>
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
                {categoriesList.map((cat: any, i: number) => {
                  const isActive = activeCategory === cat.name;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        router.push(`/menu?category=${encodeURIComponent(cat.name)}`);
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

      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        orderNumber={successOrderInfo.orderNumber}
        sessionId={successOrderInfo.sessionId}
        deliveryAddress={deliveryAddress}
        branchName={currentBranch?.name}
        totalAmount={successOrderInfo.totalAmount}
        branchLat={(currentBranch as any)?.latitude}
        branchLng={(currentBranch as any)?.longitude}
      />
    </div>
  );
}














