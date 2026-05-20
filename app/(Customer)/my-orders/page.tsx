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
      case "Steaks": return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M20.5 8.5c-2.5-3-6-4.5-9.5-4.5S4 5.5 1.5 8.5C1 9 1.5 10 2 10h18c.5 0 1-1 .5-1.5z" /><path d="M2 10v6c0 3 2 4 5 4h8c3 0 5-1 5-4v-6" /></svg>;
      case "Starters": return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M5 2v4" /><path d="M12 2v4" /><path d="M19 2v4" /><path d="M2 10h20" /><path d="M4 10v6c0 2 3 4 8 4s8-2 8-4v-6" /></svg>;
      case "Sides": return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M2 14h20" /><path d="M2 10h20" /><path d="M6 6h12a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v0a4 4 0 0 1 4-4Z" /></svg>;
      case "Drinks": return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M8 22h8" /><path d="M12 15v7" /><path d="M12 15a8.3 8.3 0 0 0 8-8.2V3H4v3.8A8.3 8.3 0 0 0 12 15Z" /></svg>;
      case "Desserts": return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M2 12h20" /><path d="M4 12v6c0 2 3 4 8 4s8-2 8-4v-6" /><path d="M12 2a4 4 0 0 0-4 4 4 4 0 0 0 8 0 4 4 0 0 0-4-4z" /></svg>;
      case "Lunch Special": return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z" /></svg>;
      default: return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="12" cy="12" r="10" /></svg>;
    }
  };

  const categories = [
    { name: "Steaks", icon: "/customer/menu/steaks.svg" },
    { name: "Starters", icon: "/customer/menu/starters.svg" },
    { name: "Sides", icon: "/customer/menu/sides.svg" },
    { name: "Drinks", icon: "/customer/menu/drinks.svg", hasDropdown: true },
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        )
                      },
                      { 
                        status: "Preparing", 
                        desc: "Our kitchen is cooking your dish", 
                        time: "Estimated: 15 min", 
                        active: false,
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/><path d="M9 6V3"/><path d="M15 6V3"/><path d="M12 6V3"/></svg>
                        )
                      },
                      { 
                        status: "Ready for delivery", 
                        desc: "Your order ready for delivery", 
                        time: "", 
                        active: false,
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                        )
                      },
                      { 
                        status: "Out for delivery", 
                        desc: "Delivery Driver is on the way to you.", 
                        time: "", 
                        active: false, 
                        avatars: true,
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                        )
                      },
                      { 
                        status: "Delivered to", 
                        desc: "7 Elm Street, Woodstock, OX7 1ER", 
                        time: "", 
                        active: false,
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
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
                  <button className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                  <div className="w-10 h-10 rounded-full bg-[#3a2016] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  </div>
                  <div className="pr-4">
                    <h4 className="text-[12.5px] font-bold text-white mb-0.5 leading-tight">Order #t7ml-2542 is Preparing</h4>
                    <p className="text-[10px] text-zinc-400 leading-tight">Our kitchen is cooking your dish - Estimated time 15min.</p>
                  </div>
                </div>
                
                <div className="bg-[#2a2a2c] rounded-[16px] p-4 flex gap-3 relative shadow-lg">
                  <button className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                  <div className="w-10 h-10 rounded-full bg-[#3a2016] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
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
                      className={`flex items-center w-full px-6 py-4 transition-colors duration-200 group border-l-[4px] cursor-pointer ${
                        isActive ? "bg-[#EBE5E0] border-[#F9671A]" : "border-transparent hover:bg-white/5"
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
