import Image from "next/image";

type Props = {
  image: string;
  badge: string;
  title: string;
  deliveredText: string;
  orderId: string;
  qty: number;
  price: string;
  showReorder?: boolean;
  onClick?: () => void;
  onReorder?: (e: React.MouseEvent) => void;
};

export default function OrderCard({ image, badge, title, deliveredText, orderId, qty, price, showReorder, onClick, onReorder }: Props) {
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
        <div className="mb-1.5 flex items-center">
          <span className="bg-zinc-700/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>
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