"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Order } from "@/redux/features/api/ordersApi";

type Props = {
  order?: Order | null;
  mapboxEstTimeText?: string | null;
};

export default function OrderTimeline({ order, mapboxEstTimeText }: Props) {
  const [computedEstText, setComputedEstText] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const computeMapboxTime = async () => {
      if (!order) return;
      try {
        const {
          getBranchCoordinates,
          forwardGeocode,
          getUserLocation,
          getMapboxRouteInfo,
          calculateDistanceKm,
          calculateDeliveryMins,
        } = await import("@/utils/location");

        const bCoords = getBranchCoordinates(order.branch);
        let dCoords: { latitude: number; longitude: number } | null = null;

        if (order.delivery_address) {
          dCoords = await forwardGeocode(order.delivery_address);
        }
        if (!dCoords) {
          dCoords = await getUserLocation();
        }

        if (bCoords && dCoords) {
          const mbRoute = await getMapboxRouteInfo(bCoords, dCoords);
          if (mbRoute && isMounted) {
            setComputedEstText(`Est: ${mbRoute.deliveryMins} mins`);
            return;
          }

          const km = calculateDistanceKm(
            bCoords.latitude,
            bCoords.longitude,
            dCoords.latitude,
            dCoords.longitude
          );
          if (km != null && isMounted) {
            const mins = calculateDeliveryMins(km);
            if (mins) setComputedEstText(`Est: ${mins} mins`);
          }
        }
      } catch (e) {
        // Silently fallback
      }
    };

    computeMapboxTime();
    return () => {
      isMounted = false;
    };
  }, [order?.id, order?.delivery_address, order?.branch?.id]);

  const status = (order?.order_status || "pending").toLowerCase();

  const isPendingActive = ["pending", "preparing", "ready_for_delivery", "out_for_delivery", "delivered"].includes(status);
  const isPreparingActive = ["preparing", "ready_for_delivery", "out_for_delivery", "delivered"].includes(status);
  const isReadyActive = ["ready_for_delivery", "out_for_delivery", "delivered"].includes(status);
  const isOutActive = ["out_for_delivery", "delivered"].includes(status);
  const isDeliveredActive = status === "delivered";

  const branchName = order?.branch?.name || "Cloud Gate (The Bean), Chicago";
  const driverName = order?.assigned_driver?.name ? `Driver (${order.assigned_driver.name}) is on the way to you.` : "Delivery Driver is on the way to you.";
  const deliveryAddr = order?.delivery_address || "7 Elm Street, Woodstock, OX7 1ER";

  const estTime =
    mapboxEstTimeText ||
    computedEstText ||
    (order?.estimated_delivery_time
      ? `Est: ${new Date(order.estimated_delivery_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : "Est: 25 mins");

  const steps = [
    {
      status: "Order Received",
      desc: branchName,
      time: "",
      active: isPendingActive,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      status: "Preparing",
      desc: "Our kitchen is cooking your dish",
      time: estTime,
      active: isPreparingActive,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 18h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" />
          <path d="M9 6V3" />
          <path d="M15 6V3" />
          <path d="M12 6V3" />
        </svg>
      ),
    },
    {
      status: "Ready for delivery",
      desc: "Your order ready for delivery",
      time: "",
      active: isReadyActive,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      status: "Out for delivery",
      desc: driverName,
      time: "",
      active: isOutActive,
      avatars: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      status: "Delivered to",
      desc: deliveryAddr,
      time: "",
      active: isDeliveredActive,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-0 relative">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const lineClass =
          i === 0
            ? "absolute left-[15px] top-8 bottom-0 w-[1.5px] bg-[#F9671A]"
            : "absolute left-[15px] top-8 bottom-0 w-[1.5px] border-l border-dashed border-white/10";

        return (
          <div key={i} className="flex gap-4 relative pb-7 last:pb-0">
            {!isLast && <div className={lineClass}></div>}

            <div
              className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 z-10 ${
                step.active
                  ? "border-[#F9671A]/40 bg-[#3a2016] text-[#F9671A]"
                  : "border-white/10 bg-[#212124] text-zinc-500"
              }`}
            >
              {step.icon}
            </div>

            <div className="flex-1 mt-0.5">
              <div className="flex items-center gap-2.5">
                <h4 className={`text-[13px] font-bold ${step.active ? "text-[#F9671A]" : "text-zinc-500"}`}>
                  {step.status}
                </h4>
                {step.time && (
                  <span className="bg-[#3a2016] text-[#F9671A] text-[9px] font-bold px-2 py-0.5 rounded border border-[#F9671A]/20">
                    {step.time}
                  </span>
                )}
                {step.avatars && (
                  <div className="flex -space-x-1.5 ml-0.5">
                    <div className="w-5 h-5 rounded-full border border-[#252527] bg-zinc-800 overflow-hidden relative z-10">
                      <Image src="/customer/banner-men.png" alt="Avatar" fill className="object-cover" />
                    </div>
                    <div className="w-5 h-5 rounded-full border border-[#252527] bg-zinc-700 overflow-hidden relative z-0">
                      <Image src="/customer/banner-woman.png" alt="Avatar" fill className="object-cover" />
                    </div>
                  </div>
                )}
              </div>
              <p className="text-[15px] font-bold text-white mt-1.5 leading-snug">{step.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}