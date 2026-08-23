"use client";

import { Suspense } from "react";
import OrderSuccessPage from "../order/success/page";

export default function OrderSuccessAliasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] w-full bg-[#1E1E20] text-zinc-400 flex items-center justify-center text-sm">
          Loading order details...
        </div>
      }
    >
      <OrderSuccessPage />
    </Suspense>
  );
}
