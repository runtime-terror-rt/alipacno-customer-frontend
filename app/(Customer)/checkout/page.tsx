"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CheckoutMap from "@/components/CheckoutMap";

export default function CheckoutPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Steaks");
  const [tip, setTip] = useState("No Tip");
  const [time, setTime] = useState("ASAP");
  const [pay, setPay] = useState("Card");
  const [loyalty, setLoyalty] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeBranch, setActiveBranch] = useState("Cloud Gate (The Bean), Chicago");
  const [selectedBranch, setSelectedBranch] = useState("Cloud Gate (The Bean), Chicago");

  const branches = [
    { name: "Cloud Gate (The Bean), Chicago", address: "7 Elm Street, Woodstock, OX7 1ER", dist: "2.3 km away", time: "30 mins delivery" },
    { name: "The High Line, New York City", address: "7 Elm Street, Woodstock, OX7 1ER", dist: "5.7 km away", time: "45 mins delivery" },
    { name: "Golden Gate Bridge, San Francisco", address: "Tower Bridge, London, UK SE1 2UP", dist: "10.2 km away", time: "1 hour delivery" },
  ];
  const currentBranch = branches.find(b => b.name === activeBranch) || branches[0];

  const cartItems = [
    { id: 1, name: "Filet Mignon", desc: "Medium Rare, Bone Marrow Butter", price: 48, img: "/customer/most-popular-1.png" },
    { id: 2, name: "Bibimbap Ric...", desc: "Medium Rare, Bone Marrow Butter", price: 48, img: "/customer/most-popular-2.png" },
  ];

  const subtotal = cartItems.reduce((s, i) => s + i.price, 0);
  const vat = 2.00;
  const tipAmt = tip === "£2" ? 2 : tip === "£5" ? 5 : tip === "£10" ? 10 : 0;
  const total = subtotal + vat + tipAmt;

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
    <div className="h-[100dvh] w-full bg-[#1E1E20] flex flex-col lg:flex-row text-white overflow-hidden font-sans select-none">
      {/* 1. Left Sidebar (Same to Same as Menu Page) */}
      <div className="hidden lg:flex w-[240px] md:w-[260px] flex-shrink-0 border-r border-white/5 bg-[#1a1a1c] flex-col">
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Same to Same as Menu Page) */}
        <header className="h-[70px] flex-shrink-0 border-b border-white/5 bg-[#1E1E20] flex items-center justify-between px-4 sm:px-8 z-10">
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
            <button onClick={() => router.push("/my-orders")} className="relative text-zinc-400 hover:text-white transition-colors cursor-pointer">
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
          {/* Main Content Area: Checkout Form */}
          <main className="flex-1 h-auto lg:h-full px-6 sm:px-8 py-6 overflow-visible lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* Back + Title */}
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => router.push("/menu")} className="text-white hover:text-zinc-300 transition-colors cursor-pointer flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <h1 className="text-[20px] font-bold text-white">Checkout</h1>
            </div>

            {/* Your Order from Banner (No border, Regular Card bg style) */}
            <div className="rounded-[20px] p-5 sm:p-6 mb-6 shadow-xl bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c]">
              {/* Mobile Layout */}
              <div className="flex flex-col lg:hidden gap-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white text-[13px] font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
                    Your Order from
                  </div>
                  <button onClick={() => setIsBranchModalOpen(true)} className="bg-[#F9671A] hover:bg-[#ff7a33] text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md shadow-orange-600/20 transition-all cursor-pointer">
                    Change Branch
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
                
                <h2 className="text-[16px] font-bold text-white leading-tight mt-0.5">Cloud Gate (The Bean), Chicago</h2>
                
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start gap-2 text-[#d1d1d1] text-[13.5px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    <span className="leading-tight">NW1 6XE,London,221B Baker Street,Marylebone</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[#d1d1d1] text-[13px]">
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4" /><circle cx="7" cy="21" r="1" /><circle cx="20" cy="21" r="1" /></svg>
                      2.3 km away
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      30 mins delivery
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-zinc-400 text-[12px] font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    Your Order from
                  </div>
                  <h2 className="text-[20px] font-bold text-white leading-tight">Cloud Gate (The Bean), Chicago</h2>
                  <div className="flex items-center gap-1.5 text-zinc-300 text-[13px] mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    7 Elm Street, Woodstock, OX7 1ER
                  </div>
                  <div className="flex items-center gap-6 mt-1.5 text-zinc-400 text-[12px]">
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4" /><circle cx="7" cy="21" r="1" /><circle cx="20" cy="21" r="1" /></svg>
                      2.3 km away
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      30 mins delivery
                    </span>
                  </div>
                </div>
                <button onClick={() => setIsBranchModalOpen(true)} className="bg-[#F9671A] hover:bg-[#ff7a33] text-white text-[13px] font-bold px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-orange-600/20 transition-all cursor-pointer flex-shrink-0">
                  Change Branch
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>

            {/* Your Information (No border on inputs) */}
            <div className="mb-6">
              <h3 className="text-[16px] font-bold text-white mb-3">Your Information</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[12px] text-zinc-400 mb-1.5 block">Name</label>
                  <input defaultValue="Alan Cattach" className="w-full bg-[#212124] rounded-[12px] px-4 py-3 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                </div>
                <div>
                  <label className="text-[12px] text-zinc-400 mb-1.5 block">Phone Number</label>
                  <input defaultValue="+1 0123456789" className="w-full bg-[#212124] rounded-[12px] px-4 py-3 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                </div>
                <div>
                  <label className="text-[12px] text-zinc-400 mb-1.5 block">Delivery Address</label>
                  <div className="relative">
                    <input defaultValue="NW1 6XE, London, 221B Baker Street, Marylebone" className="w-full bg-[#212124] rounded-[12px] px-4 py-3 pr-10 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Tip (No border, Regular Card bg style for active) */}
            <div className="mb-6">
              <h3 className="text-[16px] font-bold text-white mb-3">Add a Tip (Optional)</h3>
              <div className="flex items-center gap-2.5 flex-wrap">
                {["No Tip", "£2", "£5", "£10"].map(t => (
                  <button
                    key={t}
                    onClick={() => setTip(t)}
                    className={`px-5 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${tip === t ? "bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] text-white shadow-lg shadow-orange-600/10" : "bg-[#212124] text-zinc-300 hover:text-white"}`}
                  >
                    {t}
                    {tip === t && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection (No border, Regular Card bg style for active) */}
            <div className="mb-6">
              <h3 className="text-[16px] font-bold text-white mb-3">Time Selection</h3>
              <div className="flex items-center gap-2.5 flex-wrap">
                {["ASAP", "In15mins", "In30mins", "In30mins", "Schedule Time"].map((t, i) => (
                  <button
                    key={`${t}-${i}`}
                    onClick={() => setTime(t)}
                    className={`px-5 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${time === t && i === ["ASAP", "In15mins", "In30mins", "In30mins", "Schedule Time"].indexOf(time) ? "bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] text-white shadow-lg shadow-orange-600/10" : "bg-[#212124] text-zinc-300 hover:text-white"}`}
                  >
                    {t}
                    {time === t && i === 0 && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method (No border, Regular Card bg style for active) */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                <h3 className="text-[16px] font-bold text-white">Payment Method</h3>
              </div>
              <p className="text-zinc-500 text-[12px] mb-4 font-medium">Payment will be processed via Stripe</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  {
                    id: "Card", label: "Card", icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                    )
                  },
                 
                ].map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => setPay(pm.id)}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-[14px] text-[14px] font-bold transition-all cursor-pointer ${pay === pm.id ? "bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] text-white shadow-lg shadow-orange-600/10" : "bg-[#212124] text-zinc-300 hover:text-white"}`}
                  >
                    {pm.icon}
                    {pm.id === "Card" ? "Card" : pm.id === "Apple Pay" ? <><span style={{ fontFamily: "sans-serif" }}>🍎</span> Pay</> : <><span className="text-[#4285F4] font-bold">G</span>{pm.label}</>}
                  </button>
                ))}
              </div>

              {/* Card Details (No border on inputs) */}
              {pay === "Card" && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-[14px] font-bold text-white mb-1">Card details</h4>
                  <div>
                    <label className="text-[12.5px] text-zinc-400 mb-1.5 block font-medium">Cardholder name</label>
                    <input defaultValue="Alan Cattach" className="w-full bg-[#212124] rounded-[12px] px-4 py-3 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                  </div>
                  <div>
                    <label className="text-[12.5px] text-zinc-400 mb-1.5 block font-medium">Card Number</label>
                    <input defaultValue="123*********5" className="w-full bg-[#212124] rounded-[12px] px-4 py-3 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[12.5px] text-zinc-400 mb-1.5 block font-medium">Expire Date</label>
                      <input defaultValue="17 Oct, 2028" className="w-full bg-[#212124] rounded-[12px] px-4 py-3 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                    </div>
                    <div>
                      <label className="text-[12.5px] text-zinc-400 mb-1.5 block font-medium">CVC</label>
                      <input defaultValue="555" type="password" className="w-full bg-[#212124] rounded-[12px] px-4 py-3 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="pb-10"></div>
          </main>

          {/* Right Sidebar (Map & Order Summary - Same width and structure as Menu Page Cart) */}
          <aside className="w-full lg:w-[355px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 bg-[#1E1E20] flex flex-col h-auto lg:h-full relative z-30">
            {/* Map Section (No border on map container) */}
            <div className="p-6 pb-4 border-b border-white/5 mx-6 px-0 mb-4 flex flex-col gap-4 flex-shrink-0">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-[17px] font-bold text-white">Map Location</h3>
              </div>
              <div className="w-full h-[180px] rounded-[16px] overflow-hidden shadow-lg bg-[#252527]">
                <CheckoutMap />
              </div>
            </div>

            {/* Order Summary Section (No border on items) */}
            <div className="flex-1 overflow-y-auto px-6 flex flex-col scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[17px] font-bold text-white">Order Summary</h3>
                <div className="bg-[#3a2016] text-[#F9671A] text-[10px] font-extrabold px-2 py-0.5 rounded border border-[#F9671A]/20">
                  {cartItems.length} ITEMS
                </div>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-4 mb-6">
                {cartItems.map(item => (
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
            </div>

            {/* Footer / Total Row (Same structure as Menu Page Cart Footer) */}
            <div className="p-6 border-t border-white/5 mt-auto bg-[#1a1a1c]/50 flex flex-col flex-shrink-0">
              {/* Price Breakdown */}
              <div className="flex flex-col gap-3 mb-5">
                {[
                  ["Subtotal", `£${subtotal.toFixed(2)}`],
                  ["Delivery", "Free"],
                  ["Incl. VAT", `£${vat.toFixed(2)}`],
                  ["Rider's Tip", tipAmt > 0 ? `£${tipAmt.toFixed(2)}` : "00.00"],
                  ["Loyalty discount", "00.00"]
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between items-center text-[13px]">
                    <span className="text-zinc-400">{l}</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-[13px] mt-1">
                  <span className="text-zinc-400">Use loyalty points</span>
                  <div onClick={() => setLoyalty(!loyalty)} className="w-8 h-4 bg-zinc-700 rounded-full relative cursor-pointer transition-colors" style={loyalty ? { backgroundColor: "#F9671A" } : {}}>
                    <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${loyalty ? "left-4.5" : "left-0.5 bg-zinc-400"}`} />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-5 pt-4 border-t border-white/10">
                <span className="text-[16px] font-bold text-white">Total</span>
                <span className="text-[18px] font-extrabold text-[#F9671A]">£{total.toFixed(2)}</span>
              </div>

              <button onClick={() => router.push("/my-orders")} className="w-full py-3.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[14px] font-bold transition-colors shadow-lg shadow-orange-600/20 cursor-pointer flex items-center justify-center gap-2">
                Place Order
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Change Branch Modal Overlay - fixed z-20, right sidebar is z-30 so stays bright */}
      {isBranchModalOpen && (
        <div
          className="fixed top-0 bottom-0 left-0 right-0 lg:right-[355px] z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center lg:pl-[260px] p-4"
          onClick={() => setIsBranchModalOpen(false)}
        >
          <div
            className="bg-[#1E1E20] border border-white/10 rounded-[24px] w-full max-w-[520px] p-6 shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[20px] font-bold text-white">Change Branch</h3>
              <button onClick={() => setIsBranchModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <p className="text-[14px] text-zinc-400 mb-5">Select Branch</p>
            <div className="flex flex-col gap-3 mb-6">
              {branches.map(b => {
                const sel = selectedBranch === b.name;
                return (
                  <div key={b.name} onClick={() => setSelectedBranch(b.name)} className={`p-5 rounded-[20px] cursor-pointer relative flex flex-col gap-1.5 transition-all ${sel ? "bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] shadow-lg" : "bg-[#212124] hover:bg-[#252528]"}`}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-[16px] font-bold text-white pr-8">{b.name}</h4>
                      {sel && <div className="absolute top-5 right-5 w-5 h-5 bg-[#F9671A] rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-300 text-[13px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      {b.address}
                    </div>
                    <div className="flex items-center gap-6 text-zinc-400 text-[12px]">
                      <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4"/><circle cx="7" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>{b.dist}</span>
                      <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{b.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => { setActiveBranch(selectedBranch); setIsBranchModalOpen(false); }} className="w-full py-3.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[15px] font-bold transition-colors shadow-lg shadow-orange-600/20 cursor-pointer">
              Save Branch
            </button>
          </div>
        </div>
      )}

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
