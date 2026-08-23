import React from "react";
import Image from "next/image";
import Link from "next/link";
import { renderCategoryIcon } from "./CategoryIcons";

interface MobileDrawerProps {
  categoriesList: any[];
  activeCategory: string;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  router: any;
}

export default function MobileDrawer({
  categoriesList,
  activeCategory,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  router,
}: MobileDrawerProps) {
  if (!isMobileSidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-[280px] max-w-[80vw] bg-[#1a1a1c] h-full flex flex-col shadow-2xl border-r border-white/5 z-10 transition-transform duration-300 translate-x-0">
        {/* Header / Logo */}
        <div className="h-[70px] flex items-center justify-between px-5 border-b border-white/5">
          <Link href="/home" onClick={() => setIsMobileSidebarOpen(false)}>
            <Image src="/logo.png" alt="Logo" width={90} height={50} priority className="object-contain" />
          </Link>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer bg-white/5 p-1.5 rounded-full border border-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation / Categories */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-6">
          <h3 className="text-white font-bold text-[16px] mb-4 px-6 uppercase tracking-wider text-zinc-500">Menu Categories</h3>
          <div className="flex flex-col">
            {categoriesList.map((cat: any, i: number) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={i}
                  onClick={() => {
                    router.push(`/menu?category=${encodeURIComponent(cat.name)}`);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`flex items-center w-full px-6 py-4 transition-colors duration-200 group border-l-[4px] cursor-pointer ${
                    isActive ? "bg-[#EBE5E0] border-[#F9671A]" : "border-transparent hover:bg-white/5"
                  }`}
                >
                  <div className={`w-[22px] h-[22px] mr-4 flex items-center justify-center ${isActive ? "text-[#F9671A]" : "text-zinc-500"}`}>
                    {renderCategoryIcon(cat, isActive)}
                  </div>
                  <span className={`text-[16px] font-medium flex-1 text-left ${isActive ? "text-[#F9671A]" : "text-zinc-500"}`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
