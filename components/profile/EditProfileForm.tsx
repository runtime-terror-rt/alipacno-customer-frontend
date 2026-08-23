import React from "react";
import Image from "next/image";

interface EditProfileFormProps {
  profilePhoto: string;
  handleProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUpdating: boolean;
  handleSaveProfile: () => void;
  setIsEditing: (isEditing: boolean) => void;
}

export default function EditProfileForm({
  profilePhoto,
  handleProfileChange,
  formData,
  handleInputChange,
  isUpdating,
  handleSaveProfile,
  setIsEditing,
}: EditProfileFormProps) {
  return (
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
          <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13.5px] font-medium text-white">Gender</label>
            <input name="gender" value={formData.gender || ""} onChange={handleInputChange} placeholder="e.g. female / male" className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13.5px] font-medium text-white">Phone Number</label>
            <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13.5px] font-medium text-white">Email</label>
          <input name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13.5px] font-medium text-white">Country</label>
          <input name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13.5px] font-medium text-white">Post code</label>
            <input name="postcode" value={formData.postcode || formData.post_code || ""} onChange={handleInputChange} className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13.5px] font-medium text-white">City</label>
            <input name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13.5px] font-medium text-white">Address line 1</label>
          <input name="address_line_1" value={formData.address_line_1} onChange={handleInputChange} className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13.5px] font-medium text-white">Address line 2</label>
          <input name="address_line_2" value={formData.address_line_2} onChange={handleInputChange} className="w-full bg-[#252527] rounded-[10px] px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#F9671A]/50 transition-all shadow-inner" />
        </div>

        {/* <h3 className="text-[17px] font-bold text-white mb-1 mt-6">Payment Information</h3>

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
        </div> */}

        <div className="flex gap-4 mb-20 max-w-[400px]">
          <button onClick={() => setIsEditing(false)} className="border border-[#F9671A]/50 text-[#F9671A] hover:bg-[#F9671A]/10 text-[14px] font-bold px-8 py-3.5 rounded-full transition-colors flex-1 cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSaveProfile} disabled={isUpdating} className="bg-[#F9671A] hover:bg-[#ff7a33] text-white text-[14px] font-bold px-8 py-3.5 rounded-full transition-colors shadow-lg shadow-orange-600/20 flex-1 cursor-pointer">
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
