"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function StartOrderModal({ onClose }: { onClose: () => void }) {
  const [postcode, setPostcode] = useState("");
  const [mode] = useState<"delivery" | "collection">("delivery");
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      try { prev?.focus(); } catch (e) { }
    };
  }, [onClose]);

  // basic focus trap
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, input, [href], select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function handleStart(modeParam?: "delivery" | "collection") {
    const chosenMode = modeParam ?? mode;
    const trimmed = postcode.trim();
    if (trimmed.length === 0) {
      setError("Please enter your postcode");
      inputRef.current?.focus();
      return;
    }
    // Do not persist postcode or mode so the popup will reappear on reload
    setClosing(true);
    setTimeout(() => onClose(), 180);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className={`absolute inset-0 bg-black/60 transition-opacity ${closing ? "opacity-0" : "opacity-100"}`} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pacino-start-title"
        aria-describedby="pacino-start-desc"
        className={`relative bg-[#1E1E20] rounded-2xl p-4 md:p-10 w-[92%] max-w-sm text-center border border-white/10 shadow-lg transform transition-all ${closing ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
      >
        <div className="mb-3 w-21 h-14 mx-auto">
          <Image src="/logo.png" alt="logo" width={84} height={56} className="w-full h-full" />
        </div>
        <h3 id="pacino-start-title" className="text-[#F9671A] font-bold text-xl md:text-2xl mb-4">START YOUR <br />ORDER</h3>


        <div className="mb-6 text-left">
          <input
            ref={inputRef}
            value={postcode}
            onChange={(e) => { setPostcode(e.target.value); setError(""); }}
            placeholder="Enter postcode to start your order"
            className={`w-full placeholder:text-[#626262] placeholder:text-sm px-4 py-3 rounded-xl bg-[#262626] border outline-none transition-all ${error ? "border-rose-500 focus:border-rose-400" : "border-white/10 focus:border-[#F9671A]/50"
              } text-white`}
            aria-label="Postcode"
          />
          {error && (
            <div className="flex items-center gap-1.5 mt-2 ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-rose-400">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-rose-400 font-medium">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => handleStart("collection")}
            className={`flex-1 py-2 text-sm md:text-base rounded-full ${"bg-[#36363A] text-white"}`}
          >
            Collection
          </button>
          <button
            onClick={() => handleStart("delivery")}
            className={`flex-1 py-2 text-sm md:text-base rounded-full ${"bg-[#F9671A] text-white"}`}
          >
            Delivery
          </button>
        </div>


      </div>
    </div>
  );
}
