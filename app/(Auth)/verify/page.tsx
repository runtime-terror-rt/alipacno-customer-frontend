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

       {/* Left Section: Visuals (50%) — hidden on mobile */}
           {/* <div className="hidden md:flex flex-none md:flex-1 relative items-center justify-center p-4 md:p-8 z-10 h-[220px] md:h-auto">
             <div className="relative w-full max-w-[260px] md:max-w-[380px] lg:max-w-[500px] h-full z-10 transform scale-100 md:scale-110 lg:scale-150 md:translate-y-[20px] lg:translate-y-[40px] md:translate-x-[-15px] lg:translate-x-[-40px]">
               <Image
                 src="/customer/signup-page.png"
                 alt="Delicious Loaded Fries"
                 fill
                 className="object-contain drop-shadow-2xl"
                 priority
               />
             </div>
           </div> */}

           {/* Left Section: Visuals (50%) — hidden on mobile */}
                      <div className="hidden md:flex flex-none md:flex-1 relative items-center justify-center p-4 md:p-8 z-10 h-[220px] md:h-auto">
                        <div className="relative w-full max-w-[260px] md:max-w-[380px] lg:max-w-[520px] h-full z-10 transform scale-100 md:scale-110 lg:scale-150 md:translate-x-[-20px] lg:translate-x-[-60px]">
                          <Image
                            src="/customer/signup-page.png"
                            alt="Delicious Loaded Fries"
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
          <p className="text-center text-white text-sm mb-8 leading-relaxed">
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
            onClick={() => router.push('/home')}
            className="w-full bg-[#F9671A] hover:bg-[#e85a15] text-white font-bold py-4 rounded-full shadow-lg shadow-orange-600/20 transform transition-all active:scale-[0.98] cursor-pointer duration-300 mb-6"
          >
           Verify
          </button>

          {/* Resend Timer */}
          <div className="text-center mb-2">
            <p className="text-zinc-500 text-xs flex items-center justify-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M7.75833 8.575L8.575 7.75833L6.41667 5.6V2.91667H5.25V6.06667L7.75833 8.575ZM5.83333 11.6667C5.02639 11.6667 4.26806 11.5135 3.55833 11.2073C2.84861 10.901 2.23125 10.4854 1.70625 9.96042C1.18125 9.43542 0.765625 8.81806 0.459375 8.10833C0.153125 7.39861 0 6.64028 0 5.83333C0 5.02639 0.153125 4.26806 0.459375 3.55833C0.765625 2.84861 1.18125 2.23125 1.70625 1.70625C2.23125 1.18125 2.84861 0.765625 3.55833 0.459375C4.26806 0.153125 5.02639 0 5.83333 0C6.64028 0 7.39861 0.153125 8.10833 0.459375C8.81806 0.765625 9.43542 1.18125 9.96042 1.70625C10.4854 2.23125 10.901 2.84861 11.2073 3.55833C11.5135 4.26806 11.6667 5.02639 11.6667 5.83333C11.6667 6.64028 11.5135 7.39861 11.2073 8.10833C10.901 8.81806 10.4854 9.43542 9.96042 9.96042C9.43542 10.4854 8.81806 10.901 8.10833 11.2073C7.39861 11.5135 6.64028 11.6667 5.83333 11.6667ZM5.83333 10.5C7.12639 10.5 8.22743 10.0455 9.13646 9.13646C10.0455 8.22743 10.5 7.12639 10.5 5.83333C10.5 4.54028 10.0455 3.43924 9.13646 2.53021C8.22743 1.62118 7.12639 1.16667 5.83333 1.16667C4.54028 1.16667 3.43924 1.62118 2.53021 2.53021C1.62118 3.43924 1.16667 4.54028 1.16667 5.83333C1.16667 7.12639 1.62118 8.22743 2.53021 9.13646C3.43924 10.0455 4.54028 10.5 5.83333 10.5Z" fill="#626262"/>
</svg>
              Resend code in <span className="text-[#F9671A] font-semibold">{formatTime(timer)}</span>
            </p>
          </div>

          {/* Resend Code Link */}
          <div className="text-center mb-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0}
              className={`text-sm font-semibold transition-colors duration-300 cursor-pointer ${
                timer > 0
                  ? "text-[#F9671A] cursor-not-allowed"
                  : "text-[#F9671A] hover:underline"
              }`}
            >
              Resend Code
            </button>
          </div>
      <div className="border-t border-white/10 my-4 w-[calc(100%-8rem)] mx-auto"></div>
          {/* End-to-End Encrypted */}
          <div className="flex items-center justify-center gap-2 text-white mb-18 ">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14" fill="none">
  <path d="M4.63333 9.03333L8.4 5.26667L7.45 4.31667L4.63333 7.13333L3.23333 5.73333L2.28333 6.68333L4.63333 9.03333ZM5.33333 13.3333C3.78889 12.9444 2.51389 12.0583 1.50833 10.675C0.502778 9.29167 0 7.75556 0 6.06667V2L5.33333 0L10.6667 2V6.06667C10.6667 7.75556 10.1639 9.29167 9.15833 10.675C8.15278 12.0583 6.87778 12.9444 5.33333 13.3333ZM5.33333 11.9333C6.48889 11.5667 7.44444 10.8333 8.2 9.73333C8.95555 8.63333 9.33333 7.41111 9.33333 6.06667V2.91667L5.33333 1.41667L1.33333 2.91667V6.06667C1.33333 7.41111 1.71111 8.63333 2.46667 9.73333C3.22222 10.8333 4.17778 11.5667 5.33333 11.9333Z" fill="white"/>
</svg>
            <span className="text-[10px] font-semibold tracking-widest uppercase">END-TO-END ENCRYPTED VERIFICATION</span>
          </div>
        </div>
      </div>
    </div>
  );
}
