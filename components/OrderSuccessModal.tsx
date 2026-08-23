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
        const { getUserLocation, forwardGeocode, getMapboxRouteInfo, calculateDistanceKm, formatDeliveryTime, formatDistance } = await import("@/utils/location");
        let coords: { latitude: number; longitude: number } | null = null;
        if (deliveryAddress) coords = await forwardGeocode(deliveryAddress);
        if (!coords) coords = await getUserLocation();
        if (coords && isMounted) setUserCoords(coords);
        const bCoords = { latitude: branchLat || 51.4554, longitude: branchLng || 0.0538 };
        if (bCoords && coords) {
          const mbRoute = await getMapboxRouteInfo(bCoords, coords);
          if (mbRoute && isMounted) { setDeliveryInfo(`${mbRoute.formattedDeliveryTime} (${mbRoute.formattedDistance})`); return; }
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
    { label: "On the Way", sub: deliveryInfo || "Calculating delivery time…", done: step >= 3 },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${(i * 4.8 + 3) % 94}%`,
            top: `-12px`,
            width: i % 3 === 0 ? "10px" : "7px",
            height: i % 3 === 0 ? "10px" : "7px",
            borderRadius: i % 2 === 0 ? "50%" : "2px",
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animation: `confettiFall 2.8s ease-out ${(i * 0.09).toFixed(2)}s forwards`,
            opacity: 0,
          }}
        />
      ))}

      <div
        className="relative w-full sm:max-w-lg bg-[#111113] border border-white/10 sm:rounded-[32px] rounded-t-[32px] shadow-2xl z-10 text-white flex flex-col"
        style={{
          maxHeight: "94dvh",
          overflowY: "auto",
          transform: visible ? "translateY(0)" : "translateY(40px)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
        }}
      >
        <div className="h-1 w-full flex-shrink-0 bg-gradient-to-r from-[#F9671A] via-[#ffb347] to-[#F9671A]" />

        <div className="p-5 sm:p-7 flex flex-col gap-5">
          {/* Checkmark hero */}
          <div className="flex flex-col items-center text-center gap-3 pb-5 border-b border-white/5">
            <div className="relative flex items-center justify-center mt-2 mb-1">
              <div className="absolute w-24 h-24 rounded-full border border-[#F9671A]/15 animate-ping" style={{ animationDuration: "2s" }} />
              <div className="absolute w-20 h-20 rounded-full border border-[#F9671A]/25" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F9671A] to-[#b83d00] flex items-center justify-center shadow-2xl shadow-orange-700/50 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold px-3.5 py-1.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Payment Successful
            </div>

            <h2 className="text-[24px] sm:text-[28px] font-black text-white leading-tight">Order Confirmed! 🎉</h2>
            <p className="text-zinc-400 text-[13px] max-w-sm">
              Your order <span className="font-bold text-white">{displayOrderNum}</span> has been received by{" "}
              <span className="text-[#F9671A] font-semibold">{branchName || "Pacino's Restaurant"}</span>
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
                branchLat={branchLat || 51.4554}
                branchLng={branchLng || 0.0538}
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

      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          80%  { opacity: 0.7; }
          100% { transform: translateY(100dvh) rotate(900deg) scale(0.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
