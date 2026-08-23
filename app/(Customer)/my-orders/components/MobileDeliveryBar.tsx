"use client";

import { useEffect, useState } from "react";
import { useGetMeQuery } from "@/redux/features/api/authApi";

export default function MobileDeliveryBar() {
  const { data: meRes } = useGetMeQuery();
  const [address, setAddress] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user_delivery_address");
      if (saved && saved.trim()) {
        setAddress(saved);
        return;
      }
    }
    const user = meRes?.user || meRes?.data || meRes;
    const profileAddr =
      user?.addresses?.[0]?.address ||
      user?.address ||
      null;
    if (profileAddr) {
      setAddress(profileAddr);
    }
  }, [meRes]);

  useEffect(() => {
    if (address) return;
    const detect = async () => {
      setIsDetecting(true);
      try {
        const { getUserLocation, reverseGeocode } = await import("@/utils/location");
        const pos = await getUserLocation();
        if (!pos) return;
        const addr = await reverseGeocode(pos.latitude, pos.longitude);
        if (addr) {
          setAddress(addr);
          if (typeof window !== "undefined") {
            localStorage.setItem("user_delivery_address", addr);
          }
        }
      } catch (e) {
        // Silently handle location permission denied or failure
      } finally {
        setIsDetecting(false);
      }
    };
    detect();
  }, [address]);

  const displayAddress = address
    ? address.length > 36
      ? address.substring(0, 36) + "…"
      : address
    : isDetecting
    ? "Detecting exact location..."
    : "Delivery location";

  return (
    <div className="flex items-center gap-2 px-6 py-2.5 bg-[#1E1E20] border-b border-white/5 lg:hidden">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 animate-pulse">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      <span className="text-zinc-400 text-xs font-medium flex-shrink-0">Delivery:</span>
      <span className="text-[#F9671A] text-xs font-semibold truncate">{displayAddress}</span>
    </div>
  );
}