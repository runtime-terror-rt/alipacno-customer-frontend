"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [postcode, setPostcode] = useState<string | null>(null);

  useEffect(() => {
    try {
      setPostcode(localStorage.getItem("pacino_postcode"));
    } catch (e) {
      setPostcode(null);
    }
  }, []);

  function clearPostcode() {
    try {
      localStorage.removeItem("pacino_postcode");
      localStorage.removeItem("pacino_mode");
    } catch (e) {}
    // reload to let modal script show again
    location.reload();
  }

  return (
    <header className="w-full flex items-center justify-end gap-4 p-4 md:p-6 z-20">
      {postcode ? (
        <div className="hidden md:flex items-center gap-3 text-sm text-white/90">
          <span className="bg-[#2a2a2c] px-3 py-1 rounded-full">
            {postcode}
          </span>
          <button
            onClick={clearPostcode}
            className="text-[#F9671A] cursor-pointer hover:opacity-80 underline text-xs"
          >
            Change
          </button>
        </div>
      ) : null}

      <nav className="flex items-center gap-3">
        <Link href="/login" className="text-sm text-white/80 hover:text-white">
          Login
        </Link>
        <Link href="/signup" className="text-sm text-[#F9671A] font-semibold">
          Sign up
        </Link>
        <Link
          href="/menu"
          className="ml-2 text-sm bg-[#F9671A] text-white px-3 py-1 rounded-full"
        >
          Order
        </Link>
      </nav>
    </header>
  );
}
