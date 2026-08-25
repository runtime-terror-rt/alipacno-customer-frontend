"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import CheckoutMap from "@/components/CheckoutMap";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  const orderNumParam = searchParams.get("order_number");

  const [deliveryAddress, setDeliveryAddress] = useState<string>("Standard Delivery");
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<string | null>(null);
  const [branchInfo, setBranchInfo] = useState<{ name: string; lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user_delivery_address");
      if (saved && saved.trim()) {
        setDeliveryAddress(saved);
      }
      // Load the branch that was selected at checkout time
      const savedBranch = localStorage.getItem("checkout_selected_branch");
      if (savedBranch) {
        try {
          const parsed = JSON.parse(savedBranch);
          if (parsed?.lat && parsed?.lng) {
            setBranchInfo(parsed);
          }
        } catch { }
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const computeRouteInfo = async () => {
      try {
        const {
          forwardGeocode,
          getGoogleRouteInfo,
          calculateDistanceKm,
          formatDeliveryTime,
          formatDistance,
        } = await import("@/utils/location");

        // Only geocode if the user has a real delivery address
        if (!deliveryAddress || deliveryAddress === "Standard Delivery") return;
        const coords = await forwardGeocode(deliveryAddress);

        if (coords && isMounted) {
          setUserCoords(coords);
        }

        // Use the saved branch coords or fall back to the Eltham default
        const bCoords = branchInfo ? { latitude: branchInfo.lat, longitude: branchInfo.lng } : null;


        if (bCoords && coords) {
          const route = await getGoogleRouteInfo(bCoords, coords);
          if (route && isMounted) {
            setDeliveryInfo(`${route.formattedDeliveryTime} (${route.formattedDistance})`);
            return;
          }

          const km = calculateDistanceKm(bCoords.latitude, bCoords.longitude, coords.latitude, coords.longitude);
          if (km != null && isMounted) {
            setDeliveryInfo(`${formatDeliveryTime(km)} (${formatDistance(km)})`);
          }
        }
      } catch (e) {
        console.warn("Route computation failed on success page:", e);
      }
    };

    computeRouteInfo();
    return () => {
      isMounted = false;
    };
  }, [deliveryAddress, branchInfo]);

  const displayOrderNum =
    orderNumParam || orderId ? `#${orderNumParam || orderId}` : sessionId ? `#${sessionId.substring(0, 14)}...` : "#t7ml-2542-c4kj";

  return (
    <div className="min-h-[100dvh] w-full bg-[#1E1E20] text-white flex flex-col font-sans select-none">
      <Header />

      <main className="flex-1 max-w-[800px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col justify-center gap-6">
        {/* Animated Checkmark Banner */}
        <div className="bg-[#252527] rounded-[24px] p-6 sm:p-8 flex flex-col items-center text-center gap-4 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-[#F9671A] to-[#ff8547] text-white shadow-xl shadow-orange-600/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div className="absolute inset-0 rounded-full animate-ping bg-[#F9671A] opacity-25" />
          </div>

          <div>
            <span className="bg-[#3a2016] text-[#F9671A] text-[11px] font-extrabold px-3.5 py-1 rounded-full border border-[#F9671A]/20 uppercase tracking-widest">
              Payment Successful
            </span>
            <h1 className="text-[26px] sm:text-[32px] font-extrabold text-white mt-3 leading-tight">
              Order Confirmed!
            </h1>
            <p className="text-[14px] text-zinc-400 mt-1 max-w-[500px] mx-auto">
              Thank you for ordering with Pacino&apos;s. Order <span className="text-white font-bold">{displayOrderNum}</span> is received and being prepared by our kitchen.
            </p>
          </div>
        </div>

        {/* Delivery Estimation & Map Location */}
        <div className="bg-[#252527] rounded-[24px] p-5 sm:p-6 border border-white/5 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <h3 className="text-[15px] font-bold text-white">Live Delivery Estimate</h3>
            </div>
            <span className="bg-[#3a2016] text-[#F9671A] text-[12px] font-extrabold px-3 py-1 rounded-full border border-[#F9671A]/20">
              {deliveryInfo || "25 mins delivery"}
            </span>
          </div>

          <div className="w-full h-[220px] rounded-[18px] overflow-hidden shadow-inner">
            <CheckoutMap
              branchLat={branchInfo?.lat ?? null}
              branchLng={branchInfo?.lng ?? null}
              branchName={branchInfo?.name ?? undefined}
              userLat={userCoords?.latitude}
              userLng={userCoords?.longitude}
              distanceText={deliveryInfo}
            />
          </div>
        </div>

        {/* Order Info Summary */}
        <div className="bg-[#252527] rounded-[24px] p-5 sm:p-6 border border-white/5 flex flex-col gap-3 text-[14px]">
          <h3 className="text-[16px] font-bold text-white mb-1">Order Details</h3>
          <div className="flex justify-between items-center text-zinc-400 border-b border-white/5 pb-2.5">
            <span>Order Reference</span>
            <span className="text-white font-semibold">{displayOrderNum}</span>
          </div>
          <div className="flex justify-between items-center text-zinc-400 border-b border-white/5 pb-2.5">
            <span>Restaurant Branch</span>
            <span className="text-white font-semibold">{branchInfo?.name || "Selected Branch"}</span>
          </div>
          <div className="flex justify-between items-center text-zinc-400 border-b border-white/5 pb-2.5">
            <span>Delivery Location</span>
            <span className="text-white font-semibold truncate max-w-[280px]">
              {deliveryAddress}
            </span>
          </div>
          <div className="flex justify-between items-center text-zinc-400">
            <span>Payment Status</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Paid via Stripe
            </span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 pb-8">
          <button
            onClick={() => router.push("/my-orders")}
            className="w-full py-4 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[15px] font-bold transition-all shadow-lg shadow-orange-600/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Track Order Status in My Orders
          </button>
          <button
            onClick={() => router.push("/menu")}
            className="w-full py-4 bg-[#2a2a2c] hover:bg-[#323235] text-zinc-300 hover:text-white rounded-full text-[15px] font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            Explore Menu & Order More
          </button>
        </div>
      </main>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] w-full bg-[#1E1E20] text-zinc-400 flex items-center justify-center text-sm">
          Loading order details...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
