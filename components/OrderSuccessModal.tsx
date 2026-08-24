"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CheckoutMap from "./CheckoutMap";

type OrderSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orderNumber?: string | null;
  sessionId?: string | null;
  deliveryAddress?: string | null;
  branchName?: string | null;
  totalAmount?: string | number | null;
  branchLat?: number | null;
  branchLng?: number | null;
};

const CONFETTI_COLORS = ["#F9671A", "#ff8547", "#ffffff", "#ffd700", "#ff4444", "#44ff88", "#f97316"];

export default function OrderSuccessModal({
  isOpen,
  onClose,
  orderNumber,
  sessionId,
  deliveryAddress,
  branchName,
  totalAmount,
  branchLat,
  branchLng,
}: OrderSuccessModalProps) {
  const router = useRouter();
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      const t1 = setTimeout(() => setStep(1), 300);
      const t2 = setTimeout(() => setStep(2), 800);
      const t3 = setTimeout(() => setStep(3), 1400);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    } else {
      setVisible(false);
      setStep(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    const fetchRouteInfo = async () => {
      try {
        const { forwardGeocode, getGoogleRouteInfo, calculateDistanceKm, formatDeliveryTime, formatDistance } = await import("@/utils/location");
        if (!deliveryAddress) return;
        const coords = await forwardGeocode(deliveryAddress);
        if (coords && isMounted) setUserCoords(coords);
        const bCoords = (branchLat != null && branchLng != null) ? { latitude: branchLat, longitude: branchLng } : null;
        if (bCoords && coords) {
          const route = await getGoogleRouteInfo(bCoords, coords);
          if (route && isMounted) { setDeliveryInfo(`${route.formattedDeliveryTime} (${route.formattedDistance})`); return; }
          const km = calculateDistanceKm(bCoords.latitude, bCoords.longitude, coords.latitude, coords.longitude);
          if (km != null && isMounted) setDeliveryInfo(`${formatDeliveryTime(km)} (${formatDistance(km)})`);
        }
      } catch (e) { console.warn("Modal route info failed:", e); }
    };
    fetchRouteInfo();
    return () => { isMounted = false; };
  }, [isOpen, deliveryAddress, branchLat, branchLng]);

  if (!isOpen) return null;

  const displayOrderNum = orderNumber || (sessionId ? sessionId.substring(0, 16) + "…" : "ORD-XXXXXXX");

  const timelineSteps = [
    { label: "Order Received", sub: "Kitchen has been notified", done: step >= 1 },
    { label: "Being Prepared", sub: "Chefs are working on it", done: step >= 2 },
    { label: "On the Way", sub: deliveryInfo ? `${deliveryInfo}` : "Delivery driver is on the way", done: step >= 3 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {/* Confetti Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {CONFETTI_COLORS.map((color, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-pulse"
            style={{
              left: `${(i * 14 + 7) % 100}%`,
              top: `${(i * 19 + 5) % 80}%`,
              backgroundColor: color,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      <div
        className={`relative w-full max-w-[480px] bg-[#18181a] border border-white/10 rounded-[28px] p-6 shadow-2xl transition-all duration-500 flex flex-col gap-5 max-h-[90vh] overflow-y-auto scrollbar-hide ${
          visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center gap-2 pt-2">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#F9671A] to-[#ff8547] text-white shadow-xl shadow-orange-600/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div className="absolute inset-0 rounded-full animate-ping bg-[#F9671A] opacity-25" />
          </div>

          <span className="bg-[#3a2016] text-[#F9671A] text-[10px] font-extrabold px-3 py-0.5 rounded-full border border-[#F9671A]/20 uppercase tracking-widest mt-1">
            Payment Successful
          </span>
          <h2 className="text-[22px] font-extrabold text-white mt-0.5">Order Confirmed! 🎉</h2>
          <p className="text-[12px] text-zinc-400 max-w-[340px]">
            Your order <span className="text-white font-bold">{displayOrderNum}</span> has been received
            {branchName ? <> by <span className="text-[#F9671A] font-bold">{branchName}</span></> : ""}.
          </p>
        </div>

        {/* Timeline */}
        <div className="flex flex-col">
          {timelineSteps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-500"
                  style={{
                    background: s.done ? "linear-gradient(135deg, #F9671A, #b83d00)" : "rgba(255,255,255,0.04)",
                    border: s.done ? "none" : "1px solid rgba(255,255,255,0.08)",
                    color: s.done ? "white" : "#555",
                    boxShadow: s.done ? "0 4px 12px rgba(249,103,26,0.35)" : "none",
                  }}
                >
                  {s.done ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (i + 1)}
                </div>
                {i < timelineSteps.length - 1 && (
                  <div
                    className="w-px transition-all duration-700"
                    style={{ height: "32px", background: s.done ? "linear-gradient(180deg, #F9671A66, #F9671A22)" : "rgba(255,255,255,0.05)" }}
                  />
                )}
              </div>
              <div className={`pt-1 pb-4 transition-opacity duration-400 ${s.done ? "opacity-100" : "opacity-25"}`}>
                <p className="text-[13px] font-bold text-white">{s.label}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="rounded-[20px] overflow-hidden border border-white/5 bg-[#181819]">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
            <div className="flex items-center gap-2 text-[12px] font-bold text-zinc-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              Estimated Delivery
            </div>
            <span className="text-[12px] font-extrabold text-[#F9671A]">{deliveryInfo || "Calculating…"}</span>
          </div>
          <div style={{ height: "130px" }}>
            <CheckoutMap
              branchLat={branchLat ?? null}
              branchLng={branchLng ?? null}
              branchName={branchName ?? undefined}
              userLat={userCoords?.latitude}
              userLng={userCoords?.longitude}
              distanceText={deliveryInfo}
            />
          </div>
        </div>

        {/* Summary chips */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { emoji: "📍", label: "Delivery", value: deliveryAddress?.split(",")[0] || "Your address" },
            { emoji: "✅", label: "Payment", value: "Confirmed" },
            {
              emoji: "💰",
              label: "Total",
              value: totalAmount
                ? typeof totalAmount === "number" ? `£${totalAmount.toFixed(2)}` : String(totalAmount)
                : "—",
            },
          ].map((c) => (
            <div key={c.label} className="bg-[#181819] border border-white/5 rounded-[14px] p-3 text-center flex flex-col items-center gap-0.5">
              <span className="text-[18px]">{c.emoji}</span>
              <span className="text-[10px] text-zinc-500 font-medium">{c.label}</span>
              <span className="text-[12px] text-white font-bold truncate w-full text-center">{c.value}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 pb-2">
          <button
            onClick={() => { onClose(); router.push("/my-orders"); }}
            className="w-full py-4 rounded-2xl font-bold text-[14px] text-white cursor-pointer flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #F9671A 0%, #c94400 100%)", boxShadow: "0 8px 24px rgba(249,103,26,0.35)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Track My Order
          </button>
          <button
            onClick={() => { onClose(); router.push("/menu"); }}
            className="w-full py-3.5 rounded-2xl font-bold text-[14px] text-zinc-300 hover:text-white border border-white/8 hover:border-white/15 bg-white/4 hover:bg-white/8 cursor-pointer transition-all"
          >
            Order More Food
          </button>
        </div>
      </div>
    </div>
  );
}
