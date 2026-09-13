"use client";

import React, { useState, useEffect } from "react";
import { Utensils } from "lucide-react";

interface FoodItemImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  iconSize?: number;
}

export default function FoodItemImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  containerClassName = "w-full h-full",
  iconSize = 36,
}: FoodItemImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const isValidSrc = Boolean(src && typeof src === "string" && src.trim().length > 0);

  if (!isValidSrc || hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#252528] to-[#161618] border border-white/5 select-none ${containerClassName}`}>
        <div className="p-2.5 rounded-full bg-[#F9671A]/10 border border-[#F9671A]/20 mb-1 shadow-inner">
          <Utensils size={iconSize} className="text-[#F9671A]" />
        </div>
        <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold opacity-80">
          Pacino's
        </span>
      </div>
    );
  }

  return (
    <img
      src={src!}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
