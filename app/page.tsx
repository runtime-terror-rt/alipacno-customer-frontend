"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const countryCodes = [
  { code: "+44", label: "UK", flag: "🇬🇧" },
  { code: "+1", label: "US", flag: "🇺🇸" },
  { code: "+1", label: "CA", flag: "🇨🇦" },
  { code: "+91", label: "IN", flag: "🇮🇳" },
  { code: "+880", label: "BD", flag: "🇧🇩" },
  { code: "+92", label: "PK", flag: "🇵🇰" },
  { code: "+61", label: "AU", flag: "🇦🇺" },
  { code: "+49", label: "DE", flag: "🇩🇪" },
  { code: "+33", label: "FR", flag: "🇫🇷" },
  { code: "+39", label: "IT", flag: "🇮🇹" },
  { code: "+34", label: "ES", flag: "🇪🇸" },
  { code: "+81", label: "JP", flag: "🇯🇵" },
  { code: "+82", label: "KR", flag: "🇰🇷" },
  { code: "+86", label: "CN", flag: "🇨🇳" },
  { code: "+55", label: "BR", flag: "🇧🇷" },
  { code: "+52", label: "MX", flag: "🇲🇽" },
  { code: "+971", label: "AE", flag: "🇦🇪" },
  { code: "+966", label: "SA", flag: "🇸🇦" },
  { code: "+90", label: "TR", flag: "🇹🇷" },
  { code: "+234", label: "NG", flag: "🇳🇬" },
  { code: "+27", label: "ZA", flag: "🇿🇦" },
  { code: "+254", label: "KE", flag: "🇰🇪" },
  { code: "+62", label: "ID", flag: "🇮🇩" },
  { code: "+60", label: "MY", flag: "🇲🇾" },
  { code: "+65", label: "SG", flag: "🇸🇬" },
  { code: "+63", label: "PH", flag: "🇵🇭" },
  { code: "+66", label: "TH", flag: "🇹🇭" },
  { code: "+84", label: "VN", flag: "🇻🇳" },
  { code: "+7", label: "RU", flag: "🇷🇺" },
  { code: "+48", label: "PL", flag: "🇵🇱" },
  { code: "+31", label: "NL", flag: "🇳🇱" },
  { code: "+46", label: "SE", flag: "🇸🇪" },
  { code: "+47", label: "NO", flag: "🇳🇴" },
  { code: "+353", label: "IE", flag: "🇮🇪" },
  { code: "+41", label: "CH", flag: "🇨🇭" },
  { code: "+43", label: "AT", flag: "🇦🇹" },
  { code: "+32", label: "BE", flag: "🇧🇪" },
  { code: "+351", label: "PT", flag: "🇵🇹" },
  { code: "+30", label: "GR", flag: "🇬🇷" },
  { code: "+20", label: "EG", flag: "🇪🇬" },
  { code: "+212", label: "MA", flag: "🇲🇦" },
  { code: "+64", label: "NZ", flag: "🇳🇿" },
  { code: "+54", label: "AR", flag: "🇦🇷" },
  { code: "+57", label: "CO", flag: "🇨🇴" },
  { code: "+56", label: "CL", flag: "🇨🇱" },
];

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className="min-h-screen w-full bg-[#1E1E20] bg-cover bg-no-repeat bg-center md:[background-position:75%_105px] flex flex-col md:flex-row relative overflow-hidden"
      style={{
        backgroundImage: "url('/customer/bg-image.png')"
      }}
    >
      {/* Gradient Glow */}
      <div className="absolute -bottom-48 -left-72 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] z-0 opacity-100 mix-blend-screen pointer-events-none">
        <Image
          src="/customer/gradient.png"
          alt="Glow"
          fill
          className="object-contain object-left-bottom brightness-110 contrast-125 saturate-150 hue-rotate-[-10deg] drop-shadow-[0_0_30px_rgba(255,80,0,0.6)]"
        />
      </div>

      {/* Design Lines */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-100 pointer-events-none translate-x-[-5px]">
        <Image
          src="/customer/design.png"
          alt="Design Lines"
          fill
          className="object-contain object-left brightness-110 contrast-125 saturate-150 hue-rotate-[-10deg] drop-shadow-[0_0_15px_rgba(255,80,0,0.5)]"
        />
      </div>

      {/* Left Section: Burger Visual — slightly higher */}
      <div className="flex-none md:flex-1 relative flex items-center justify-center p-4 md:p-8 z-10 h-[220px] md:h-auto">
        <div className="relative w-full max-w-[260px] md:max-w-[380px] lg:max-w-[500px] h-full z-10 transform scale-100 md:scale-110 lg:scale-150 md:translate-y-[-10px] lg:translate-y-[0px] md:translate-x-[-15px] lg:translate-x-[-40px]">
          <Image
            src="/customer/burger.png"
            alt="Delicious Burger"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Right Section: Phone Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 z-10">
        <div className="w-full max-w-[400px] md:max-w-[440px] lg:max-w-[550px] bg-[#1E1E20] border border-white/10 rounded-2xl p-6 md:p-8 lg:p-12 shadow-2xl my-4 md:my-0">

          {/* Logo */}
          <div className="flex justify-center mb-10">
            <Image
              src="/logo.png"
              alt="Pacino's Logo"
              width={180}
              height={120}
              className="object-contain"
            />
          </div>

          {/* Subtitle */}
          <p className="text-center text-zinc-400 text-sm mb-9 leading-relaxed">
            Enter your phone number to receive a secure<br />login code.
          </p>

          <form className="space-y-5">
            {/* Phone Number with country code dropdown */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2" htmlFor="phone">
                Phone number
              </label>
              <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 bg-[#303031] border border-white/5 rounded-xl px-3 py-3 text-zinc-300 text-sm font-medium min-w-[90px] justify-center cursor-pointer hover:border-[#F9671A]/50 transition-all duration-300"
                  >
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.code}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 text-zinc-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Dropdown List */}
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-[200px] max-h-[240px] overflow-y-auto bg-[#2a2a2c] border border-white/10 rounded-xl shadow-2xl z-50 scrollbar-thin">
                      {countryCodes.map((country, i) => (
                        <button
                          key={`${country.label}-${i}`}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors duration-150 cursor-pointer ${
                            selectedCountry.label === country.label && selectedCountry.code === country.code
                              ? "bg-[#F9671A]/15 text-[#F9671A]"
                              : "text-zinc-300 hover:bg-white/5"
                          }`}
                        >
                          <span className="text-base">{country.flag}</span>
                          <span className="font-medium">{country.label}</span>
                          <span className="text-zinc-500 ml-auto">{country.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Phone Input */}
                <input
                  type="tel"
                  id="phone"
                  placeholder="enter your phone number"
                  className="flex-1 bg-[#303031] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all duration-300"
                />
              </div>
              <p className="text-zinc-600 text-xs mt-2 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                Message and data rates may apply.
              </p>
            </div>

            {/* OR CONTINUE WITH divider */}
            <div className="flex items-center">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] font-semibold tracking-widest text-white/80 uppercase px-4 py-1.5 rounded-lg" style={{backgroundColor: '#59321E'}}>
                OR CONTINUE WITH
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Email Button → navigates to /login */}
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2.5 bg-transparent border border-white/10 hover:border-[#F9671A]/50 text-zinc-300 hover:text-white font-medium py-3 rounded-xl transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
              Email
            </Link>

            {/* Send Code Button */}
            <button
              type="submit"
              className="w-full bg-[#F9671A] hover:bg-[#e85a15] text-white font-bold py-4 rounded-full shadow-lg shadow-orange-600/20 transform transition-all active:scale-[0.98] cursor-pointer duration-300"
            >
             Login
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-zinc-400 mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#F9671A] font-semibold hover:underline cursor-pointer transition-colors duration-300">
              Sign Up
            </Link>{" "}
            Here
          </p>
        </div>
      </div>
    </div>
  );
}
