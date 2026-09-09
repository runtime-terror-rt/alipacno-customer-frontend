"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import CheckoutMap from "@/components/CheckoutMap";
import { useGetOrderByIdQuery, useGetOrdersQuery, Order } from "@/redux/features/api/ordersApi";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  const orderNumParam = searchParams.get("order_number");

  const targetId = orderId || orderNumParam || null;

  // Query specific order by ID if provided in URL
  const { data: specificOrder } = useGetOrderByIdQuery(targetId!, {
    skip: !targetId,
    refetchOnMountOrArgChange: true,
  });

  // Query latest order as fallback
  const { data: latestOrdersRes } = useGetOrdersQuery(
    { page: 1, per_page: 1 },
    { refetchOnMountOrArgChange: true }
  );

  const activeOrder: Order | null =
    specificOrder ||
    (latestOrdersRes?.data && latestOrdersRes.data.length > 0 ? latestOrdersRes.data[0] : null);

  const [deliveryAddress, setDeliveryAddress] = useState<string>("Standard Delivery");
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<string | null>(null);
  const [branchInfo, setBranchInfo] = useState<{ name: string; lat: number; lng: number } | null>(null);

  // Sync branch and address from activeOrder or localStorage
  useEffect(() => {
    if (activeOrder?.delivery_address) {
      setDeliveryAddress(activeOrder.delivery_address);
    } else if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user_delivery_address");
      if (saved && saved.trim()) {
        setDeliveryAddress(saved);
      }
    }

    if (activeOrder?.branch) {
      const bLat = Number(activeOrder.branch.latitude);
      const bLng = Number(activeOrder.branch.longitude);
      setBranchInfo({
        name: activeOrder.branch.name || "Restaurant Branch",
        lat: !isNaN(bLat) && bLat !== 0 ? bLat : 51.4554,
        lng: !isNaN(bLng) && bLng !== 0 ? bLng : 0.0538,
      });
    } else if (typeof window !== "undefined") {
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
  }, [activeOrder]);

  // Compute geocode and distance info dynamically
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

        if (!deliveryAddress || deliveryAddress === "Standard Delivery") return;
        const coords = await forwardGeocode(deliveryAddress);

        if (coords && isMounted) {
          setUserCoords(coords);
        }

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

  // Dynamic order reference
  const displayOrderNum =
    activeOrder?.order_number
      ? `#${activeOrder.order_number}`
      : orderNumParam || orderId
      ? `#${orderNumParam || orderId}`
      : sessionId
      ? `#${sessionId.substring(0, 16)}...`
      : activeOrder?.id
      ? `#ORD-${activeOrder.id}`
      : "#ORD-SUCCESS";

  // Dynamic payment status display
  const rawMethod = activeOrder?.payment_method?.toLowerCase() || (sessionId ? "stripe" : "cash");
  const paymentMethodLabel = rawMethod === "stripe" ? "Stripe" : rawMethod === "cash" ? "Cash" : rawMethod.toUpperCase();
  const rawPaymentStatus = activeOrder?.payment_status?.toLowerCase() || (sessionId ? "paid" : "completed");
  const isPaid = rawPaymentStatus === "paid" || rawPaymentStatus === "completed" || Boolean(sessionId);

  const paymentStatusDisplay = isPaid
    ? `Paid via ${paymentMethodLabel}`
    : `Pending (${paymentMethodLabel})`;

  // Dynamic status banner message
  const statusBannerMsg = (() => {
    const st = activeOrder?.order_status?.toLowerCase();
    if (st === "pending") return "is received and awaiting confirmation.";
    if (st === "accepted" || st === "preparing") return "is confirmed and being prepared by our kitchen.";
    if (st === "ready") return "is prepared and ready for dispatch.";
    if (st === "out_for_delivery") return "is on the way with our rider!";
    if (st === "completed" || st === "delivered") return "has been completed. Enjoy your meal!";
    return "is received and being prepared by our kitchen.";
  })();

  const estimatedTimeText = activeOrder?.estimated_delivery_time || deliveryInfo || "20-30 mins delivery";

  return (
    <div className="min-h-[100dvh] w-full bg-[#1E1E20] text-white flex flex-col font-sans select-none">
      <Header />

      <main className="flex-1 max-w-[620px] w-full mx-auto px-4 py-5 flex flex-col justify-center gap-4">
        {/* Animated Checkmark Banner - Compact */}
        <div className="bg-[#252527] rounded-[20px] p-5 sm:p-6 flex flex-col items-center text-center gap-3 border border-white/5 shadow-xl relative overflow-hidden">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#F9671A] to-[#ff8547] text-white shadow-lg shadow-orange-600/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
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
            <span className={`text-[10px] font-extrabold px-3 py-0.5 rounded-full border uppercase tracking-widest ${
              isPaid
                ? "bg-[#1d3325] text-emerald-400 border-emerald-500/30"
                : "bg-[#3a2016] text-[#F9671A] border-[#F9671A]/20"
            }`}>
              {isPaid ? "Payment Successful" : "Order Placed"}
            </span>
            <h1 className="text-[22px] sm:text-[25px] font-extrabold text-white mt-2 leading-tight">
              Order Confirmed!
            </h1>
            <p className="text-[13px] text-zinc-400 mt-1 max-w-[440px] mx-auto">
              Thank you for ordering with Pacino&apos;s. Order <span className="text-white font-bold">{displayOrderNum}</span> {statusBannerMsg}
            </p>
          </div>
        </div>

        {/* Delivery Estimation & Map Location - Compact */}
        <div className="bg-[#252527] rounded-[20px] p-4 border border-white/5 shadow-lg flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <h3 className="text-[14px] font-bold text-white">Live Delivery Estimate</h3>
            </div>
            <span className="bg-[#3a2016] text-[#F9671A] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#F9671A]/20">
              {estimatedTimeText}
            </span>
          </div>

          <div className="w-full h-[170px] rounded-[14px] overflow-hidden shadow-inner">
            <CheckoutMap
              branchLat={branchInfo?.lat ?? null}
              branchLng={branchInfo?.lng ?? null}
              branchName={branchInfo?.name ?? undefined}
              userLat={userCoords?.latitude}
              userLng={userCoords?.longitude}
              riderLat={activeOrder?.assigned_driver?.latitude ? Number(activeOrder.assigned_driver.latitude) : null}
              riderLng={activeOrder?.assigned_driver?.longitude ? Number(activeOrder.assigned_driver.longitude) : null}
              distanceText={deliveryInfo}
            />
          </div>
        </div>

        {/* Order Details Summary - Compact */}
        <div className="bg-[#252527] rounded-[20px] p-4 border border-white/5 flex flex-col gap-2.5 text-[13px]">
          <h3 className="text-[15px] font-bold text-white mb-0.5">Order Details</h3>
          <div className="flex justify-between items-center text-zinc-400 border-b border-white/5 pb-2">
            <span>Order Reference</span>
            <span className="text-white font-semibold">{displayOrderNum}</span>
          </div>
          <div className="flex justify-between items-center text-zinc-400 border-b border-white/5 pb-2">
            <span>Restaurant Branch</span>
            <span className="text-white font-semibold">{branchInfo?.name || "Selected Branch"}</span>
          </div>
          <div className="flex justify-between items-center text-zinc-400 border-b border-white/5 pb-2">
            <span>Delivery Location</span>
            <span className="text-white font-semibold truncate max-w-[260px]">
              {deliveryAddress}
            </span>
          </div>
          <div className="flex justify-between items-center text-zinc-400">
            <span>Payment Status</span>
            <span className={`font-bold flex items-center gap-1.5 ${isPaid ? "text-emerald-400" : "text-[#F9671A]"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {paymentStatusDisplay}
            </span>
          </div>
        </div>

        {/* Items Summary - Compact */}
        {activeOrder?.items && activeOrder.items.length > 0 && (
          <div className="bg-[#252527] rounded-[20px] p-4 border border-white/5 flex flex-col gap-2.5">
            <h3 className="text-[15px] font-bold text-white mb-0.5">Items Ordered ({activeOrder.items.length})</h3>
            <div className="flex flex-col gap-2">
              {activeOrder.items.map((item, idx) => (
                <div key={item.id || idx} className="flex justify-between items-center text-xs py-1 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded bg-[#3a2016] text-[#F9671A] font-extrabold text-[11px] flex items-center justify-center">
                      {item.quantity}x
                    </span>
                    <div>
                      <p className="text-white font-medium text-xs">{item.item_name || item.menu_item?.name || "Menu Item"}</p>
                      {item.size_name && (
                        <span className="text-[10px] text-zinc-400">Size: {item.size_name}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-white font-bold text-xs">
                    £{parseFloat(String(item.subtotal || (Number(item.unit_price || 0) * item.quantity))).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="mt-1 pt-2.5 border-t border-white/10 flex flex-col gap-1 text-xs text-zinc-400">
              {activeOrder.subtotal != null && (
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">£{parseFloat(String(activeOrder.subtotal)).toFixed(2)}</span>
                </div>
              )}
              {activeOrder.delivery_fee != null && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-white font-medium">£{parseFloat(String(activeOrder.delivery_fee)).toFixed(2)}</span>
                </div>
              )}
              {activeOrder.total != null && (
                <div className="flex justify-between text-xs font-extrabold text-white pt-1.5 border-t border-white/10">
                  <span>Total Amount</span>
                  <span className="text-[#F9671A]">£{parseFloat(String(activeOrder.total)).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Action Buttons - Compact */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1 pb-6">
          <button
            onClick={() => router.push("/my-orders")}
            className="w-full py-3 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-xs sm:text-sm font-bold transition-all shadow-md shadow-orange-600/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Track Order Status in My Orders
          </button>
          <button
            onClick={() => router.push("/menu")}
            className="w-full py-3 bg-[#2a2a2c] hover:bg-[#323235] text-zinc-300 hover:text-white rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
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


