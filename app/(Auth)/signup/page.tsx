"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRegisterMutation } from "@/redux/features/api/authApi";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const router = useRouter();
  const [registerApi, { isLoading }] = useRegisterMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    if (!optIn) {
      toast.error("You must agree to opt in to marketing permissions.");
      return;
    }

    try {
      const payload = {
        ...formData,
        user_type: "customer",
        role_id: 8,
        avatar: "",
        user_image: "",
      };

      const res = await registerApi(payload).unwrap();
      toast.success(res?.message || "Registration successful!");
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };
  return (
    <div
      className="min-h-[100dvh] w-full bg-[#1E1E20] bg-cover bg-no-repeat bg-center md:[background-position:75%_105px] flex flex-col md:flex-row relative overflow-hidden"
      style={{
        backgroundImage: "url('/customer/bg-image.png')"
      }}
    >
      {/* Gradient Glow - Absolute Page Corner */}
      <div className="absolute -bottom-48 -left-72 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] z-0 opacity-100 mix-blend-screen pointer-events-none">
        <Image
          src="/customer/gradient.png"
          alt="Glow"
          fill
          className="object-contain object-left-bottom brightness-110 contrast-125 saturate-150 hue-rotate-[-10deg] drop-shadow-[0_0_30px_rgba(255,80,0,0.6)]"
        />
      </div>

      {/* Design Lines - Full Page Width */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-100 pointer-events-none translate-x-[-5px]">
        <Image
          src="/customer/design.png"
          alt="Design Lines"
          fill
          className="object-contain object-left brightness-110 contrast-125 saturate-150 hue-rotate-[-10deg] drop-shadow-[0_0_15px_rgba(255,80,0,0.5)]"
        />
      </div>

      {/* Left Section: Visuals (50%) — hidden on mobile */}
      <div className="hidden md:flex flex-none md:flex-1 relative items-center justify-center p-4 md:p-8 z-10 h-[220px] md:h-auto">
        <div className="relative w-full max-w-[260px] md:max-w-[380px] lg:max-w-[500px] h-full z-10 transform scale-100 md:scale-110 lg:scale-150 md:translate-y-[20px] lg:translate-y-[40px] md:translate-x-[-15px] lg:translate-x-[-40px]">
          <Image
            src="/customer/signup-page.png"
            alt="Delicious Loaded Fries"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Right Section: Signup Form (50%) — matches login layout */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 z-10">
        <div className="w-full max-w-[400px] md:max-w-[440px] lg:max-w-[550px] bg-[#1E1E20] border border-white/10 rounded-2xl p-6 md:p-7 lg:p-10 shadow-2xl my-4 md:my-0">

          {/* Logo — slightly smaller than login to save height */}
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="Pacino's Logo"
              width={150}
              height={100}
              className="object-contain"
            />
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-5">Create to Account</h2>

          <form onSubmit={handleRegister} className="space-y-3">

            <div>
              <label className="block text-base font-medium text-white leading-[24px] mb-1.5" htmlFor="fullName">
                Full name
              </label>
              <input
                type="text"
                id="fullName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="enter your full name"
                className="w-full bg-[#303031] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-white leading-[24px] mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="enter your email"
                className="w-full bg-[#303031] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-white leading-[24px] mb-1.5" htmlFor="phone">
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="enter your phone number"
                className="w-full bg-[#303031] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-white leading-[24px] mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="enter password"
                  className="w-full bg-[#303031] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all duration-300 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors duration-200 flex items-center justify-center cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-white leading-[24px] mb-1.5" htmlFor="confirmPassword">
                Confirm password
              </label>
              <div className="relative w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="enter confirm password"
                  className="w-full bg-[#303031] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all duration-300 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors duration-200 flex items-center justify-center cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Opt-ins — styled same as login's remember/forgot row */}
            <div className="space-y-2 pt-1 flex justify-start">
              <label className="flex items-center justify-start gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  id="termsPermission"
                  checked={optIn}
                  onChange={(e) => setOptIn(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-zinc-800 text-[#FFA175] accent-[#FFA175] checked:bg-[#FFA175] focus:ring-0 focus:ring-offset-0 transition-all shrink-0"
                />
                <span className="text-[#FFF7F3]/50 text-left text-base font-normal leading-normal transition-colors duration-300 group-hover:text-white/80">
                 I agree to opt in to marketing permissions.
                </span>
              </label>
            </div>

            {/* Button — identical to login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F9671A] hover:bg-[#e85a15] text-white font-bold py-4 rounded-full shadow-lg shadow-orange-600/20 transform transition-all active:scale-[0.98] cursor-pointer duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing Up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Footer link — identical to login */}
          <p className="text-center text-white text-base font-normal leading-normal mt-6">
            Already have an account?{" "}
            <Link href="/phone-login" className="text-[#F9671A] font-semibold hover:underline cursor-pointer transition-colors duration-300">
              Sign In
            </Link>{" "}
            Here
          </p>
        </div>
      </div>
    </div>
  );
}
