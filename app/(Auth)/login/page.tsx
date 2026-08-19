"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLoginMutation } from "@/redux/features/api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/features/slice/authSlice";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [loginApi, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.login || !formData.password) {
      toast.error("Please enter both email and password.");
      return;
    }
    try {
      const res = await loginApi(formData).unwrap();
      const user = res?.data?.user || res?.user || res?.data;
      const token = res?.data?.token || res?.token || res?.access_token || res?.data?.access_token;
      
      if (token) {
        dispatch(setCredentials({ user, token }));
      }
      toast.success(res?.message || "Logged in successfully!");
      router.push("/home");
    } catch (err: any) {
      toast.error(err?.data?.message || "Login failed. Please try again.");
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

      {/* Back to Home — top-left floating pill */}
      <div className="absolute top-5 left-5 z-50">
        <Link
          href="/"
          className="group flex items-center gap-2 bg-white/5 hover:bg-[#F9671A]/15 border border-white/10 hover:border-[#F9671A]/40 text-zinc-400 hover:text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Left Section: Visuals (50%) — hidden on mobile */}
      <div className="hidden md:flex flex-none md:flex-1 relative items-center justify-center p-4 md:p-8 z-10 h-[220px] md:h-auto">
        {/* Main Product Image */}
        <div className="relative w-full max-w-[260px] md:max-w-[380px] lg:max-w-[500px] h-full z-10 transform scale-100 md:scale-110 lg:scale-150 md:translate-y-[20px] lg:translate-y-[40px] md:translate-x-[-15px] lg:translate-x-[-40px]">
          <Image
            src="/customer/login-image.png"
            alt="Delicious Wrap"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Right Section: Login Form (50%) */}
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

          <h2 className="text-3xl font-bold text-white text-center mb-12">Login to Account</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-medium text-white leading-[24px] mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                placeholder="enter your email"
                className="w-full bg-[#303031] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-white leading-[24px] mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="enter your password"
                  className="w-full bg-[#303031] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all duration-300 pr-12"
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

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 text-white text-base font-medium leading-[24px] cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-zinc-800 text-[#FFA175] accent-[#FFA175] checked:bg-[#FFA175] checked:hover:bg-[#FFA175] checked:focus:bg-[#FFA175] focus:ring-0 focus:ring-offset-0" />
                <span className="group-hover:text-zinc-200 transition-colors duration-300">Remember Password</span>
              </label>
              <Link href="/forgot-password" className="text-right text-white text-base font-normal leading-normal hover:text-[#F9671A] transition-colors duration-300">
                Forget Password?
              </Link>
            </div>

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
                  Signing In...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-white text-base font-normal leading-normal mt-8">
            Don't have an account?{" "}
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
