"use client";

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
      try { prev?.focus(); } catch (e) {}
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
    try {
      localStorage.setItem("pacino_postcode", trimmed);
      localStorage.setItem("pacino_mode", chosenMode);
    } catch (e) {
      // ignore localStorage errors
    }
    setClosing(true);
    setTimeout(() => onClose(), 180);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className={`absolute inset-0 bg-black/60 transition-opacity ${closing ? "opacity-0" : "opacity-100"}`} onClick={onClose} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pacino-start-title"
        aria-describedby="pacino-start-desc"
        className={`relative bg-[#171717] rounded-2xl p-6 w-[92%] max-w-md text-center border border-white/10 shadow-lg transform transition-all ${closing ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
      >
        <div className="mb-4">
          <img src="/logo.png" alt="logo" className="mx-auto w-24" />
        </div>
        <h3 id="pacino-start-title" className="text-orange-400 font-bold text-lg mb-2">START YOUR ORDER</h3>
        <p id="pacino-start-desc" className="text-sm text-white/80 mb-4">Enter postcode to start your order</p>

        <input
          ref={inputRef}
          value={postcode}
          onChange={(e) => { setPostcode(e.target.value); setError(""); }}
          placeholder="Enter postcode"
          className="w-full mb-2 px-3 py-2 rounded-lg bg-[#262626] border border-white/10 text-white"
          aria-label="Postcode"
        />
        {error ? <p className="text-xs text-rose-400 mb-2">{error}</p> : null}

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => handleStart("collection")}
            className={`flex-1 py-2 rounded-full ${"bg-[#303031] text-white"}`}
          >
            Collection
          </button>
          <button
            onClick={() => handleStart("delivery")}
            className={`flex-1 py-2 rounded-full ${"bg-[#F9671A] text-white"}`}
          >
            Delivery
          </button>
        </div>

       
      </div>
    </div>
  );
}
