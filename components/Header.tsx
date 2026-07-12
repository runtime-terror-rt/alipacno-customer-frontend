"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-end gap-4 p-4 md:p-6 z-20">
      <nav className="flex items-center gap-3">
        <Link href="/login" className="text-sm text-white/80 hover:text-white">Login</Link>
        <Link href="/signup" className="text-sm text-[#F9671A] font-semibold">Sign up</Link>
        <Link href="/menu" className="ml-2 text-sm bg-[#F9671A] text-white px-3 py-1 rounded-full">Order</Link>
      </nav>
    </header>
  );
}
