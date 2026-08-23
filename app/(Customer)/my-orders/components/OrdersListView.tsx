"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/Ordercard";
import { Order, useGetOrdersQuery, useCreateOrderMutation } from "@/redux/features/api/ordersApi";
import { toast } from "react-hot-toast";

export type OrderSummaryItem = {
  id: string;
  rawId: number | string;
  image: string;
  badge: string;
  title: string;
  deliveredText: string;
  orderId: string;
  qty: number;
  price: string;
  date: string;
  rawOrder: Order;
  estimatedTimeText?: string;
};

type Props = {
  onSelectOrder: (orderId: string | number) => void;
};

function ActiveOrderCard({
  order,
  onSelect,
}: {
  order: OrderSummaryItem;
  onSelect: () => void;
}) {
  const [deliveryInfo, setDeliveryInfo] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const computeMapboxInfo = async () => {
      try {
        const {
          getBranchCoordinates,
          forwardGeocode,
          getUserLocation,
          getMapboxRouteInfo,
          calculateDistanceKm,
          formatDeliveryTime,
          formatDistance,
        } = await import("@/utils/location");

        const raw = order.rawOrder;
        const bCoords = getBranchCoordinates(raw?.branch);

        let dCoords: { latitude: number; longitude: number } | null = null;
        if (raw?.delivery_address) {
          dCoords = await forwardGeocode(raw.delivery_address);
        }
        if (!dCoords) {
          dCoords = await getUserLocation();
        }

        if (bCoords && dCoords) {
          const mbRoute = await getMapboxRouteInfo(bCoords, dCoords);
          if (mbRoute && isMounted) {
            setDeliveryInfo(
              `${mbRoute.formattedDeliveryTime} (${mbRoute.formattedDistance})`
            );
            return;
          }

          // Fallback if Mapbox Directions API route unavailable
          const km = calculateDistanceKm(
            bCoords.latitude,
            bCoords.longitude,
            dCoords.latitude,
            dCoords.longitude
          );
          if (km != null && isMounted) {
            setDeliveryInfo(`${formatDeliveryTime(km)} (${formatDistance(km)})`);
            return;
          }
        }
      } catch (e) {
        // Silently fallback to standard text
      }
    };

    computeMapboxInfo();
    return () => {
      isMounted = false;
    };
  }, [order.rawOrder?.id, order.rawOrder?.delivery_address]);

  // Active statuses from DB enum
  const ACTIVE_STATUSES = ["pending", "accepted", "preparing", "ready", "out_for_delivery"];
  const PAST_STATUSES   = ["completed", "cancelled", "refunded"];

  const STATUS_LABELS: Record<string, string> = {
    pending:          "Pending",
    accepted:         "Accepted",
    preparing:        "Preparing",
    ready:            "Ready for Pickup",
    out_for_delivery: "Out for Delivery",
    completed:        "Completed",
    cancelled:        "Cancelled",
    refunded:         "Refunded",
  };

  const statusText = STATUS_LABELS[order.rawOrder?.order_status || ""] || order.rawOrder?.order_status || "Active";

  const displayedText = deliveryInfo
    ? `${statusText} • Est: ${deliveryInfo}`
    : order.deliveredText;

  return (
    <div className="mb-6">
      <p className="text-[12px] text-zinc-400 mb-4">{order.date}</p>
      <OrderCard
        image={order.image}
        badge={order.badge}
        title={order.title}
        deliveredText={displayedText}
        orderId={order.orderId}
        qty={order.qty}
        price={order.price}
        onClick={onSelect}
      />
    </div>
  );
}

