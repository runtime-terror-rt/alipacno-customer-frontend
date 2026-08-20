import React from "react";
import Image from "next/image";
import Link from "next/link";
import { renderCategoryIcon } from "./CategoryIcons";

interface ProfileSidebarProps {
  categoriesList: any[];
  activeCategory: string;
  handleLogout: () => void;
  router: any;
}

export default function ProfileSidebar({
  categoriesList,
  activeCategory,
  handleLogout,
  router,
}: ProfileSidebarProps) {
  return (
    <div className="hidden lg:flex w-[240px] md:w-[260px] flex-shrink-0 border-r border-white/5 bg-[#1a1a1c] flex-col z-20">
      {/* Logo */}
      <div className="h-[90px] flex items-center justify-center px-6 mt-4">
        <Link href="/home">
          <Image src="/logo.png" alt="Logo" width={130} height={80} priority />
        </Link>
      </div>
      <div className="border-b border-white/5 mt-4"></div>
      
      {/* Categories */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-6">
        <h3 className="text-white font-bold text-[18px] mb-4 pl-6">Menu Categories</h3>
        <div className="flex flex-col">
          {categoriesList.map((cat: any, i: number) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={i}
                onClick={() => router.push(`/menu?category=${encodeURIComponent(cat.name)}`)}
                className={`flex items-center w-full px-6 py-4 transition-colors duration-200 group border-l-[4px] cursor-pointer ${
                  isActive ? "bg-[#EBE5E0] border-[#F9671A]" : "border-transparent hover:bg-white/5"
                }`}
              >
                <div
                  className={`w-[22px] h-[22px] mr-4 flex items-center justify-center ${
                    isActive ? "text-[#F9671A]" : "text-zinc-500 group-hover:text-zinc-400"
                  }`}
                >
                  {renderCategoryIcon(cat, isActive)}
                </div>
                <span
                  className={`text-[16px] font-medium flex-1 text-left ${
                    isActive ? "text-[#F9671A]" : "text-zinc-500 group-hover:text-zinc-400"
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Logout Button */}
      <div className="p-6 border-t border-white/5 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors duration-200 group cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 transition-transform group-hover:-translate-x-1">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span className="font-medium text-[16px]">Logout</span>
        </button>
      </div>
    </div>
  );
}
