"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
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
        {/* Main Product Image */}
        <div className="relative w-full max-w-[260px] md:max-w-[380px] lg:max-w-[500px] h-full z-10 transform scale-100 md:scale-110 lg:scale-150 md:translate-y-[-10px] lg:translate-y-[0px] md:translate-x-[-15px] lg:translate-x-[-40px]">
          <Image
            src="/customer/burger-2.png"
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

          <form onSubmit={(e) => { e.preventDefault(); router.push('/home'); }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="enter your email"
                className="w-full bg-[#303031] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="enter your password"
                className="w-full bg-[#303031] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all duration-300"
              />
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 text-zinc-400 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-zinc-800 text-[#FFA175] accent-[#FFA175] checked:bg-[#FFA175] checked:hover:bg-[#FFA175] checked:focus:bg-[#FFA175] focus:ring-0 focus:ring-offset-0" />
                <span className="text-white transition-colors duration-300">Remember Password</span>
              </label>
              <Link href="/forgot-password" className="text-white hover:text-[#F9671A] transition-colors duration-300">
                Forget Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F9671A] hover:bg-[#e85a15] text-white font-bold py-4 rounded-full shadow-lg shadow-orange-600/20 transform transition-all active:scale-[0.98] cursor-pointer duration-300"
            >
              Sign in
            </button>
          </form>

          <p className="text-center text-white mt-8">
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
