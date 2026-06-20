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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
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
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                    </svg>
                    {/* Desktop Icon (Edit/Pen) */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hidden lg:block">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
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
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      <span className="text-[14px]">Gender: Male</span>
                    </div>
                    <div className="flex items-center gap-4 text-zinc-400 pb-5 border-b border-white/5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                      <span className="text-[14px]">Phone:+1 0123456789</span>
                    </div>
                    <div className="flex items-center gap-4 text-zinc-400 pb-5 border-b border-white/5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                      <span className="text-[14px]">Email:exmple@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-4 text-zinc-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9671A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4" /><path d="M7 20V4" /><path d="m21 8-4-4-4 4" /><path d="M17 4v16" /></svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {/* Item 1 */}
                    <div className="bg-[#1E1E20] rounded-[16px] overflow-hidden flex flex-col p-2.5 pb-4 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="w-full aspect-[4/3] rounded-[12px] bg-[#1a1a1c] relative overflow-hidden mb-3">
                        <Image src="/customer/most-popular-2.png" alt="Vegetable Stir Fry" fill className="object-cover" />
                        {/* Rating Pill */}
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#F9671A" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                          4.5
                        </div>
                        {/* Heart Pill */}
                        <button className="absolute top-2 right-2 w-7 h-7 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-colors cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                        </button>
                      </div>
                      <h4 className="text-[14px] font-bold text-white mb-1.5 px-1 truncate">Vegetable Stir Fry</h4>
                      <div className="flex items-center gap-1.5 px-1 mb-4">
                        <span className="text-[#F9671A] text-[13px] font-extrabold">£39.99</span>
                        <span className="text-zinc-500 text-[11px] line-through">£52.99</span>
                        <span className="text-zinc-400 text-[11px]">/portion</span>
                      </div>
                      <button className="w-full py-2.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[13px] font-bold transition-colors shadow-lg shadow-orange-600/20 flex items-center justify-center gap-1.5 mt-auto cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                        Add to cart
                      </button>
                    </div>

                    {/* Item 2 */}
                    <div className="bg-[#1E1E20] rounded-[16px] overflow-hidden flex flex-col p-2.5 pb-4 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="w-full aspect-[4/3] rounded-[12px] bg-[#1a1a1c] relative overflow-hidden mb-3">
                        <Image src="/customer/most-popular-3.png" alt="Pork Belly Bao" fill className="object-cover" />
                        {/* Rating Pill */}
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#F9671A" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                          4.5
                        </div>
                        {/* Heart Pill */}
                        <button className="absolute top-2 right-2 w-7 h-7 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-colors cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                        </button>
                      </div>
                      <h4 className="text-[14px] font-bold text-white mb-1.5 px-1 truncate">Pork Belly Bao</h4>
                      <div className="flex items-center gap-1.5 px-1 mb-4">
                        <span className="text-[#F9671A] text-[13px] font-extrabold">£39.99</span>
                        <span className="text-zinc-500 text-[11px] line-through">£52.99</span>
                        <span className="text-zinc-400 text-[11px]">/portion</span>
                      </div>
                      <button className="w-full py-2.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[13px] font-bold transition-colors shadow-lg shadow-orange-600/20 flex items-center justify-center gap-1.5 mt-auto cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                        Add to cart
                      </button>
                    </div>

                    {/* Item 3 */}
                    <div className="bg-[#1E1E20] rounded-[16px] overflow-hidden flex flex-col p-2.5 pb-4 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="w-full aspect-[4/3] rounded-[12px] bg-[#1a1a1c] relative overflow-hidden mb-3">
                        <Image src="/customer/most-popular-1.png" alt="Ribeye Steak" fill className="object-cover" />
                        {/* Rating Pill */}
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#F9671A" stroke="#F9671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                          4.5
                        </div>
                        {/* Heart Pill */}
                        <button className="absolute top-2 right-2 w-7 h-7 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-colors cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                        </button>
                      </div>
                      <h4 className="text-[14px] font-bold text-white mb-1.5 px-1 truncate">Ribeye Steak</h4>
                      <div className="flex items-center gap-1.5 px-1 mb-4">
                        <span className="text-[#F9671A] text-[13px] font-extrabold">£39.99</span>
                        <span className="text-zinc-500 text-[11px] line-through">£52.99</span>
                        <span className="text-zinc-400 text-[11px]">/portion</span>
                      </div>
                      <button className="w-full py-2.5 bg-[#F9671A] hover:bg-[#ff7a33] text-white rounded-full text-[13px] font-bold transition-colors shadow-lg shadow-orange-600/20 flex items-center justify-center gap-1.5 mt-auto cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
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



// dsafklhasdklhjksdfgsdafdsafsd
