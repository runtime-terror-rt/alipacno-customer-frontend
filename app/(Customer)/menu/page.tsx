"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star } from "lucide-react";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("Steaks");
  const [activeTag, setActiveTag] = useState("All Steaks");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalQty, setModalQty] = useState(1);

  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Grilled chicken pieces", desc: "Medium Rare, Bone Marrow Butter", price: 48, qty: 1, image: "/customer/popular-1.png" },
    { id: 3, name: "Vegetable Stir Fry", desc: "Medium Rare, Bone Marrow Butter", price: 48, qty: 1, image: "/customer/popular-3.png" },
  ]);

  const addToCart = (item: any, explicitQty: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + explicitQty } : i);
      }
      return [...prev, { id: item.id, name: item.name, desc: "Medium Rare, Bone Marrow Butter", price: parseFloat(item.price.replace('£', '')), qty: explicitQty, image: item.image }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCartItems(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.qty + delta);
        return { ...i, qty: newQty };
      }
      return i;
    }).filter(i => i.qty > 0));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const vat = 2.00;
  const total = cartItems.length > 0 ? subtotal + vat : 0;
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

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

  const steaks = [
    { id: 1, name: "Grilled chicken pieces", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/happypricing-1.png" },
    { id: 2, name: "Ribeye Steak", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/happypricing-2.png" },
    { id: 3, name: "Vegetable Stir Fry", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/happypricing-3.png" },
    { id: 4, name: "Pork Belly Bao", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/happypricing-4.png" },
  ];

  const popularSteaks = [
    { id: 5, name: "Filet Mignon", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/most-popular-1.png" },
    { id: 6, name: "Ribeye Steak", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/most-popular-2.png" },
    { id: 7, name: "Vegetable Stir Fry", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/most-popular-3.png" },
    { id: 8, name: "Pork Belly Bao", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/most-popular-4.png" },
    { id: 9, name: "New York Strip Steak", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/most-popular-5.png" },
    { id: 10, name: "T-Bone Steak", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/most-popular-6.png" },
    { id: 11, name: "Sirloin Steak", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/most-popular-7.png" },
    { id: 12, name: "Chateaubriand", price: "£39.99", oldPrice: "£52.00", rating: "4.5", image: "/customer/most-popular-8.png" },
  ];

  return (
    <div className="h-screen w-screen bg-[#1E1E20] flex text-white overflow-hidden font-sans select-none">
      {/* 1. Left Sidebar */}
      <div className="w-[240px] md:w-[260px] flex-shrink-0 border-r border-white/5 bg-[#1a1a1c] flex flex-col">
        {/* Logo */}
        <div className="h-[90px] flex items-center justify-center px-6 mt-4">
          <Link href="/home">
            <Image src="/logo.png" alt="Logo" width={130} height={80} priority />
          </Link>
        </div>
        <div className="border-b border-white/5  mt-4"></div>
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
                  className={`flex items-center w-full px-6 py-4 transition-colors duration-200 group border-l-[4px] cursor-pointer ${isActive ? "bg-[#EBE5E0] border-[#F9671A]" : "border-transparent hover:bg-white/5"
                    }`}
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-[70px] flex-shrink-0 border-b border-white/5 bg-[#1E1E20] flex items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="text-zinc-400 text-sm font-medium">Nearest Branch:</span>
            <span className="text-[#F9671A] text-sm font-semibold ml-1">Cloud Gate (The Bean), Chicago</span>
          </div>

          <div className="flex items-center gap-5">
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
            <button className="relative text-zinc-400 hover:text-white transition-colors mr-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="absolute -top-1.5 -right-1.5 bg-[#F9671A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer">
              <span className="text-sm font-medium text-white">Alan Cattach</span>
              <div className="w-8 h-8 rounded-full bg-zinc-700 overflow-hidden relative border border-white/10">
                {/* Dummy Avatar */}
                <Image src="/customer/banner-men.png" alt="Avatar" fill className="object-cover" />
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <main className="flex-1 h-full px-6 sm:px-8 py-6 pb-20 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* Banner */}
            <div className="w-full bg-gradient-to-r from-[#FFF8F4] to-[#FFB894] rounded-[24px] pl-6 sm:pl-10 pr-0 py-0 flex items-center justify-between relative shadow-xl overflow-hidden border border-[#2d2d2d] flex-shrink-0 h-[160px] sm:h-[180px] md:h-[220px] mb-8"
              style={{ background: 'linear-gradient(110deg, #1E1E20 0%, #1E1E20 45%, #6b2a0e 62%, #b05020 75%, #f5ece5 100%)' }}
            >
              <div className="flex-1 z-10 text-left py-4 overflow-hidden pl-2">
                <p className="text-zinc-400 text-[12px] sm:text-[16px] font-normal mb-1 whitespace-nowrap mt-6">
                  Order Restaurant food, takeaway and groceries.
                </p>

                <h1 className="text-white text-[26px] sm:text-[36px] md:text-[52px] leading-[1] tracking-tight font-normal whitespace-nowrap">
                  Food ordering is now more
                </h1>

                <h1 className="text-[#F9671A] text-[28px] sm:text-[38px] md:text-[46px] leading-[1.1] tracking-tight font-normal whitespace-nowrap">
                  personalized and instant
                </h1>

                <div className="relative max-w-[350px] mb-6 mt-3">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                    </svg>
                  </span>

                  <input
                    type="text"
                    placeholder="Are you hungry...."
                    className="w-full rounded-full py-2.5 pl-9 pr-4 text-[13px] text-white placeholder:text-white/50 outline-none focus:ring-1 focus:ring-[#F9671A] whitespace-nowrap"
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
                  />
                </div>
              </div>

              <div className="h-full flex items-end justify-end relative z-10 flex-shrink-0 w-[240px] sm:w-[320px] md:w-[400px]">
                <img src="/customer/banner-men.png" alt="Delivery Man" className="h-[90%] sm:h-[98%] w-auto object-contain object-bottom -mr-[24%] sm:-mr-[32%] z-0" />
                <img src="/customer/banner-woman.png" alt="Woman Eating" className="h-[90%] sm:h-[96%] w-auto object-contain object-bottom z-10" />
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-3 mb-6 overflow-x-auto scrollbar-hide pb-2">
              {["All Steaks", "Grass Fed", "Wagyu Selection", "Dry Aged"].map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${activeTag === tag
                      ? "bg-[#F9671A] text-white shadow-lg shadow-orange-600/20"
                      : "bg-white text-[#1A1A1A] hover:bg-zinc-200"
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Happy Hour Section */}
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-[17px] font-bold text-white flex items-center">
                Happy hour pricing: <span className="text-[#F9671A] ml-2">03h : 22m : 31s</span>
              </h2>
              <div className="bg-[#3a2016] text-[#F9671A] border border-[#F9671A]/20 text-[11px] font-bold px-2.5 py-1 rounded-full">
                35% OFF
              </div>
            </div>

            {/* Happy Hour Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
              {steaks.map(item => (
                <div key={`happy-${item.id}`} className="bg-[#212124] rounded-[16px] overflow-hidden flex flex-col border border-white/5 group hover:border-[#F9671A]/30 transition-colors shadow-lg">
                  <div className="relative w-full aspect-[4/3] bg-[#1a1a1c] overflow-hidden">
                    <div className="absolute top-2.5 left-2.5 bg-[#1E1E20]/90 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold text-white z-10 shadow-md">
                      <Star size={12} className="text-[#F9671A] fill-[#F9671A]" /> {item.rating}
                    </div>

                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500 z-0" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-[14px] font-bold text-white mb-1.5 truncate">{item.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs mb-4">
                      <span className="font-extrabold text-[#F9671A]">{item.price}</span>
                      <span className="text-zinc-500 line-through text-[11px]">{item.oldPrice}</span>
                      <span className="text-zinc-400 text-[11px]">/portion</span>
                    </div>
                    <button onClick={() => { setSelectedProduct(item); setModalQty(1); }} className="mt-auto w-full py-2 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Most popular Steaks Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[19px] font-bold text-white">Most popular Steaks</h2>
              <button className="bg-white/5 border border-white/10 text-white text-[12px] font-medium px-4 py-1.5 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer">
                Sort
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M7 12h10"></path><path d="M10 18h4"></path></svg>
              </button>
            </div>

            {/* Most Popular Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularSteaks.map(item => (
                <div key={`pop-${item.id}`} className="bg-[#212124] rounded-[16px] overflow-hidden flex flex-col border border-white/5 group hover:border-[#F9671A]/30 transition-colors shadow-lg">
                  <div className="relative w-full aspect-[4/3] bg-[#1a1a1c] overflow-hidden">
                    <div className="absolute top-2.5 left-2.5 bg-[#1E1E20]/90 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold text-white z-10 shadow-md">
                      <Star size={12} className="text-[#F9671A] fill-[#F9671A]" /> {item.rating}
                    </div>
                    <button className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-md z-20 border border-white/10 transition-colors text-white shadow-lg cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                    </button>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500 z-0" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-[14px] font-bold text-white mb-1.5 truncate">{item.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs mb-4">
                      <span className="font-extrabold text-[#F9671A]">{item.price}</span>
                      <span className="text-zinc-500 line-through text-[11px]">{item.oldPrice}</span>
                      <span className="text-zinc-400 text-[11px]">/portion</span>
                    </div>
                    <button onClick={() => { setSelectedProduct(item); setModalQty(1); }} className="mt-auto w-full py-2 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </main>

          {/* Right Sidebar (Cart) */}
          <aside className="w-[340px] flex-shrink-0 border-l border-white/5 bg-[#1E1E20] flex flex-col h-full">
            <div className="p-6 pb-2 flex items-center justify-between border-b border-white/5 mx-6 px-0 mb-4 h-[70px] flex-shrink-0">
              <h2 className="text-[17px] font-bold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                  <path d="M3 6h18"></path>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Order Carts
              </h2>
              <div className="bg-[#3a2016] text-[#F9671A] text-[10px] font-extrabold px-2 py-0.5 rounded border border-[#F9671A]/20">
                {totalItems} ITEMS
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-6 scrollbar-hide">
              {/* Cart Items */}
              <div className="flex flex-col gap-5">
                {cartItems.length === 0 && (
                  <div className="text-zinc-500 text-center py-4 text-sm font-medium">Cart is empty.</div>
                )}
                {cartItems.map(item => (
                  <div key={`cart-${item.id}`} className="flex gap-3">
                    <div className="w-[60px] h-[60px] rounded-[12px] bg-[#2a2a2c] overflow-hidden flex-shrink-0 relative">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-[13px] font-bold text-white leading-tight mb-1">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-zinc-400">{item.desc}</p>
                        </div>
                        <span className="text-[14px] font-extrabold text-[#F9671A]">£{item.price}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <button onClick={() => updateQty(item.id, -1)} className="w-5 h-5 rounded flex items-center justify-center border border-white/20 text-white hover:bg-white/10 cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path></svg>
                        </button>
                        <span className="text-[13px] font-bold text-white">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-5 h-5 rounded flex items-center justify-center border border-white/20 text-white hover:bg-white/10 cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Loyalty Points */}
              <div className="bg-[#2a2a2c] rounded-[16px] p-4 flex gap-3 items-center border border-white/5">
                <div className="w-10 h-10 rounded-full bg-[#3a2016] flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#F9671A" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-white mb-0.5">You'll earn 5 loyalty points</h4>
                  <p className="text-[10px] text-zinc-400">1 point per £10 spends - 100 points = £1 discount</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-6 border-t border-white/5 mt-auto bg-[#1a1a1c]/50">
              <div className="flex flex-col gap-3 mb-5">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="font-medium text-white">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-zinc-400">Delivery fee</span>
                  <span className="font-medium text-white">{cartItems.length > 0 ? "Free" : "£0.00"}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-zinc-400">Incl. VAT</span>
                  <span className="font-medium text-white">£{cartItems.length > 0 ? vat.toFixed(2) : "0.00"}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-zinc-400">Loyalty discount</span>
                  <span className="font-medium text-white">00.00</span>
                </div>
                <div className="flex justify-between items-center text-[13px] mt-1">
                  <span className="text-zinc-400">Use loyalty ponints</span>
                  <div className="w-8 h-4 bg-zinc-700 rounded-full relative cursor-pointer">
                    <div className="w-3 h-3 bg-zinc-400 rounded-full absolute left-0.5 top-0.5"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mb-5 pt-4 border-t border-white/10">
                <span className="text-[16px] font-bold text-white">Total</span>
                <span className="text-[18px] font-extrabold text-[#F9671A]">£{total.toFixed(2)}</span>
              </div>
              <button className="w-full py-3.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[14px] font-bold transition-colors shadow-lg shadow-orange-600/20 cursor-pointer">
                Proceed to checkout
              </button>
            </div>
          </aside>
        </div>
      </div>
      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed top-0 left-0 bottom-0 right-[340px] z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-hidden">
          <div className="relative w-full max-w-[600px] max-h-[90vh] bg-[#1a1a1c] border border-white/10 rounded-[24px] flex flex-col shadow-2xl">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-5 right-5 text-zinc-400 hover:text-white bg-[#212124] p-1.5 rounded-full border border-white/10 z-20 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {/* Header */}
              <div className="flex flex-col sm:flex-row gap-5 mb-8">
                <div className="relative w-full sm:w-[220px] h-[160px] rounded-[16px] overflow-hidden flex-shrink-0 bg-[#212124]">
                  <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
                  <div className="absolute top-3 left-3 bg-[#1E1E20]/90 backdrop-blur-md px-2 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1 border border-white/10">
                    <Star size={12} className="text-[#F9671A] fill-[#F9671A]" /> {selectedProduct.rating}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#1E1E20]/90 backdrop-blur-md p-1.5 rounded-full text-white border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                  </div>
                </div>
                <div className="flex-1 pr-6">
                  <h2 className="text-[22px] font-bold text-white mb-3 leading-tight">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-3 text-[12px] text-zinc-400 mb-3">
                    <span>Distance: 2.3 km</span>
                    <span>Estimated Time: <span className="text-[#F9671A]">25-30 mins</span></span>
                  </div>
                  <p className="text-[13px] text-zinc-400 leading-relaxed mb-4">Premium center-cut filet mignon grilled to perfection with garlic herb butter. Tender, juicy, and rich in flavor.</p>
                  <div className="text-[24px] font-extrabold text-[#F9671A]">{selectedProduct.price}</div>
                </div>
              </div>

              {/* Choose Size */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-[16px] font-bold text-white">Choose Size</h3>
                  <span className="text-[#F9671A] bg-[#F9671A]/10 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Required</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative p-3.5 rounded-[16px] bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] cursor-pointer flex flex-col shadow-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[15px] font-bold text-white">Regular</span>
                      <div className="w-5 h-5 bg-[#F9671A] rounded-full flex items-center justify-center shadow-md"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                    </div>
                    <span className="text-[12px] text-zinc-300">5-inch</span>
                  </div>
                  <div className="relative p-3.5 rounded-[16px] border border-white/5 bg-[#212124] hover:border-white/10 cursor-pointer flex flex-col transition-all">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[15px] font-bold text-white">Medium</span>
                      <div className="w-5 h-5 rounded-full border border-zinc-500"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-zinc-400">8-inch</span>
                      <span className="text-[12px] text-[#F9671A] font-semibold">+£4.00</span>
                    </div>
                  </div>
                  <div className="relative p-3.5 rounded-[16px] border border-white/5 bg-[#212124] hover:border-white/10 cursor-pointer flex flex-col transition-all">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[15px] font-bold text-white">Large</span>
                      <div className="w-5 h-5 rounded-full border border-zinc-500"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-zinc-400">12-inch</span>
                      <span className="text-[12px] text-[#F9671A] font-semibold">+£8.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cooking Preference */}
              <div className="mb-8">
                <h3 className="text-[16px] font-bold text-white mb-4">Cooking Preference</h3>
                <div className="flex flex-wrap gap-2.5">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] text-white text-[13px] font-semibold shadow-md">
                    <div className="w-4 h-4 bg-[#F9671A] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                    Rare
                  </button>
                  {["Medium-Rare", "Medium", "Medium-Well", "Well-Done"].map(opt => (
                    <button key={opt} className="px-4 py-2.5 rounded-full border border-white/5 bg-[#212124] text-zinc-300 hover:border-white/10 hover:text-white text-[13px] font-semibold transition-colors">{opt}</button>
                  ))}
                </div>
              </div>

              {/* Spice Level */}
              <div className="mb-8">
                <h3 className="text-[16px] font-bold text-white mb-4">Spice Level</h3>
                <div className="flex flex-wrap gap-2.5">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] text-white text-[13px] font-semibold shadow-md">
                    <div className="w-4 h-4 bg-[#F9671A] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                    Mild
                  </button>
                  {["Medium", "Hot"].map(opt => (
                    <button key={opt} className="px-4 py-2.5 rounded-full border border-white/5 bg-[#212124] text-zinc-300 hover:border-white/10 hover:text-white text-[13px] font-semibold transition-colors">{opt}</button>
                  ))}
                </div>
              </div>

              {/* Modify Toppings */}
              <div className="mb-8">
                <h3 className="text-[16px] font-bold text-white mb-4">Modify Toppings</h3>
                <div className="flex flex-wrap gap-2.5">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] text-white text-[13px] font-semibold shadow-md">
                    <div className="w-4 h-4 bg-[#F9671A] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                    Truffle Butter <span className="text-zinc-300 font-medium">+£4.00</span>
                  </button>
                  {[
                    { n: "Foie Gras", p: "+£4.00" },
                    { n: "Crispy Bacon", p: "+£4.00" },
                    { n: "Fried Egg", p: "+£4.00" }
                  ].map(opt => (
                    <button key={opt.n} className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/5 bg-[#212124] text-zinc-300 hover:border-white/10 hover:text-white text-[13px] font-semibold transition-colors">
                      {opt.n} <span className="text-zinc-500 font-medium">{opt.p}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Extras */}
              <div className="mb-8">
                <h3 className="text-[16px] font-bold text-white mb-4">Add Extras</h3>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { n: "Garlic Bread", p: "+£4.00" },
                    { n: "Béarnaise Sauce", p: "+£4.00" },
                    { n: "Lobster Tail", p: "+£4.00" },
                    { n: "Mashed Potatoes", p: "+£4.00" },
                    { n: "French Fries", p: "+£4.00" }
                  ].map(opt => (
                    <button key={opt.n} className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/5 bg-[#212124] text-zinc-300 hover:border-white/10 hover:text-white text-[13px] font-semibold transition-colors">
                      {opt.n} <span className="text-zinc-500 font-medium">{opt.p}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Remove Ingredients */}
              <div className="mb-8">
                <h3 className="text-[16px] font-bold text-white mb-4">Remove Ingredients</h3>
                <div className="flex flex-wrap gap-2.5">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#2b2b2d] via-[#322724] to-[#5c301c] text-white text-[13px] font-semibold shadow-md">
                    No Pepper
                    <div className="w-4 h-4 bg-[#F9671A] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></div>
                  </button>
                  {["No Butter", "No Salt", "No Herbs"].map(opt => (
                    <button key={opt} className="px-4 py-2.5 rounded-full border border-white/5 bg-[#212124] text-zinc-300 hover:border-white/10 hover:text-white text-[13px] font-semibold transition-colors">{opt}</button>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <h3 className="text-[16px] font-bold text-white mb-4">Special Instructions</h3>
                <textarea
                  placeholder="Any special requests?"
                  className="w-full bg-[#212124] border border-white/5 rounded-2xl p-4 text-[13px] text-white placeholder-zinc-500 outline-none focus:border-[#F9671A]/50 transition-colors resize-none h-[100px]"
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-[#1E1E20] border-t border-white/5 flex items-center gap-4 flex-shrink-0 rounded-b-[24px]">
              <div className="bg-[#2a2a2c] rounded-full flex items-center px-2 py-2 gap-5 border border-white/5">
                <button onClick={() => setModalQty(Math.max(1, modalQty - 1))} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path></svg>
                </button>
                <span className="text-[16px] font-bold text-white w-2 text-center">{modalQty}</span>
                <button onClick={() => setModalQty(modalQty + 1)} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                </button>
              </div>
              <button
                onClick={() => { addToCart(selectedProduct, modalQty); setSelectedProduct(null); }}
                className="flex-1 bg-[#F9671A] text-white py-3.5 rounded-full font-bold text-[15px] hover:bg-[#ff7a33] transition shadow-lg shadow-orange-600/20 cursor-pointer "
              >
                Add to Cart - £{(parseFloat(selectedProduct.price.replace('£', '')) * modalQty).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
