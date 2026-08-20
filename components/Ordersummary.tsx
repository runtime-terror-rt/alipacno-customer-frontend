import Image from "next/image";
import { Order } from "@/redux/features/api/ordersApi";

type Props = {
  order?: Order | null;
};

export default function OrderSummary({ order }: Props) {
  const getImageUrl = (url?: string | null) => {
    if (!url) return "/customer/most-popular-1.png";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/customer")) return url;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const items = (order?.items || []).map((item) => ({
    id: item.id,
    name: item.item_name || item.menu_item?.name || "Menu Item",
    desc: item.options_summary || item.special_instructions || "Standard Order",
    price: typeof item.subtotal === "number" ? item.subtotal : parseFloat(item.subtotal || "0"),
    img: getImageUrl(item.menu_item?.image_url || item.menu_item?.image),
  }));

  const defaultItems = [
    { id: 1, name: "Filet Mignon", desc: "Medium Rare, Bone Marrow Butter", price: 48, img: "/customer/most-popular-1.png" },
    { id: 2, name: "Bibimbap Ric...", desc: "Medium Rare, Bone Marrow Butter", price: 48, img: "/customer/most-popular-2.png" },
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  const subtotal = order ? `£${parseFloat(String(order.subtotal || 0)).toFixed(2)}` : "£96.00";
  const deliveryFee = order
    ? parseFloat(String(order.delivery_fee || 0)) === 0
      ? "Free"
      : `£${parseFloat(String(order.delivery_fee)).toFixed(2)}`
    : "Free";
  const discountVal = parseFloat(String(order?.discount || 0));
  const discount = order ? `- £${discountVal.toFixed(2)}` : "- £5.00";
  const vat = order ? `£${parseFloat(String(order.vat || 0)).toFixed(2)}` : "£2.00";
  const riderTip = order
    ? `£${(parseFloat(String(order.tip || 0)) + parseFloat(String(order.rider_tip || 0))).toFixed(2)}`
    : "£2.00";
  const total = order ? `£${parseFloat(String(order.total || 0)).toFixed(2)}` : "£95.00";

  const pricingRows: { l: string; v: string; color?: string }[] = [
    { l: "Subtotal", v: subtotal },
    { l: "Delivery fee", v: deliveryFee, color: "text-white" },
    { l: "Loyalty discount", v: discount },
    { l: "Incl. VAT", v: vat },
    { l: "Rider's Tip", v: riderTip },
  ];

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[17px] font-bold text-white">Order Summary</h3>
        <div className="bg-[#3a2016] text-[#F9671A] text-[10px] font-extrabold px-2 py-0.5 rounded border border-[#F9671A]/20">
          {displayItems.length} ITEMS
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        {displayItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 bg-[#212124] p-3 rounded-[16px] shadow-sm">
            <div className="w-[52px] h-[52px] rounded-[12px] overflow-hidden flex-shrink-0 relative bg-[#28282b]">
              <Image src={item.img} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[14px] font-bold text-white truncate mb-0.5">{item.name}</h4>
              <p className="text-[11px] text-zinc-400 truncate">{item.desc}</p>
            </div>
            <span className="text-[#F9671A] text-[15px] font-extrabold flex-shrink-0 pl-2">£{item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 mb-5 border-t border-white/10 pt-5">
        {pricingRows.map((row) => (
          <div key={row.l} className="flex justify-between items-center text-[13.5px]">
            <span className="text-zinc-400">{row.l}</span>
            <span className={row.color || "text-white font-medium"}>{row.v}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-white/10">
        <span className="text-[18px] font-bold text-white">Total</span>
        <span className="text-[18px] font-extrabold text-[#F9671A]">{total}</span>
      </div>
    </div>
  );
}