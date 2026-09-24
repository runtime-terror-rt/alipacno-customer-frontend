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
  const paymentMethod = order?.payment_method || order?.payment?.payment_method;
  const paymentStatus = order?.payment_status || order?.payment?.status;

  const formatPaymentMethod = (method?: string | null) => {
    if (!method) return null;
    const m = method.toLowerCase();
    if (m === "cash" || m === "cod") return "Cash on Delivery";
    if (m === "stripe") return "Stripe / Card";
    if (m === "card") return "Card";
    if (m === "paypal") return "PayPal";
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  const getPaymentStatusBadge = (status?: string | null) => {
    if (!status) return null;
    const s = status.toLowerCase();
    if (s === "paid" || s === "successful" || s === "completed") {
      return {
        label: "Paid",
        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      };
    }
    if (s === "pending" || s === "unpaid") {
      return {
        label: "Pending Payment",
        className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      };
    }
    if (s === "failed" || s === "cancelled") {
      return {
        label: "Payment Failed",
        className: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      };
    }
    if (s === "refunded") {
      return {
        label: "Refunded",
        className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      };
    }
    return {
      label: status.charAt(0).toUpperCase() + status.slice(1),
      className: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
    };
  };

  const methodLabel = formatPaymentMethod(paymentMethod);
  const statusBadge = getPaymentStatusBadge(paymentStatus);

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
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[12px] text-zinc-500">Order #{orderNum}</span>
              {methodLabel && (
                <span className="bg-white/5 text-zinc-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1.5">
                  <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect width="20" height="14" x="2" y="5" rx="2" strokeWidth="2" />
                    <line x1="2" x2="22" y1="10" y2="10" strokeWidth="2" />
                  </svg>
                  {methodLabel}
                </span>
              )}
              {statusBadge && (
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.className}`}>
                  {statusBadge.label}
                </span>
              )}
            </div>
          </div>
        </div>

        <OrderTimeline order={order} />
      </div>

      <OrderSummary order={order} />
      <div className="pb-10"></div>
    </div>
  );
}