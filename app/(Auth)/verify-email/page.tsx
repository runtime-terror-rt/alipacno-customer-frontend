"use client";

import Image from "next/image";
import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/redux/features/api/authApi";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/features/slice/authSlice";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const email = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifyOtpApi, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 4) {
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

      {/* Left Section: Chicken Visual — taller, positioned higher */}
      <div className="flex-none md:flex-1 relative flex items-center justify-center p-4 md:p-8 z-10 h-[260px] md:h-auto">
        <div className="relative w-full max-w-[280px] md:max-w-[400px] lg:max-w-[520px] h-full z-10 transform scale-100 md:scale-110 lg:scale-[1.4] md:translate-y-[-30px] lg:translate-y-[-20px] md:translate-x-[-15px] lg:translate-x-[-40px]">
          <Image
            src="/customer/chicken.png"
            alt="Delicious Chicken Wings"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Right Section: Email Verification Form */}
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
          <h2 className="text-3xl font-bold text-white text-center mb-4">Check your email</h2>

          {/* Subtitle */}
          <p className="text-center text-white text-base font-normal leading-[25.6px] mb-8">
            We sent a code to your email address {email || "@"}. Please check<br />your email for the 5 digit code.
          </p>

          {/* OTP Input Boxes — 5 digits */}
          <div className="flex justify-center gap-3 mb-8">
            {otp.map((digit, index) => {
              const placeholders = ["2", "8", "4", "", ""];
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
                  className="w-12 h-14 bg-transparent border border-white/15 rounded-lg text-center text-white text-xl font-bold focus:outline-none focus:border-[#F9671A] focus:ring-1 focus:ring-[#F9671A]/50 transition-all duration-300 placeholder:text-zinc-700"
                  aria-label={`OTP digit ${index + 1}`}
                />
              );
            })}
          </div>

          {/* Verify Button */}
          <button
            type="button"
            onClick={async () => {
              const otpCode = otp.join("");
              if (otpCode.length < 5) {
                toast.error("Please enter a 5-digit code");
                return;
              }
              if (!email) {
                toast.error("Email address not found in URL");
                return;
              }
              
              try {
                const res = await verifyOtpApi({ email, otp: otpCode }).unwrap();
                const user = res?.data?.user || res?.user || res?.data;
                const token = res?.data?.token || res?.token || res?.access_token || res?.data?.access_token;
                
                if (token) {
                  dispatch(setCredentials({ user, token }));
                }
                
                toast.success(res?.message || "OTP Verified Successfully!");
                router.push('/home');
              } catch (err: any) {
                toast.error(err?.data?.message || "OTP verification failed. Please try again.");
              }
            }}
            disabled={isLoading}
            className="w-full bg-[#F9671A] hover:bg-[#e85a15] text-white font-bold py-4 rounded-full shadow-lg shadow-orange-600/20 transform transition-all active:scale-[0.98] cursor-pointer duration-300 mb-8 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </button>

          {/* Resend */}
          <p className="text-center text-white text-base font-normal leading-normal">
            You have not received the email?{" "}
            <button
              type="button"
              onClick={async () => {
                if (!email) {
                  toast.error("Email address not found.");
                  return;
                }
                try {
                  const res = await resendOtp({ email, type: "registration" }).unwrap();
                  toast.success(res?.message || "OTP resent successfully!");
                } catch (err: any) {
                  toast.error(err?.data?.message || "Failed to resend OTP.");
                }
              }}
              disabled={isResending}
              className="text-[#F9671A] text-sm font-medium leading-[16.8px] tracking-[0.14px] text-center hover:underline cursor-pointer transition-colors duration-300"
            >
              Resend
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1E1E20] flex items-center justify-center text-white">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
