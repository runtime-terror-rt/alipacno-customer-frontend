"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateCartMutation } from "../redux/features/api/cartApi";
import { useGetBranchesQuery, BranchItem } from "../redux/features/api/branchesApi";

const getLocationSilently = async (): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    // Using a free, reliable IP geolocation service (no API key or permissions needed)
    const response = await fetch("https://get.geojs.io/v1/ip/geo.json", {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const data = await response.json();
    if (data && data.latitude && data.longitude) {
      return {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      };
    }
  } catch (error) {
    // Ignore timeout or other errors silently
  }
  return null;
};

export default function StartOrderModal({ onClose, initialMode }: { onClose: () => void; initialMode: string }) {
  const [postcode, setPostcode] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const [createCart] = useCreateCartMutation();
  const { data: branchesResponse, isLoading: isBranchesLoading } = useGetBranchesQuery();

  const branches = branchesResponse?.data && Array.isArray(branchesResponse.data) ? branchesResponse.data : [];

  useEffect(() => {
    if (branches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branches[0].id);
    }
  }, [branches, selectedBranchId]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      try { prev?.focus(); } catch (e) { }
    };
  }, [onClose]);

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    try {
      const { getUserLocation, reverseGeocode } = await import("@/utils/location");
      const pos = await getUserLocation();
      if (pos) {
        const addr = await reverseGeocode(pos.latitude, pos.longitude);
        if (addr) {
          setPostcode(addr);
          setError("");
        }
      }
    } catch (e) {
      console.error("Detect location error:", e);
    } finally {
      setIsDetecting(false);
    }
  };

  async function handleStart() {
    if (isProcessing) return;
    const trimmed = postcode.trim();
    const isDelivery = (initialMode || "delivery").toLowerCase() === "delivery";

    if (isDelivery && trimmed.length === 0) {
      setError("Please enter your delivery postcode or address");
      inputRef.current?.focus();
      return;
    }

    setIsProcessing(true);
    let location = { latitude: null as number | null, longitude: null as number | null };
    try {
      const loc = await getLocationSilently();
      if (loc) {
        location.latitude = loc.latitude;
        location.longitude = loc.longitude;
      }
    } catch (err) {
      console.error("Silent location fetch failed:", err);
    }

    const branchId = selectedBranchId || (branches.length > 0 ? branches[0].id : 1);

    try {
      const payload = {
        order_type: initialMode || "delivery",
        delivery_postcode: trimmed || undefined,
        branch_id: branchId,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const result = await createCart(payload).unwrap();

      const cartId = result?.data?.id || result?.id;
      if (cartId) {
        localStorage.setItem("cart_id", String(cartId));
      }
      if (trimmed) {
        localStorage.setItem("user_delivery_address", trimmed);
      }
      localStorage.setItem("selected_branch_id", String(branchId));

      setClosing(true);
      setTimeout(() => {
        onClose();
        router.push("/menu");
      }, 180);
    } catch (err) {
      console.error("Failed to create cart:", err);
      setError("Failed to start order. Please try again.");
      setIsProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className={`absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity ${closing ? "opacity-0" : "opacity-100"}`} onClick={onClose} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pacino-start-title"
        className={`relative bg-[#1E1E20] rounded-2xl p-6 sm:p-8 w-full max-w-md text-center border border-white/10 shadow-2xl transform transition-all ${closing ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
      >
        <div className="mb-3 w-20 h-12 mx-auto relative">
          <Image src="/logo.png" alt="logo" width={80} height={48} className="w-full h-full object-contain mx-auto" />
        </div>

        <h3 id="pacino-start-title" className="text-[#F9671A] font-bold text-xl sm:text-2xl mb-1 uppercase tracking-wider">
          START YOUR ORDER
        </h3>
        <p className="text-zinc-400 text-xs mb-5 font-medium">
          Order Mode: <span className="text-white font-bold capitalize">{initialMode || "Delivery"}</span>
        </p>

        {/* Branch Selector Dropdown */}
        <div className="mb-4 text-left">
          <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Select Store / Branch</label>
          <div className="relative">
            <select
              value={selectedBranchId || ""}
              onChange={(e) => setSelectedBranchId(Number(e.target.value))}
              disabled={isBranchesLoading || branches.length === 0}
              className="w-full px-4 py-3 rounded-xl bg-[#262626] border border-white/10 text-white outline-none focus:border-[#F9671A]/50 transition-all text-sm appearance-none cursor-pointer pr-10"
            >
              {branches.length === 0 ? (
                <option value="">{isBranchesLoading ? "Loading branches..." : "Pacino's Main Branch"}</option>
              ) : (
                branches.map((b: BranchItem) => (
                  <option key={b.id} value={b.id} className="bg-[#1E1E20] text-white py-2">
                    {b.name}{b.city ? ` (${b.city})` : b.address ? ` (${b.address})` : ""}
                  </option>
                ))
              )}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Postcode Input */}
        <div className="mb-6 text-left">
          <label className="text-xs font-semibold text-zinc-400 mb-1.5 flex items-center justify-between">
            <span>Delivery Postcode / Address</span>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="text-[#F9671A] hover:underline text-[11px] font-medium flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {isDetecting ? "Detecting..." : "Detect my location"}
            </button>
          </label>
          <input
            ref={inputRef}
            value={postcode}
            onChange={(e) => { setPostcode(e.target.value); setError(""); }}
            placeholder="Enter postcode (e.g. SE9 6SN)"
            className={`w-full placeholder:text-zinc-500 text-sm px-4 py-3 rounded-xl bg-[#262626] border outline-none transition-all ${error ? "border-rose-500 focus:border-rose-400" : "border-white/10 focus:border-[#F9671A]/50"} text-white`}
          />
          {error && (
            <div className="flex items-center gap-1.5 mt-2 ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-rose-400">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-rose-400 font-medium">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleStart()}
            disabled={isProcessing}
            className={`w-full py-3.5 text-sm sm:text-base font-bold rounded-full bg-[#F9671A] hover:bg-[#ff7a33] text-white transition-all shadow-lg shadow-orange-600/20 cursor-pointer ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? 'Creating Order...' : 'Continue to Menu'}
          </button>
        </div>

      </div>
    </div>
  );
}
