"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CheckoutMap from "@/components/CheckoutMap";

export default function MyOrdersPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Steaks");
  const [view, setView] = useState<"list" | "details">("list");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case "Steaks": return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="w-full h-full">
          <path d="M13.6667 11.4168C14.3502 10.9031 14.9023 10.235 15.2781 9.46696C15.6538 8.69896 15.8424 7.85293 15.8284 6.99807C15.8144 6.1432 15.5983 5.30379 15.1977 4.54848C14.7971 3.79317 14.2233 3.14342 13.5234 2.65238C12.8235 2.16134 12.0173 1.84295 11.1707 1.72326C10.3242 1.60357 9.46132 1.68598 8.65272 1.96374C7.84411 2.2415 7.11275 2.70673 6.51844 3.32137C5.92413 3.93601 5.48375 4.68261 5.23334 5.50009C4.31667 8.10843 4.58334 8.7501 2.58334 10.5668C2.18481 10.8935 1.89698 11.3354 1.75926 11.832C1.62154 12.3286 1.64065 12.8556 1.81398 13.3409C1.98731 13.8263 2.30638 14.2462 2.72753 14.5432C3.14868 14.8402 3.65133 14.9998 4.16667 15.0001C7.5 15.0001 11.1667 13.5001 13.6667 11.4168Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15.4167 5L17.2417 8.75C17.591 9.82405 17.5948 10.9806 17.2524 12.0569C16.9101 13.1332 16.2389 14.0751 15.3333 14.75C12.8333 16.8333 9.16667 18.3333 5.83333 18.3333C5.36937 18.3327 4.91475 18.203 4.52032 17.9587C4.12589 17.7144 3.80723 17.3651 3.6 16.95L2 13.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.4167 9.16667C11.5673 9.16667 12.5 8.23393 12.5 7.08333C12.5 5.93274 11.5673 5 10.4167 5C9.26611 5 8.33337 5.93274 8.33337 7.08333C8.33337 8.23393 9.26611 9.16667 10.4167 9.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      case "Starters": return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="w-full h-full">
          <path d="M10 17.5C11.9891 17.5 13.8968 16.7098 15.3033 15.3033C16.7098 13.8968 17.5 11.9891 17.5 10H2.5C2.5 11.9891 3.29018 13.8968 4.6967 15.3033C6.10322 16.7098 8.01088 17.5 10 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.83337 17.5H14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.25 10L18.3333 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.5417 2.5C13.7667 2.58333 14.2083 2.94167 14.1667 3.63333C14.1167 4.325 13.3917 4.63333 13.3333 5.31667C13.2917 5.96667 13.6167 6.35 13.9417 6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.37504 2.5C9.60004 2.58333 10.0417 2.94167 9.99171 3.63333C9.95004 4.325 9.21671 4.63333 9.17504 5.31667C9.12504 5.96667 9.45004 6.35 9.77504 6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.20829 2.5C5.43329 2.58333 5.87496 2.94167 5.83329 3.63333C5.78329 4.325 5.05829 4.63333 4.99996 5.31667C4.95829 5.96667 5.28329 6.35 5.61662 6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      case "Sides": return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="w-full h-full">
          <path d="M9.99996 13.3333H3.33329C2.89127 13.3333 2.46734 13.1577 2.15478 12.8452C1.84222 12.5326 1.66663 12.1087 1.66663 11.6667C1.66663 11.2246 1.84222 10.8007 2.15478 10.4882C2.46734 10.1756 2.89127 10 3.33329 10H16.6666C17.1087 10 17.5326 10.1756 17.8451 10.4882C18.1577 10.8007 18.3333 11.2246 18.3333 11.6667C18.3333 12.1087 18.1577 12.5326 17.8451 12.8452C17.5326 13.1577 17.1087 13.3333 16.6666 13.3333H13.125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.16667 10C3.72464 10 3.30072 9.8244 2.98816 9.51184C2.67559 9.19928 2.5 8.77536 2.5 8.33333C2.5 6.78624 3.29018 5.30251 4.6967 4.20854C6.10322 3.11458 8.01088 2.5 10 2.5C11.9891 2.5 13.8968 3.11458 15.3033 4.20854C16.7098 5.30251 17.5 6.78624 17.5 8.33333C17.5 8.77536 17.3244 9.19928 17.0118 9.51184C16.6993 9.8244 16.2754 10 15.8333 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.16667 13.3335C3.72464 13.3335 3.30072 13.5091 2.98816 13.8217C2.67559 14.1342 2.5 14.5581 2.5 15.0002C2.5 15.6632 2.76339 16.2991 3.23223 16.7679C3.70107 17.2368 4.33696 17.5002 5 17.5002H15C15.663 17.5002 16.2989 17.2368 16.7678 16.7679C17.2366 16.2991 17.5 15.6632 17.5 15.0002C17.5 14.5581 17.3244 14.1342 17.0118 13.8217C16.6993 13.5091 16.2754 13.3335 15.8333 13.3335" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.55835 10L10.6667 13.8333C11.0203 14.0986 11.4648 14.2124 11.9024 14.1499C12.1191 14.119 12.3275 14.0456 12.5158 13.9341C12.7042 13.8226 12.8687 13.6751 13 13.5L15.625 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      case "Drinks": return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="w-full h-full">
          <path d="M6.66663 18.3335H13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.83337 8.3335H14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 12.5V18.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 12.4998C11.1051 12.4998 12.1649 12.0609 12.9463 11.2794C13.7277 10.498 14.1667 9.43824 14.1667 8.33317C14.1667 6.6665 13.75 4.99984 12.5 1.6665H7.50004C6.25004 4.99984 5.83337 6.6665 5.83337 8.33317C5.83337 9.43824 6.27236 10.498 7.05376 11.2794C7.83516 12.0609 8.89497 12.4998 10 12.4998Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      case "Desserts": return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="w-full h-full">
          <path d="M6.66671 17.4998H13.3334M10 14.9998V17.4998M4.28337 9.16643C4.15404 8.7312 4.1281 8.27178 4.20763 7.82475C4.28715 7.37773 4.46995 6.95544 4.74146 6.59152C5.01296 6.2276 5.36568 5.93209 5.77154 5.72852C6.17739 5.52495 6.62516 5.41895 7.07921 5.41895C7.53325 5.41895 7.98103 5.52495 8.38688 5.72852C8.79273 5.93209 9.14545 6.2276 9.41696 6.59152C9.68847 6.95544 9.87126 7.37773 9.95079 7.82475C10.0303 8.27178 10.0044 8.7312 9.87504 9.16643M10 14.1664C14.1667 14.1664 16.6667 11.9248 16.6667 9.16643H3.33337C3.33337 11.9248 5.83337 14.1664 10 14.1664Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.1167 9.16643C9.98735 8.7312 9.96141 8.27178 10.0409 7.82475C10.1205 7.37773 10.3033 6.95544 10.5748 6.59152C10.8463 6.2276 11.199 5.93209 11.6048 5.72852C12.0107 5.52495 12.4585 5.41895 12.9125 5.41895C13.3666 5.41895 13.8143 5.52495 14.2202 5.72852C14.626 5.93209 14.9788 6.2276 15.2503 6.59152C15.5218 6.95544 15.7046 7.37773 15.7841 7.82475C15.8636 8.27178 15.8377 8.7312 15.7083 9.16643" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12.9167 5.41667C12.9167 5.03364 12.8413 4.65437 12.6947 4.30051C12.5481 3.94664 12.3333 3.62511 12.0624 3.35427C11.7916 3.08343 11.4701 2.86859 11.1162 2.72202C10.7623 2.57544 10.3831 2.5 10 2.5C9.61702 2.5 9.23775 2.57544 8.88388 2.72202C8.53001 2.86859 8.20848 3.08343 7.93765 3.35427C7.66681 3.62511 7.45197 3.94664 7.30539 4.30051C7.15882 4.65437 7.08337 5.03364 7.08337 5.41667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      case "Lunch Special": return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="w-full h-full">
          <g clipPath="url(#clip0_253_1448)">
            <path d="M9.18084 2.34488C9.21654 2.15372 9.31798 1.98106 9.46758 1.85681C9.61719 1.73256 9.80553 1.66455 10 1.66455C10.1945 1.66455 10.3828 1.73256 10.5324 1.85681C10.682 1.98106 10.7835 2.15372 10.8192 2.34488L11.695 6.97655C11.7572 7.30584 11.9172 7.60873 12.1542 7.84569C12.3912 8.08265 12.694 8.24267 13.0233 8.30488L17.655 9.18071C17.8462 9.21642 18.0188 9.31786 18.1431 9.46746C18.2673 9.61706 18.3353 9.80541 18.3353 9.99988C18.3353 10.1943 18.2673 10.3827 18.1431 10.5323C18.0188 10.6819 17.8462 10.7833 17.655 10.819L13.0233 11.6949C12.694 11.7571 12.3912 11.9171 12.1542 12.1541C11.9172 12.391 11.7572 12.6939 11.695 13.0232L10.8192 17.6549C10.7835 17.846 10.682 18.0187 10.5324 18.1429C10.3828 18.2672 10.1945 18.3352 10 18.3352C9.80553 18.3352 9.61719 18.2672 9.46758 18.1429C9.31798 18.0187 9.21654 17.846 9.18084 17.6549L8.305 13.0232C8.2428 12.6939 8.08277 12.391 7.84581 12.1541C7.60885 11.9171 7.30596 11.7571 6.97667 11.6949L2.345 10.819C2.15384 10.7833 1.98118 10.6819 1.85693 10.5323C1.73269 10.3827 1.66467 10.1943 1.66467 9.99988C1.66467 9.80541 1.73269 9.61706 1.85693 9.46746C1.98118 9.31786 2.15384 9.21642 2.345 9.18071L6.97667 8.30488C7.30596 8.24267 7.60885 8.08265 7.84581 7.84569C8.08277 7.60873 8.2428 7.30584 8.305 6.97655L9.18084 2.34488Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.6666 1.6665V4.99984" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.3333 3.3335H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.33329 18.3333C4.25377 18.3333 4.99996 17.5871 4.99996 16.6667C4.99996 15.7462 4.25377 15 3.33329 15C2.41282 15 1.66663 15.7462 1.66663 16.6667C1.66663 17.5871 2.41282 18.3333 3.33329 18.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_253_1448">
              <rect width="20" height="20" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      );
      default: return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="12" cy="12" r="10" /></svg>
      );
    }
  };

  const categories: { name: string; icon: string; hasDropdown?: boolean }[] = [
    { name: "Steaks", icon: "/customer/menu/steaks.svg" },
    { name: "Starters", icon: "/customer/menu/starters.svg" },
    { name: "Sides", icon: "/customer/menu/sides.svg" },
    { name: "Drinks", icon: "/customer/menu/drinks.svg" },
    { name: "Desserts", icon: "/customer/menu/desserts.svg" },
    { name: "Lunch Special", icon: "/customer/menu/lunch.svg" },
  ];

  return (
    <div className="h-[100dvh] w-full bg-[#1E1E20] flex flex-col lg:flex-row text-white overflow-hidden font-sans select-none relative">
      {/* 1. Left Sidebar */}
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
            {categories.map((cat, i) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={i}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center w-full px-6 py-4 transition-colors duration-200 group border-l-[4px] cursor-pointer ${isActive ? "bg-[#EBE5E0] border-[#F9671A]" : "border-transparent hover:bg-white/5"}`}
                >
                  <div className={`w-[22px] h-[22px] mr-4 flex items-center justify-center ${isActive ? "text-[#F9671A]" : "text-zinc-500 group-hover:text-zinc-400"}`}>
                    {getCategoryIcon(cat.name)}
                  </div>
                  <span className={`text-[16px] font-medium flex-1 text-left ${isActive ? "text-[#F9671A]" : "text-zinc-500 group-hover:text-zinc-400"}`}>
                    {cat.name}
                  </span>
                  {cat.hasDropdown && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`ml-2 ${isActive ? "text-[#F9671A]" : "text-zinc-500"}`}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-[70px] flex-shrink-0 border-b border-white/5 bg-[#1E1E20] flex items-center justify-between px-4 sm:px-8 relative z-10">
          <div className="flex items-center gap-2">
            <div className="lg:hidden flex-shrink-0 mr-2">
              <Link href="/home">
                <Image src="/logo.png" alt="Logo" width={75} height={42} priority className="object-contain" />
              </Link>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className="text-zinc-400 text-sm font-medium">Nearest Branch:</span>
              <span className="text-[#F9671A] text-sm font-semibold ml-1">Cloud Gate (The Bean), Chicago</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <button className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </button>
            <button className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </button>
            <button className="relative text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
              </svg>
              <span className="absolute -top-1.5 -right-1.5 bg-[#F9671A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">1</span>
            </button>
            <button onClick={() => setView("list")} className="relative text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="absolute -top-1.5 -right-1.5 bg-[#F9671A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
            </button>

            <div onClick={() => router.push("/profile")} className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-white/10 cursor-pointer group">
              <span className="text-sm font-medium text-white group-hover:text-[#F9671A] transition-colors hidden sm:inline">Charles Deo</span>
              <div className="w-8 h-8 rounded-full bg-zinc-700 overflow-hidden relative border border-white/10 group-hover:border-[#F9671A]/30 transition-colors">
                <Image src="/customer/profile.png" alt="Avatar" fill className="object-cover" />
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white transition-colors hidden sm:inline">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {/* Burger Menu Trigger */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer lg:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
            </button>
          </div>
        </header>

        {/* Mobile Delivery Bar - Only visible on lg:hidden */}
        <div className="flex items-center gap-2 px-6 py-3 bg-[#1E1E20] border-b border-white/5 lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span className="text-zinc-400 text-xs font-medium">Delivery:</span>
          <span className="text-[#F9671A] text-xs font-semibold">Direct Street, Chicago</span>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative">

          {/* Middle Column (Scrollable Content) */}
          <main className="flex-1 h-auto lg:h-full px-6 sm:px-8 py-6 overflow-visible lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => view === "details" ? setView("list") : router.push("/menu")}
                className="text-white hover:text-zinc-300 transition-colors cursor-pointer flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <h1 className="text-[20px] font-bold text-white">
                My Orders {view === "details" && <span className="text-zinc-400 font-medium">/ Active orders / Details</span>}
              </h1>
            </div>

            {view === "list" ? (
              /* --- LIST VIEW --- */
              <div className="max-w-[800px]">
                {/* Active Orders */}
                <div className="mb-10">
                  <h2 className="text-[16px] font-bold text-white mb-1">Active Orders</h2>
                  <p className="text-[12px] text-zinc-400 mb-4">May 05, 12:45 PM</p>

                  <div onClick={() => setView("details")} className="bg-[#252527] rounded-[16px] p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center cursor-pointer hover:bg-[#2a2a2c] transition-colors border border-transparent hover:border-white/5">
                    <div className="w-full sm:w-[120px] h-[140px] sm:h-[85px] rounded-[12px] overflow-hidden relative flex-shrink-0 bg-[#1a1a1c]">
                      <Image src="/customer/most-popular-1.png" alt="Filet Mignon" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 w-full flex flex-col justify-center">
                      <div className="mb-1.5 flex items-center">
                        <span className="bg-zinc-700/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Steaks</span>
                      </div>
                      <h3 className="text-[16px] font-bold text-white truncate">Grilled chicken pieces</h3>
                      <p className="text-[11px] text-zinc-400 mt-1">Delivered on Sunday, May 04, 4:30 PM</p>
                      <p className="text-[11px] text-zinc-500">Order #t7ml-2542-c4kj</p>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-white/5 sm:border-0 gap-2 pr-0 sm:pr-2">
                      <div className="text-[15px] font-bold text-zinc-300">
                        1x: <span className="text-[#F9671A]">£95.00</span>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Past Orders */}
                <div>
                  <h2 className="text-[16px] font-bold text-white mb-1">Past Orders</h2>

                  <div className="mb-6">
                    <p className="text-[12px] text-zinc-400 mb-3">April 28, 12:45 PM</p>
                    <div className="bg-[#252527] rounded-[16px] p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center border border-transparent hover:border-white/5 transition-colors">
                      <div className="w-full sm:w-[120px] h-[140px] sm:h-[85px] rounded-[12px] overflow-hidden relative flex-shrink-0 bg-[#1a1a1c]">
                        <Image src="/customer/most-popular-4.png" alt="Caesar Salad" fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 w-full flex flex-col justify-center">
                        <div className="mb-1.5 flex items-center">
                          <span className="bg-zinc-700/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Drinks</span>
                        </div>
                        <h3 className="text-[16px] font-bold text-white truncate">Caesar Salad - Appetizers</h3>
                        <p className="text-[11px] text-zinc-400 mt-1">Delivered on Sunday, May 04, 4:30 PM</p>
                        <p className="text-[11px] text-zinc-500">Order #x5bt-7843-n9uj</p>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-white/5 sm:border-0 gap-2 pr-0 sm:pr-2">
                        <div className="text-[15px] font-bold text-zinc-300">
                          2x: <span className="text-[#F9671A]">£28.00</span>
                        </div>
                        <button className="bg-[#F9671A] hover:bg-[#ff7a33] text-white text-[11px] font-bold px-4 py-1.5 rounded-full transition-colors cursor-pointer">
                          Re-order this item
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-[12px] text-zinc-400 mb-3">April 26, 12:45 PM</p>
                    <div className="bg-[#252527] rounded-[16px] p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center border border-transparent hover:border-white/5 transition-colors">
                      <div className="w-full sm:w-[120px] h-[140px] sm:h-[85px] rounded-[12px] overflow-hidden relative flex-shrink-0 bg-[#1a1a1c]">
                        <Image src="/customer/most-popular-8.png" alt="Lava Cake" fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 w-full flex flex-col justify-center">
                        <div className="mb-1.5 flex items-center">
                          <span className="bg-zinc-700/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Desserts</span>
                        </div>
                        <h3 className="text-[16px] font-bold text-white truncate">Chocolate Lava Cake - Desserts</h3>
                        <p className="text-[11px] text-zinc-400 mt-1">Delivered on Tuesday, June 11, 7:00 PM</p>
                        <p className="text-[11px] text-zinc-500">Order #u8rt-5921-p2wx</p>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-white/5 sm:border-0 gap-2 pr-0 sm:pr-2">
                        <div className="text-[15px] font-bold text-zinc-300">
                          1x: <span className="text-[#F9671A]">£27.50</span>
                        </div>
                        <button className="bg-[#F9671A] hover:bg-[#ff7a33] text-white text-[11px] font-bold px-4 py-1.5 rounded-full transition-colors cursor-pointer">
                          Re-order this item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* --- DETAILS VIEW --- */
              <div className="max-w-[700px]">
                {/* Details Card */}
                <div className="bg-[#252527] rounded-[20px] p-6 mb-8">
                  {/* Card Header */}
                  <div className="flex gap-4 items-center mb-8">
                    <div className="w-[90px] h-[70px] rounded-[12px] overflow-hidden relative flex-shrink-0 bg-[#1a1a1c]">
                      <Image src="/customer/most-popular-1.png" alt="Filet Mignon" fill className="object-cover" />
                      <div className="absolute bottom-1 right-1 text-[8px] bg-black/60 px-1 rounded">1x: £95</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[18px] font-bold text-white truncate">Filet Mignon - Steaks</h3>
                      <p className="text-[12px] text-zinc-400 mt-0.5">Delivered on Sunday, May 04, 4:30 PM</p>
                      <p className="text-[12px] text-zinc-500">Order #t7ml-2542-c4kj</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex flex-col gap-0 relative">
                    {[
                      {
                        status: "Order Received",
                        desc: "Cloud Gate (The Bean), Chicago",
                        time: "",
                        active: true,
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        )
                      },
                      {
                        status: "Preparing",
                        desc: "Our kitchen is cooking your dish",
                        time: "Estimated: 15 min",
                        active: false,
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" /><path d="M9 6V3" /><path d="M15 6V3" /><path d="M12 6V3" /></svg>
                        )
                      },
                      {
                        status: "Ready for delivery",
                        desc: "Your order ready for delivery",
                        time: "",
                        active: false,
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                        )
                      },
                      {
                        status: "Out for delivery",
                        desc: "Delivery Driver is on the way to you.",
                        time: "",
                        active: false,
                        avatars: true,
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                        )
                      },
                      {
                        status: "Delivered to",
                        desc: "7 Elm Street, Woodstock, OX7 1ER",
                        time: "",
                        active: false,
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                        )
                      }
                    ].map((step, i) => {
                      const isLast = i === 4;
                      const lineClass = i === 0
                        ? "absolute left-[15px] top-8 bottom-0 w-[1.5px] bg-[#F9671A]"
                        : "absolute left-[15px] top-8 bottom-0 w-[1.5px] border-l border-dashed border-white/10";

                      return (
                        <div key={i} className="flex gap-4 relative pb-7 last:pb-0">
                          {/* Vertical Line Segment */}
                          {!isLast && <div className={lineClass}></div>}

                          {/* Circle Icon */}
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 z-10 ${step.active ? "border-[#F9671A]/40 bg-[#3a2016] text-[#F9671A]" : "border-white/10 bg-[#212124] text-zinc-500"}`}>
                            {step.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1 mt-0.5">
                            <div className="flex items-center gap-2.5">
                              <h4 className={`text-[13px] font-bold ${step.active ? "text-[#F9671A]" : "text-zinc-500"}`}>{step.status}</h4>
                              {step.time && (
                                <span className="bg-[#3a2016] text-[#F9671A] text-[9px] font-bold px-2 py-0.5 rounded border border-[#F9671A]/20">
                                  {step.time}
                                </span>
                              )}
                              {step.avatars && (
                                <div className="flex -space-x-1.5 ml-0.5">
                                  <div className="w-5 h-5 rounded-full border border-[#252527] bg-zinc-800 overflow-hidden relative z-10"><Image src="/customer/banner-men.png" alt="Avatar" fill className="object-cover" /></div>
                                  <div className="w-5 h-5 rounded-full border border-[#252527] bg-zinc-700 overflow-hidden relative z-0"><Image src="/customer/banner-woman.png" alt="Avatar" fill className="object-cover" /></div>
                                </div>
                              )}
                            </div>
                            <p className="text-[15px] font-bold text-white mt-1.5 leading-snug">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Summary (in Main content, below details card) */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[17px] font-bold text-white">Order Summary</h3>
                    <div className="bg-[#3a2016] text-[#F9671A] text-[10px] font-extrabold px-2 py-0.5 rounded border border-[#F9671A]/20">2 ITEMS</div>
                  </div>

                  {/* Items List */}
                  <div className="flex flex-col gap-4 mb-6">
                    {[
                      { id: 1, name: "Filet Mignon", desc: "Medium Rare, Bone Marrow Butter", price: 48, img: "/customer/most-popular-1.png" },
                      { id: 2, name: "Bibimbap Ric...", desc: "Medium Rare, Bone Marrow Butter", price: 48, img: "/customer/most-popular-2.png" },
                    ].map(item => (
                      <div key={item.id} className="flex items-center gap-3 bg-[#212124] p-3 rounded-[16px] shadow-sm">
                        <div className="w-[52px] h-[52px] rounded-[12px] overflow-hidden flex-shrink-0 relative bg-[#28282b]">
                          <Image src={item.img} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[14px] font-bold text-white truncate mb-0.5">{item.name}</h4>
                          <p className="text-[11px] text-zinc-400 truncate">{item.desc}</p>
                        </div>
                        <span className="text-[#F9671A] text-[15px] font-extrabold flex-shrink-0 pl-2">£{item.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="flex flex-col gap-2.5 mb-5 border-t border-white/10 pt-5">
                    {[
                      { l: "Subtotal", v: "£96.00" },
                      { l: "Delivery fee", v: "Free", color: "text-white" },
                      { l: "Loyalty discount", v: "- £5.00" },
                      { l: "Incl. VAT", v: "£2.00" },
                      { l: "Rider's Tip", v: "£2.00" }
                    ].map(row => (
                      <div key={row.l} className="flex justify-between items-center text-[13.5px]">
                        <span className="text-zinc-400">{row.l}</span>
                        <span className={row.color || "text-white font-medium"}>{row.v}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="text-[18px] font-bold text-white">Total</span>
                    <span className="text-[18px] font-extrabold text-[#F9671A]">£95.00</span>
                  </div>
                </div>
                <div className="pb-10"></div>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-[355px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 bg-[#1E1E20] flex flex-col h-auto lg:h-full relative z-30">
            {view === "list" ? (
              /* Notifications for List View */
              <div className="p-6 flex flex-col gap-4 overflow-y-auto">
                <div className="bg-[#2a2a2c] rounded-[16px] p-4 flex gap-3 relative shadow-lg">
                  <button className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></button>
                  <div className="w-10 h-10 rounded-full bg-[#3a2016] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                  </div>
                  <div className="pr-4">
                    <h4 className="text-[12.5px] font-bold text-white mb-0.5 leading-tight">Order #t7ml-2542 is Preparing</h4>
                    <p className="text-[10px] text-zinc-400 leading-tight">Our kitchen is cooking your dish - Estimated time 15min.</p>
                  </div>
                </div>

                <div className="bg-[#2a2a2c] rounded-[16px] p-4 flex gap-3 relative shadow-lg">
                  <button className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></button>
                  <div className="w-10 h-10 rounded-full bg-[#3a2016] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" /><path d="M12 3v6" /></svg>
                  </div>
                  <div className="pr-4">
                    <h4 className="text-[12.5px] font-bold text-white mb-0.5 leading-tight">Order #t7ml-2542 Received</h4>
                    <p className="text-[10px] text-zinc-400 leading-tight">Your order has been received by our kitchen</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Map & Actions for Details View */
              <div className="flex flex-col h-full">
                <div className="p-6 pb-4 mx-6 px-0 mb-4 flex flex-col gap-4 flex-shrink-0">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-[17px] font-bold text-white">Map Location</h3>
                  </div>
                  <div className="w-full h-[220px] rounded-[16px] overflow-hidden shadow-lg bg-[#252527]">
                    <CheckoutMap />
                  </div>
                </div>
                <div className="px-6">
                  <button className="w-full py-3.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[14px] font-bold transition-colors shadow-lg shadow-orange-600/20 cursor-pointer">
                    Re-order this item
                  </button>
                </div>
              </div>
            )}
          </aside>

        </div>
      </div>
      {/* Mobile Drawer (Sidebar Categories) */}
      {isMobileSidebarOpen && (
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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>

            {/* Navigation / Categories */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pt-6">
              <h3 className="text-white font-bold text-[16px] mb-4 px-6 uppercase tracking-wider text-zinc-500">Menu Categories</h3>
              <div className="flex flex-col">
                {categories.map((cat, i) => {
                  const isActive = activeCategory === cat.name;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveCategory(cat.name);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`flex items-center w-full px-6 py-4 transition-colors duration-200 group border-l-[4px] cursor-pointer ${isActive ? "bg-[#EBE5E0] border-[#F9671A]" : "border-transparent hover:bg-white/5"
                        }`}
                    >
                      <div className={`w-[22px] h-[22px] mr-4 flex items-center justify-center ${isActive ? "text-[#F9671A]" : "text-zinc-500"}`}>
                        {getCategoryIcon(cat.name)}
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
      )}
    </div>
  );
}
