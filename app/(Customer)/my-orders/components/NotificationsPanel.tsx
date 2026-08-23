"use client";

import { useEffect, useState } from "react";
import { useGetOrdersQuery } from "@/redux/features/api/ordersApi";

type Notification = {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
};

export default function NotificationsPanel() {
  const { data: ordersRes } = useGetOrdersQuery();
  const [estTimes, setEstTimes] = useState<Record<string, string>>({});

  const activeOrders = (ordersRes?.data || []).filter(
    (o) => o.order_status !== "delivered" && o.order_status !== "cancelled"
  );

  useEffect(() => {
    let isMounted = true;
    const computeMapboxTimes = async () => {
      const {
        getBranchCoordinates,
        forwardGeocode,
        getUserLocation,
        getMapboxRouteInfo,
      } = await import("@/utils/location");

      const timesMap: Record<string, string> = {};

      for (const o of activeOrders) {
        try {
          const bCoords = getBranchCoordinates(o.branch);
          let dCoords = o.delivery_address
            ? await forwardGeocode(o.delivery_address)
            : null;
          if (!dCoords) {
            dCoords = await getUserLocation();
          }

          if (bCoords && dCoords) {
            const mbRoute = await getMapboxRouteInfo(bCoords, dCoords);
            if (mbRoute) {
              timesMap[String(o.id)] = `${mbRoute.deliveryMins} mins`;
            }
          }
        } catch (e) {
          // Fallback
        }
      }

      if (isMounted && Object.keys(timesMap).length > 0) {
        setEstTimes(timesMap);
      }
    };

    if (activeOrders.length > 0) {
      computeMapboxTimes();
    }
    return () => {
      isMounted = false;
    };
  }, [activeOrders.map((o) => `${o.id}-${o.delivery_address}`).join(",")]);

  const dynamicNotifications: Notification[] = activeOrders.map((o) => {
    const isPrep = o.order_status === "preparing";
    const est = estTimes[String(o.id)] || "25 mins";

    return {
      id: String(o.id),
      title: `Order #${o.order_number || o.id} is ${isPrep ? "Preparing" : o.order_status}`,
      desc: isPrep
        ? `Our kitchen is cooking your dish - Estimated time ${est}.`
        : `Your order status is ${o.order_status}`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F9671A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    };
  });

  const defaultNotifications: Notification[] = [
    {
      id: "preparing",
      title: "Order #t7ml-2542 is Preparing",
      desc: "Our kitchen is cooking your dish - Estimated time 25 mins.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
    {
      id: "received",
      title: "Order #t7ml-2542 Received",
      desc: "Your order has been received by our kitchen",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
          <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
          <path d="M12 3v6" />
        </svg>
      ),
    },
  ];

  const notifications = dynamicNotifications.length > 0 ? dynamicNotifications : defaultNotifications;

  return (
    <div className="p-6 flex flex-col gap-4 overflow-y-auto">
      {notifications.map((n) => (
        <div key={n.id} className="bg-[#2a2a2c] rounded-[16px] p-4 flex gap-3 relative shadow-lg">
          <button className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-[#3a2016] flex items-center justify-center flex-shrink-0 mt-0.5">{n.icon}</div>
          <div className="pr-4">
            <h4 className="text-[12.5px] font-bold text-white mb-0.5 leading-tight">{n.title}</h4>
            <p className="text-[10px] text-zinc-400 leading-tight">{n.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}