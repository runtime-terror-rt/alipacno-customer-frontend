"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPhone() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(54);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pastedData) return;

    const newOtp = [...otp];
    const lengthToFill = Math.min(pastedData.length, otp.length);

    for (let i = 0; i < lengthToFill; i++) {
      newOtp[i] = pastedData[i];
    }

    setOtp(newOtp);

    const nextActiveIndex = lengthToFill === otp.length ? otp.length - 1 : lengthToFill;
    inputRefs.current[nextActiveIndex]?.focus();
  };

  const handleResend = () => {
    setTimer(54);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60).toString().padStart(2, "0");
    const secs = (s % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div
      className="min-h-[100dvh] w-full bg-[#1E1E20] bg-cover bg-no-repeat bg-center md:[background-position:75%_105px] flex flex-col md:flex-row relative overflow-hidden"
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

      {/* Left Section: Burger Visual — hidden on mobile */}
      <div className="hidden md:flex flex-none md:flex-1 relative items-center justify-center p-4 md:p-8 z-10 h-[220px] md:h-auto">
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

      {/* Right Section: OTP Verification Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 z-10">
        <div className="w-full max-w-[400px] md:max-w-[440px] lg:max-w-[550px] bg-[#1E1E20] border border-white/10 rounded-2xl p-6 md:p-8 lg:p-12 shadow-2xl my-4 md:my-0">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Pacino's Logo"
              width={180}
              height={120}
              className="object-contain"
            />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white text-center mb-4">Verify Phone Number</h2>

          {/* Subtitle */}
          <p className="text-center text-white text-base font-normal leading-6 mb-8">
            A 6-digit code has been sent to +1 (xxx) xxx-<br />xxxx
          </p>

          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-8">
            {otp.map((digit, index) => {
              const placeholders = ["2", "8", "4", "", "", ""];
              return (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  placeholder={placeholders[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-9 h-12 sm:w-12 sm:h-14 bg-transparent border border-white/15 rounded-lg text-center text-white text-lg sm:text-xl font-bold focus:outline-none focus:border-[#F9671A] focus:ring-1 focus:ring-[#F9671A]/50 transition-all duration-300 placeholder:text-zinc-700"
                  aria-label={`OTP digit ${index + 1}`}
                />
              );
            })}
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={() => router.push('/menu')}
            className="w-full bg-[#F9671A] hover:bg-[#e85a15] text-white font-bold py-4 rounded-full shadow-lg shadow-orange-600/20 transform transition-all active:scale-[0.98] cursor-pointer duration-300 mb-6"
          >
           verify
          </button>

          {/* Resend Timer */}
          <div className="text-center mb-2">
            <p className="text-zinc-500 text-xs flex items-center justify-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
              </svg>
              Resend code in <span className="text-[#F9671A] font-semibold">{formatTime(timer)}</span>
            </p>
          </div>

          {/* Resend Code Link */}
          <div className="text-center mb-8">
            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0}
              className={`text-center text-sm font-medium leading-[16.8px] tracking-[0.14px] transition-colors duration-300 cursor-pointer ${
                timer > 0
                  ? "text-zinc-600 cursor-not-allowed"
                  : "text-[#F9671A] hover:underline"
              }`}
            >
              Resend Code
            </button>
          </div>

          {/* End-to-End Encrypted */}
          <div className="flex items-center justify-center gap-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] font-bold leading-[15px] tracking-[1px] uppercase">END-TO-END ENCRYPTED VERIFICATION</span>
          </div>
        </div>
      </div>
    </div>
  );
}


// dksjhhkshdksdsfsdfsdf