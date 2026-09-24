import Image from "next/image";

type Props = {
  image: string;
  badge: string;
  title: string;
  deliveredText: string;
  orderId: string;
  qty: number;
  price: string;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  showReorder?: boolean;
  onClick?: () => void;
  onReorder?: (e: React.MouseEvent) => void;
};

const formatPaymentMethod = (method?: string | null) => {
  if (!method) return null;
  const m = method.toLowerCase();
  if (m === "cash" || m === "cod") return "Cash";
  if (m === "stripe") return "Stripe";
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
      label: "Pending",
      className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };
  }
  if (s === "failed" || s === "cancelled") {
    return {
      label: "Failed",
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

export default function OrderCard({
  image,
  badge,
  title,
  deliveredText,
  orderId,
  qty,
  price,
  paymentMethod,
  paymentStatus,
  showReorder,
  onClick,
  onReorder,
}: Props) {
  const methodLabel = formatPaymentMethod(paymentMethod);
  const statusBadge = getPaymentStatusBadge(paymentStatus);

  return (
    <div
      onClick={onClick}
      className={`bg-[#252527] rounded-[16px] p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center border border-transparent hover:border-white/5 transition-colors ${
        onClick ? "cursor-pointer hover:bg-[#2a2a2c]" : ""
      }`}
    >
      <div className="w-full sm:w-[120px] h-[140px] sm:h-[85px] rounded-[12px] overflow-hidden relative flex-shrink-0 bg-[#1a1a1c]">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0 w-full flex flex-col justify-center">
        <div className="mb-1.5 flex items-center gap-1.5 flex-wrap">
          <span className="bg-zinc-700/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>
          {methodLabel && (
            <span className="bg-white/5 text-zinc-300 text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
              <svg className="w-2.5 h-2.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect width="20" height="14" x="2" y="5" rx="2" strokeWidth="2" />
                <line x1="2" x2="22" y1="10" y2="10" strokeWidth="2" />
              </svg>
              {methodLabel}
            </span>
          )}
          {statusBadge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge.className}`}>
              {statusBadge.label}
            </span>
          )}
        </div>
        <h3 className="text-[16px] font-bold text-white truncate">{title}</h3>
        <p className="text-[11px] text-zinc-400 mt-1">{deliveredText}</p>
        <p className="text-[11px] text-zinc-500">Order #{orderId}</p>
      </div>
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-white/5 sm:border-0 gap-2 pr-0 sm:pr-2">
        <div className="text-[15px] font-bold text-zinc-300">
          {qty}x: <span className="text-[#F9671A]">{price}</span>
        </div>
        {showReorder && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onReorder) onReorder(e);
            }}
            className="bg-[#F9671A] hover:bg-[#ff7a33] text-white text-[11px] font-bold px-4 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            Re-order this item
          </button>
        )}
      </div>
    </div>
  );
}