import React from "react";
import Image from "next/image";

interface ProfileBannerProps {
  user: any;
  coverPhoto: string;
  profilePhoto: string;
  handleCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsEditing: (isEditing: boolean) => void;
  router: any;
}

export default function ProfileBanner({
  user,
  coverPhoto,
  profilePhoto,
  handleCoverChange,
  handleProfileChange,
  setIsEditing,
  router,
}: ProfileBannerProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 lg:mb-8 mt-2">
        <button onClick={() => router.push("/home")} className="lg:hidden text-white hover:text-zinc-300 transition-colors cursor-pointer flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            {/* Desktop Icon (Edit/Pen) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hidden lg:block">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
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
        <div className="lg:pl-[240px] lg:-mt-5 flex-1 min-w-0 pr-4">
          <h2 className="text-[20px] lg:text-[28px] font-bold text-[#F9671A] leading-tight truncate">{user?.name || "Loading..."}</h2>
          <p className="text-[13px] lg:text-[15px] text-zinc-400 italic">Food Lover</p>
        </div>
        <button onClick={() => setIsEditing(true)} className="border border-[#F9671A]/30 text-[#F9671A] hover:bg-[#F9671A]/10 text-[12px] lg:text-[13px] font-bold px-4 py-2 lg:px-6 lg:py-2.5 rounded-full flex items-center gap-1.5 transition-colors flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
          </svg>
          Edit Profile
        </button>
      </div>
    </>
  );
}
