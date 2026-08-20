"use client";

import { useState, useEffect } from "react";
import CheckoutMap from "@/components/CheckoutMap";
import { Order, useCreateOrderMutation, useGetOrderByIdQuery } from "@/redux/features/api/ordersApi";
import { toast } from "react-hot-toast";

type Props = {
  orderId?: string | number | null;
  order?: Order | null;
};

export default function OrderDetailsSidebar({ orderId, order: propOrder }: Props) {
  const { data: fetchedOrder } = useGetOrderByIdQuery(orderId!, {
    skip: !orderId || !!propOrder,
  });

  const [createOrderMut, { isLoading: isReordering }] = useCreateOrderMutation();

  const order = propOrder || fetchedOrder || null;

  const [deliveryCoords, setDeliveryCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [branchCoords, setBranchCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const computeMapDistance = async () => {
      if (!order) return;
      const { forwardGeocode, calculateDistanceKm, getUserLocation, getBranchCoordinates } = await import("@/utils/location");

      const bCoords = getBranchCoordinates(order.branch);
      if (isMounted) {
        setBranchCoords(bCoords);
      }

      let dCoords: { latitude: number; longitude: number } | null = null;
      if (order.delivery_address) {
        dCoords = await forwardGeocode(order.delivery_address);
      }

      if (!dCoords) {
        dCoords = await getUserLocation();
      }

      if (dCoords && isMounted) {
        setDeliveryCoords(dCoords);
      }

      if (bCoords && dCoords) {
        const km = calculateDistanceKm(bCoords.latitude, bCoords.longitude, dCoords.latitude, dCoords.longitude);
        if (isMounted) setDistanceKm(km);
      } else if (isMounted) {
        setDistanceKm(null);
      }
    };

    computeMapDistance();
    return () => {
      isMounted = false;
    };
  }, [order?.id, order?.delivery_address, order?.branch?.id, order?.branch?.name, order?.branch?.address]);

  const riderLat = order?.assigned_driver?.latitude || null;
  const riderLng = order?.assigned_driver?.longitude || null;

  const distanceText = distanceKm != null ? `${distanceKm} km away` : null;

  const handleReorder = async () => {
    if (!order) {
      toast.error("Order details unavailable for reordering.");
      return;
    }
    try {
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

      toast.success("Re-order placed successfully!");
    } catch (err: any) {
      console.error("Reorder failed:", err);
      toast.error(err?.data?.message || "Failed to re-order item.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-4 mx-6 px-0 mb-4 flex flex-col gap-4 flex-shrink-0">
        <div className="border-b border-white/5 pb-3">
          <h3 className="text-[17px] font-bold text-white">Map Location</h3>
        </div>
        <div className="w-full h-[220px] rounded-[16px] overflow-hidden shadow-lg bg-[#252527]">
          <CheckoutMap
            branchLat={branchCoords?.latitude || order?.branch?.latitude || null}
            branchLng={branchCoords?.longitude || order?.branch?.longitude || null}
            userLat={deliveryCoords?.latitude || null}
            userLng={deliveryCoords?.longitude || null}
            riderLat={riderLat}
            riderLng={riderLng}
            distanceText={distanceText}
            userAvatar={order?.user?.avatar_url || null}
          />
        </div>
      </div>
      <div className="px-6">
        <button
          onClick={handleReorder}
          disabled={isReordering}
          className="w-full py-3.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[14px] font-bold transition-colors shadow-lg shadow-orange-600/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isReordering ? "Processing..." : "Re-order this item"}
        </button>
      </div>
    </div>
  );
}