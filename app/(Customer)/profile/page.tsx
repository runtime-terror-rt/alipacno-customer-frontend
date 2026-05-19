"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState("/customer/cover-image.png");
  const [profilePhoto, setProfilePhoto] = useState("/customer/profile.png");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCoverPhoto(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setProfilePhoto(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
                  onClick={() => router.push("/menu")}
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
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
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
            <button onClick={() => router.push("/my-orders")} className="relative text-zinc-400 hover:text-white transition-colors mr-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="absolute -top-1.5 -right-1.5 bg-[#F9671A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
            </button>

            <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-white/10 cursor-pointer">
              <span className="text-sm font-medium text-[#F9671A] hidden sm:inline">Charles Deo</span>
              <div className="w-8 h-8 rounded-full bg-zinc-700 overflow-hidden relative border border-[#F9671A]/30">
                <Image src={profilePhoto} alt="Avatar" fill className="object-cover" />
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 hidden sm:inline">
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

        {/* Dashboard Content */}
        <main className="flex-1 h-full px-4 sm:px-8 py-6 lg:py-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {isEditing ? (
            <div className="max-w-[800px] mx-auto lg:mx-0">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8 mt-2">
                <button onClick={() => setIsEditing(false)} className="text-white hover:text-zinc-300 transition-colors cursor-pointer flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <h1 className="text-[18px] lg:text-[22px] font-bold text-white">Customer profile</h1>
              </div>

              {/* Avatar Section */}
              <div className="mb-10 relative w-[100px] h-[100px] mx-auto lg:mx-0 mt-4 lg:mt-0">
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-[3px] border-[#1E1E20] relative shadow-lg">
                  <Image src={profilePhoto} alt="Profile" fill className="object-cover" />
                </div>
                <button 
                  onClick={() => document.getElementById('profile-upload-input')?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-[#F9671A] hover:bg-[#ff7a33] transition-colors rounded-full flex items-center justify-center cursor-pointer border-[3px] border-[#1E1E20] shadow-md z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                </button>
                <input 
                  id="profile-upload-input" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleProfileChange} 
                />
              </div>

              <h3 className="text-[17px] font-bold text-white mb-6">Your Information</h3>
              
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13.5px] font-medium text-white">Name</label>
                  <input defaultValue="Charles Deo" className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13.5px] font-medium text-white">Gender</label>
                    <input defaultValue="Male" className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13.5px] font-medium text-white">Phone Number</label>
                    <input defaultValue="+1 0123456789" className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13.5px] font-medium text-white">Email</label>
                  <input defaultValue="Mehrabbozorgi.business@gmail.com" className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13.5px] font-medium text-white">Country</label>
                  <input defaultValue="UK" className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13.5px] font-medium text-white">Post code</label>
                    <input defaultValue="NW1 6XE" className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13.5px] font-medium text-white">City</label>
                    <input defaultValue="London" className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13.5px] font-medium text-white">Address line 1</label>
                  <input defaultValue="221B Baker Street" className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13.5px] font-medium text-white">Address line 2</label>
                  <input defaultValue="Marylebone" className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                </div>

                <h3 className="text-[17px] font-bold text-white mb-1 mt-6">Payment Information</h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13.5px] font-medium text-white">Cardholder name</label>
                  <input defaultValue="Charles Deo" className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13.5px] font-medium text-white">Expire Date</label>
                    <input defaultValue="17 Oct, 2028" className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13.5px] font-medium text-white">CVC</label>
                    <input defaultValue="555" className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
                  </div>
                </div>
                
                <div className="flex gap-4 mb-20 max-w-[400px]">
                  <button onClick={() => setIsEditing(false)} className="border border-[#F9671A]/50 text-[#F9671A] hover:bg-[#F9671A]/10 text-[14px] font-bold px-8 py-3.5 rounded-full transition-colors flex-1 cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={() => setIsEditing(false)} className="bg-[#F9671A] hover:bg-[#ff7a33] text-white text-[14px] font-bold px-8 py-3.5 rounded-full transition-colors shadow-lg shadow-orange-600/20 flex-1 cursor-pointer">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-6 lg:mb-8 mt-2">
                <button onClick={() => router.push("/home")} className="lg:hidden text-white hover:text-zinc-300 transition-colors cursor-pointer flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <h1 className="text-[18px] lg:text-[20px] font-bold text-white">Customer profile</h1>
              </div>

          {/* Banner Container */}
          <div className="relative mb-[70px]">
            {/* Cover Photo */}
            <div className="w-full h-[180px] lg:h-[220px] rounded-[16px] lg:rounded-[24px] overflow-hidden relative shadow-lg bg-[#1E1E20]">
              {/* Background Texture */}
              <Image src="/customer/profile-bg.jpg" alt="Cover Texture" fill className="object-cover z-0 opacity-80" />
              {/* Food Image (smaller and on the right side) */}
              <div className="absolute inset-0 flex items-center justify-end pr-0 lg:pr-[250px] z-10">
                <div className="relative w-[280px] lg:w-[450px] h-[180px] lg:h-[220px]">
                  <Image src={coverPhoto} alt="Cover Food" fill className="object-contain drop-shadow-2xl" />
                </div>
              </div>
              <button 
                onClick={() => document.getElementById('cover-upload-input')?.click()}
                className="absolute bottom-3 right-3 lg:bottom-4 lg:right-4 bg-black/60 lg:bg-white text-white lg:text-[#F9671A] text-[12px] lg:text-[13px] font-bold p-2.5 lg:px-4 lg:py-2 rounded-full flex items-center gap-2 cursor-pointer shadow-lg hover:bg-black/80 lg:hover:bg-zinc-100 transition-colors z-20 backdrop-blur-md"
              >
                {/* Mobile Icon (Image) */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lg:hidden">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                {/* Desktop Icon (Edit/Pen) */}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hidden lg:block">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
                </svg>
                <span className="hidden lg:inline">Edit Cover Photo</span>
              </button>
              <input 
                id="cover-upload-input" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleCoverChange} 
              />
            </div>

            {/* Profile Photo */}
            <div className="absolute -bottom-[50px] lg:-bottom-[65px] left-4 lg:left-16 w-[100px] h-[100px] lg:w-[160px] lg:h-[160px] rounded-full border-[4px] lg:border-[6px] border-[#1E1E20] overflow-hidden bg-zinc-800 z-30 shadow-xl">
              <Image src={profilePhoto} alt="Profile" fill className="object-cover" />
            </div>
          </div>

          {/* Profile Info & Edit Button */}
          <div className="flex justify-between items-center lg:items-start mb-8 lg:mb-10 px-2 mt-4 lg:mt-0">
            <div className="lg:pl-[250px] lg:-mt-5 flex-1 min-w-0 pr-4">
              <h2 className="text-[20px] lg:text-[28px] font-bold text-[#F9671A] leading-tight truncate">Charles Deo</h2>
              <p className="text-[13px] lg:text-[15px] text-zinc-400 italic">Food Lover</p>
            </div>
            <button onClick={() => setIsEditing(true)} className="border border-[#F9671A]/30 text-[#F9671A] hover:bg-[#F9671A]/10 text-[12px] lg:text-[13px] font-bold px-4 py-2 lg:px-6 lg:py-2.5 rounded-full flex items-center gap-1.5 transition-colors flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
              </svg>
              Edit Profile
            </button>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* About Section */}
            <div className="lg:col-span-5 bg-[#252527] rounded-[24px] p-7 border border-white/5 shadow-md">
              <h3 className="text-[17px] font-bold text-white mb-6">About</h3>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 text-zinc-400 pb-5 border-b border-white/5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span className="text-[14px]">Gender: Male</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-400 pb-5 border-b border-white/5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span className="text-[14px]">Phone:+1 0123456789</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-400 pb-5 border-b border-white/5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <span className="text-[14px]">Email:exmple@gmail.com</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="text-[14px]">Address: 7 Elm Street, Woodstock, OX7 1ER</span>
                </div>
              </div>
            </div>

            {/* Favourite Item Section */}
            <div className="lg:col-span-7 bg-[#252527] rounded-[24px] p-7 border border-white/5 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[17px] font-bold text-white">Favourite Item</h3>
                <button className="bg-white hover:bg-zinc-200 transition-colors text-zinc-900 text-[12px] font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm cursor-pointer">
                  Sort 
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {/* Item 1 */}
                <div className="bg-[#1E1E20] rounded-[16px] overflow-hidden flex flex-col p-2.5 pb-4 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-full aspect-[4/3] rounded-[12px] bg-[#1a1a1c] relative overflow-hidden mb-3">
                    <Image src="/customer/most-popular-2.png" alt="Vegetable Stir Fry" fill className="object-cover" />
                    {/* Rating Pill */}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#F9671A" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      4.5
                    </div>
                    {/* Heart Pill */}
                    <button className="absolute top-2 right-2 w-7 h-7 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-colors cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </button>
                  </div>
                  <h4 className="text-[14px] font-bold text-white mb-1.5 px-1 truncate">Vegetable Stir Fry</h4>
                  <div className="flex items-center gap-1.5 px-1 mb-4">
                    <span className="text-[#F9671A] text-[13px] font-extrabold">£39.99</span>
                    <span className="text-zinc-500 text-[11px] line-through">£52.99</span>
                    <span className="text-zinc-400 text-[11px]">/portion</span>
                  </div>
                  <button className="w-full py-2.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[13px] font-bold transition-colors shadow-lg shadow-orange-600/20 flex items-center justify-center gap-1.5 mt-auto cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    Add to cart
                  </button>
                </div>

                {/* Item 2 */}
                <div className="bg-[#1E1E20] rounded-[16px] overflow-hidden flex flex-col p-2.5 pb-4 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-full aspect-[4/3] rounded-[12px] bg-[#1a1a1c] relative overflow-hidden mb-3">
                    <Image src="/customer/most-popular-3.png" alt="Pork Belly Bao" fill className="object-cover" />
                    {/* Rating Pill */}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#F9671A" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      4.5
                    </div>
                    {/* Heart Pill */}
                    <button className="absolute top-2 right-2 w-7 h-7 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-colors cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </button>
                  </div>
                  <h4 className="text-[14px] font-bold text-white mb-1.5 px-1 truncate">Pork Belly Bao</h4>
                  <div className="flex items-center gap-1.5 px-1 mb-4">
                    <span className="text-[#F9671A] text-[13px] font-extrabold">£39.99</span>
                    <span className="text-zinc-500 text-[11px] line-through">£52.99</span>
                    <span className="text-zinc-400 text-[11px]">/portion</span>
                  </div>
                  <button className="w-full py-2.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[13px] font-bold transition-colors shadow-lg shadow-orange-600/20 flex items-center justify-center gap-1.5 mt-auto cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    Add to cart
                  </button>
                </div>

                {/* Item 3 */}
                <div className="bg-[#1E1E20] rounded-[16px] overflow-hidden flex flex-col p-2.5 pb-4 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-full aspect-[4/3] rounded-[12px] bg-[#1a1a1c] relative overflow-hidden mb-3">
                    <Image src="/customer/most-popular-1.png" alt="Ribeye Steak" fill className="object-cover" />
                    {/* Rating Pill */}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#F9671A" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      4.5
                    </div>
                    {/* Heart Pill */}
                    <button className="absolute top-2 right-2 w-7 h-7 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-colors cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </button>
                  </div>
                  <h4 className="text-[14px] font-bold text-white mb-1.5 px-1 truncate">Ribeye Steak</h4>
                  <div className="flex items-center gap-1.5 px-1 mb-4">
                    <span className="text-[#F9671A] text-[13px] font-extrabold">£39.99</span>
                    <span className="text-zinc-500 text-[11px] line-through">£52.99</span>
                    <span className="text-zinc-400 text-[11px]">/portion</span>
                  </div>
                  <button className="w-full py-2.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[13px] font-bold transition-colors shadow-lg shadow-orange-600/20 flex items-center justify-center gap-1.5 mt-auto cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="mt-8 mb-16">
            <h3 className="text-[17px] font-bold text-white mb-1">Account Management</h3>
            <p className="text-[13px] text-zinc-400 mb-5">You can delete your account and personal data associated with it</p>
            <button className="border-[1.5px] border-[#eb4852] text-[#eb4852] hover:bg-[#eb4852]/10 text-[14px] font-bold px-7 py-2.5 rounded-full transition-colors cursor-pointer">
              Delete My Account
            </button>
          </div>
            </>
          )}
        </main>
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
                        router.push("/menu");
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