export default function OrdersListView({ onSelectOrder }: Props) {
  const { data: ordersRes, isLoading, isError, refetch } = useGetOrdersQuery(
    undefined,
    { refetchOnMountOrArgChange: true, pollingInterval: 30000 }
  );
  const [createOrderMut] = useCreateOrderMutation();

  const getImageUrl = (url?: string | null) => {
    if (!url) return "/customer/most-popular-1.png";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/customer")) return url;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const formatOrderToSummary = (order: Order): OrderSummaryItem => {
    const firstItem = order.items?.[0];
    const image = getImageUrl(firstItem?.menu_item?.image_url || firstItem?.menu_item?.image);
    const badge = firstItem?.size_name || order.order_type || "Steaks";
    const title = firstItem ? `${firstItem.item_name || firstItem.menu_item?.name}` : "Order Items";
    const statusLabel = STATUS_LABELS[order.order_status || ""] || order.order_status || "Order";
    const deliveredText = `${statusLabel} • ${order.delivery_address || "Standard Delivery"}`;
    const orderId = order.order_number || String(order.id);
    const qty = firstItem?.quantity || 1;
    const price = `£${parseFloat(String(order.total || 0)).toFixed(2)}`;
    const date = order.created_at
      ? new Date(order.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "May 05, 12:45 PM";

    return {
      id: String(order.id),
      rawId: order.id,
      image,
      badge,
      title,
      deliveredText,
      orderId,
      qty,
      price,
      date,
      rawOrder: order,
    };
  };

  // Active: order still in progress
  const ACTIVE_STATUSES = ["pending", "accepted", "preparing", "ready", "out_for_delivery"];
  const PAST_STATUSES   = ["completed", "cancelled", "refunded"];

  const STATUS_LABELS: Record<string, string> = {
    pending:          "Pending — awaiting confirmation",
    accepted:         "Accepted — kitchen confirmed",
    preparing:        "Preparing",
    ready:            "Ready for Pickup",
    out_for_delivery: "Out for Delivery",
    completed:        "Completed",
    cancelled:        "Cancelled",
    refunded:         "Refunded",
  };

  const allOrders = ordersRes?.data || [];
  const activeOrdersList = allOrders
    .filter((o) => ACTIVE_STATUSES.includes(o.order_status))
    .map(formatOrderToSummary);
  const pastOrdersList = allOrders
    .filter((o) => PAST_STATUSES.includes(o.order_status))
    .map(formatOrderToSummary);

  const activeOrders = activeOrdersList.length > 0 ? activeOrdersList : [];
  const pastOrders = pastOrdersList.length > 0 ? pastOrdersList : [];

  const handleReorder = async (orderItem: OrderSummaryItem) => {
    try {
      const order = orderItem.rawOrder;
      const itemsPayload = (order.items || []).map((item) => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        size_id: item.size_id || null,
        cooking_preference_id: item.cooking_preference_id || null,
        spice_level_id: item.spice_level_id || null,
        unit_price: parseFloat(item.unit_price || "0"),
        special_instructions: item.special_instructions || null,
      }));

      await createOrderMut({
        branch_id: order.branch_id || 1,
        order_type: order.order_type || "delivery",
        payment_method: order.payment_method || "stripe",
        customer_name: order.customer_name || "",
        customer_phone: order.customer_phone || "",
        delivery_address: order.delivery_address || "",
        items: itemsPayload.length > 0 ? itemsPayload : undefined,
      }).unwrap();

      toast.success("Order placed successfully!");
    } catch (err: any) {
      console.error("Reorder error:", err);
      toast.error(err?.data?.message || "Failed to re-order item.");
    }
  };

  return (
    <div className="max-w-[800px]">
      {isLoading && (
        <div className="text-zinc-400 text-sm py-4">Loading orders...</div>
      )}

      {isError && (
        <div className="text-red-400 text-xs py-2">
          Could not fetch latest orders from server. Showing saved orders.
        </div>
      )}

      {activeOrders.length > 0 && (
        <div className="mb-10">
          <h2 className="text-[16px] font-bold text-white mb-1">Active Orders</h2>
          {activeOrders.map((order) => (
            <ActiveOrderCard
              key={order.id}
              order={order}
              onSelect={() => onSelectOrder(order.rawId)}
            />
          ))}
        </div>
      )}

      {pastOrders.length > 0 && (
        <div>
          <h2 className="text-[16px] font-bold text-white mb-1">Past Orders</h2>
          {pastOrders.map((order) => (
            <div key={order.id} className="mb-6">
              <p className="text-[12px] text-zinc-400 mb-3">{order.date}</p>
              <OrderCard
                image={order.image}
                badge={order.badge}
                title={order.title}
                deliveredText={order.deliveredText}
                orderId={order.orderId}
                qty={order.qty}
                price={order.price}
                showReorder
                onClick={() => onSelectOrder(order.rawId)}
                onReorder={() => handleReorder(order)}
              />
            </div>
          ))}
        </div>
      )}

      {!isLoading && activeOrders.length === 0 && pastOrders.length === 0 && (
        <div className="text-zinc-400 text-sm py-8 text-center bg-[#252527] rounded-[16px]">
          No orders found.
        </div>
      )}
    </div>
  );
}