import Image from "next/image";
import OrderTimeline from "@/components/Ordertimeline";
import OrderSummary from "@/components/Ordersummary";
import { Order, useGetOrderByIdQuery } from "@/redux/features/api/ordersApi";

type Props = {
  orderId?: string | number | null;
  order?: Order | null;
};

export default function OrderDetailsView({ orderId, order: propOrder }: Props) {
  const { data: fetchedOrder } = useGetOrderByIdQuery(orderId!, {
    skip: !orderId || !!propOrder,
  });

  const order = propOrder || fetchedOrder || null;

  const getImageUrl = (url?: string | null) => {
    if (!url) return "/customer/most-popular-1.png";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/customer")) return url;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const firstItem = order?.items?.[0];
  const itemTitle = firstItem ? `${firstItem.item_name || firstItem.menu_item?.name} - ${firstItem.menu_item?.slug || "Menu"}` : "Filet Mignon - Steaks";
  const itemImg = getImageUrl(firstItem?.menu_item?.image_url || firstItem?.menu_item?.image);
  const qty = firstItem?.quantity || 1;
  const price = order ? parseFloat(String(order.total)).toFixed(2) : "95";

  const formattedDate = order?.created_at
    ? `Ordered on ${new Date(order.created_at).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "2-digit",
      })}, ${new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : "Delivered on Sunday, May 04, 4:30 PM";

  const orderNum = order?.order_number || "t7ml-2542-c4kj";

  return (
    <div className="max-w-[700px]">
      <div className="bg-[#252527] rounded-[20px] p-6 mb-8">
        <div className="flex gap-4 items-center mb-8">
          <div className="w-[90px] h-[70px] rounded-[12px] overflow-hidden relative flex-shrink-0 bg-[#1a1a1c]">
            <Image src={itemImg} alt="Order Item" fill className="object-cover" />
            <div className="absolute bottom-1 right-1 text-[8px] bg-black/60 px-1 rounded">{qty}x: £{price}</div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[18px] font-bold text-white truncate">{itemTitle}</h3>
            <p className="text-[12px] text-zinc-400 mt-0.5">{formattedDate}</p>
            <p className="text-[12px] text-zinc-500">Order #{orderNum}</p>
          </div>
        </div>

        <OrderTimeline order={order} />
      </div>

      <OrderSummary order={order} />
      <div className="pb-10"></div>
    </div>
  );
}