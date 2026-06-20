"use client";

import { useState } from "react";

export default function StartOrderModal({ onClose }: { onClose: () => void }) {
  const [postcode, setPostcode] = useState("");
  const [mode, setMode] = useState<"delivery" | "collection">("delivery");

  function handleStart() {
    try {
      localStorage.setItem("pacino_postcode", postcode || "");
      localStorage.setItem("pacino_mode", mode);
    } catch (e) {
      // ignore localStorage errors
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-[#171717] rounded-2xl p-6 w-[92%] max-w-md text-center border border-white/10 shadow-lg">
        <div className="mb-4">
          <img src="/logo.png" alt="logo" className="mx-auto w-24" />
        </div>
        <h3 className="text-orange-400 font-bold text-lg mb-2">START YOUR ORDER</h3>
        <p className="text-sm text-white/80 mb-4">Enter postcode to start your order</p>

        <input
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="Enter postcode"
          className="w-full mb-4 px-3 py-2 rounded-lg bg-[#262626] border border-white/10 text-white"
        />

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setMode("collection")}
            className={`flex-1 py-2 rounded-full ${mode === "collection" ? "bg-white text-black" : "bg-[#303031] text-white"}`}
          >
            Collection
          </button>
          <button
            onClick={() => setMode("delivery")}
            className={`flex-1 py-2 rounded-full ${mode === "delivery" ? "bg-orange-500 text-white" : "bg-[#303031] text-white"}`}
          >
            Delivery
          </button>
        </div>

       
      </div>
    </div>
  );
}
