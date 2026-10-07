"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateCartMutation } from "../redux/features/api/cartApi";
import { useBranchSelection } from "@/hooks/useBranchSelection";
import { calculateDistanceKm, getBranchCoordinates } from "@/utils/location";

export default function StartOrderModal({
  onClose,
  initialMode,
}: {
  onClose: () => void;
  initialMode: string;
}) {
  const [zipcode, setZipcode] = useState("");
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const [createCart] = useCreateCartMutation();
  const { branches, selectedBranchId, selectBranch } = useBranchSelection();

  // Load previously saved zipcode if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user_delivery_address");
      if (saved) {
        setZipcode(saved);
      }
    }
  }, []);

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
      try {
        prev?.focus();
      } catch (e) {}
    };
  }, [onClose]);

  // Validates zipcode against UK postcodes.io, US zip formats, or branch DB
  async function checkZipcodeValidity(raw: string): Promise<{
    isValid: boolean;
    formatted: string;
    latitude: number | null;
    longitude: number | null;
    error?: string;
  }> {
    const trimmed = raw.trim();
    if (!trimmed) {
      return {
        isValid: false,
        formatted: "",
        latitude: null,
        longitude: null,
        error: "Please enter your zipcode",
      };
    }

    const cleanInput = trimmed.replace(/\s+/g, "").toLowerCase();

    // 1. Check direct match with registered branch postal codes
    const branchMatch = branches.find((b) => {
      const bPostcode = (b.postal_code || b.postcode || "").replace(/\s+/g, "").toLowerCase();
      return bPostcode && bPostcode === cleanInput;
    });

    if (branchMatch) {
      const bCoords = getBranchCoordinates(branchMatch);
      return {
        isValid: true,
        formatted: branchMatch.postal_code || branchMatch.postcode || trimmed.toUpperCase(),
        latitude: bCoords?.latitude ?? null,
        longitude: bCoords?.longitude ?? null,
      };
    }

    // 2. Validate full UK postcode via postcodes.io (reliable, official open API)
    try {
      const vRes = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(cleanInput)}/validate`);
      if (vRes.ok) {
        const vData = await vRes.json();
        if (vData.result === true) {
          try {
            const dRes = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(cleanInput)}`);
            if (dRes.ok) {
              const dData = await dRes.json();
              if (dData.result) {
                return {
                  isValid: true,
                  formatted: dData.result.postcode,
                  latitude: dData.result.latitude,
                  longitude: dData.result.longitude,
                };
              }
            }
          } catch {}
          return {
            isValid: true,
            formatted: trimmed.toUpperCase(),
            latitude: null,
            longitude: null,
          };
        }
      }
    } catch {}

    // 3. Validate UK Outcode (e.g. NW1, SE9, W1A)
    try {
      const outRes = await fetch(`https://api.postcodes.io/outcodes/${encodeURIComponent(cleanInput)}`);
      if (outRes.ok) {
        const outData = await outRes.json();
        if (outData.status === 200 && outData.result) {
          return {
            isValid: true,
            formatted: outData.result.outcode,
            latitude: outData.result.latitude,
            longitude: outData.result.longitude,
          };
        }
      }
    } catch {}

    // 4. Validate US 5-digit zipcode regex (/^\d{5}(-\d{4})?$/)
    if (/^\d{5}(-\d{4})?$/.test(trimmed)) {
      try {
        const { forwardGeocode } = await import("@/utils/location");
        const coords = await forwardGeocode(trimmed);
        return {
          isValid: true,
          formatted: trimmed,
          latitude: coords?.latitude ?? null,
          longitude: coords?.longitude ?? null,
        };
      } catch {
        return {
          isValid: true,
          formatted: trimmed,
          latitude: null,
          longitude: null,
        };
      }
    }

    // 5. Try forward geocoding fallback for international postal codes
    if (/^[A-Z0-9\s-]{3,10}$/i.test(trimmed)) {
      try {
        const { forwardGeocode } = await import("@/utils/location");
        const coords = await forwardGeocode(trimmed);
        if (coords && coords.latitude && coords.longitude) {
          return {
            isValid: true,
            formatted: trimmed.toUpperCase(),
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
        }
      } catch {}
    }

    return {
      isValid: false,
      formatted: "",
      latitude: null,
      longitude: null,
      error: "Invalid zipcode. Please enter a valid zipcode or postcode.",
    };
  }

  async function handleStart() {
    if (isProcessing) return;
    setError("");

    const trimmed = zipcode.trim();
    if (!trimmed) {
      setError("Please enter your zipcode");
      inputRef.current?.focus();
      return;
    }

    setIsProcessing(true);

    try {
      const validation = await checkZipcodeValidity(trimmed);

      if (!validation.isValid) {
        setError(validation.error || "Invalid zipcode. Please enter a valid zipcode.");
        setIsProcessing(false);
        inputRef.current?.focus();
        return;
      }

      // Valid zipcode: match closest branch if coordinates are resolved
      let matchedBranchId = selectedBranchId || (branches.length > 0 ? branches[0].id : 1);
      if (validation.latitude && validation.longitude && branches.length > 0) {
        let minDistance = Infinity;
        for (const b of branches) {
          const bCoords = getBranchCoordinates(b);
          if (bCoords) {
            const d = calculateDistanceKm(
              validation.latitude,
              validation.longitude,
              bCoords.latitude,
              bCoords.longitude
            );
            if (d != null && d < minDistance) {
              minDistance = d;
              matchedBranchId = b.id;
            }
          }
        }
      }

      localStorage.removeItem("manual_branch_override");
      localStorage.setItem("selected_branch_id", String(matchedBranchId));
      localStorage.setItem("user_delivery_address", validation.formatted);

      const payload = {
        order_type: initialMode || "delivery",
        delivery_postcode: validation.formatted,
        branch_id: matchedBranchId,
        latitude: validation.latitude,
        longitude: validation.longitude,
      };

      const result = await createCart(payload).unwrap();
      const cartId = result?.data?.id || result?.id;
      if (cartId) {
        localStorage.setItem("cart_id", String(cartId));
      }

      setClosing(true);
      setTimeout(() => {
        onClose();
        router.push("/menu");
      }, 180);
    } catch (err) {
      console.error("Failed to start order:", err);
      setError("Something went wrong. Please check your zipcode and try again.");
      setIsProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-200 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pacino-start-title"
        className={`relative bg-[#1E1E20] rounded-2xl p-6 sm:p-8 w-full max-w-md text-center border border-white/10 shadow-2xl transform transition-all duration-200 ${
          closing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="mb-3 w-20 h-12 mx-auto relative">
          <Image
            src="/logo.png"
            alt="logo"
            width={80}
            height={48}
            className="w-full h-full object-contain mx-auto"
            priority
          />
        </div>

        <h3
          id="pacino-start-title"
          className="text-[#F9671A] font-bold text-xl sm:text-2xl mb-1 uppercase tracking-wider"
        >
          START YOUR ORDER
        </h3>
        <p className="text-zinc-400 text-xs mb-6 font-medium">
          Order Mode:{" "}
          <span className="text-white font-bold capitalize">
            {initialMode ? initialMode.replace("_", " ") : "Delivery"}
          </span>
        </p>

        {/* Zipcode Input Only */}
        <div className="mb-6 text-left">
          <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">
            Zipcode / Postcode
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={zipcode}
              onChange={(e) => {
                setZipcode(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleStart();
                }
              }}
              placeholder="Enter your zipcode (e.g. NW1 6XE)"
              disabled={isProcessing}
              className={`w-full placeholder:text-zinc-500 text-sm px-4 py-3.5 rounded-xl bg-[#262626] border outline-none transition-all uppercase ${
                error
                  ? "border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/50"
                  : "border-white/10 focus:border-[#F9671A] focus:ring-1 focus:ring-[#F9671A]/50"
              } text-white disabled:opacity-50`}
            />
            {isProcessing && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-[#F9671A] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          {error && (
            <div className="flex items-center gap-1.5 mt-2 ml-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-rose-400 flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs text-rose-400 font-medium">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleStart()}
            disabled={isProcessing}
            type="button"
            className={`w-full py-3.5 text-sm sm:text-base font-bold rounded-full bg-[#F9671A] hover:bg-[#ff7a33] text-white transition-all shadow-lg shadow-orange-600/20 cursor-pointer flex items-center justify-center gap-2 ${
              isProcessing ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Checking...</span>
              </>
            ) : (
              <span>Enter</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
