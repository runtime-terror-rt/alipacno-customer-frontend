import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
  return (
    <div
      className="min-h-screen w-full bg-[#1E1E20] bg-cover bg-no-repeat bg-center md:[background-position:75%_105px] flex flex-col md:flex-row relative overflow-hidden"
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

      {/* Left Section: Visuals (50%) — identical to login page */}
      <div className="flex-none md:flex-1 relative flex items-center justify-center p-4 md:p-8 z-10 h-[220px] md:h-auto">
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

          <form className="space-y-3">

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5" htmlFor="fullName">
                Full name
              </label>
              <input
                type="text"
                id="fullName"
                placeholder="enter your full name"
                className="w-full bg-[#303031] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="enter your email"
                className="w-full bg-[#303031] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5" htmlFor="phone">
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="enter your phone number"
                className="w-full bg-[#303031] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="enter password"
                className="w-full bg-[#303031] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="enter confirm password"
                className="w-full bg-[#303031] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all duration-300"
                required
              />
            </div>

            {/* Opt-ins — styled same as login's remember/forgot row */}
            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-2 text-zinc-400 cursor-pointer group text-xs sm:text-sm">
                <input
                  type="checkbox"
                  id="termsPermission"
                  required
                  className="mt-0.5 w-4 h-4 rounded border-white/10 bg-zinc-800 text-[#FFA175] accent-[#FFA175] checked:bg-[#FFA175] focus:ring-0 focus:ring-offset-0 transition-all"
                />
                <span className="group-hover:text-zinc-200 transition-colors duration-300 leading-snug">
                  I agree to the{" "}
                  <a href="#" className="text-[#F9671A] hover:underline font-semibold transition-colors">
                    Terms of Service
                  </a>{" "}
                  and grant permission to process my account data.
                </span>
              </label>
            </div>

            {/* Button — identical to login */}
            <button
              type="submit"
              className="w-full bg-[#F9671A] hover:bg-[#e85a15] text-white font-bold py-4 rounded-full shadow-lg shadow-orange-600/20 transform transition-all active:scale-[0.98] cursor-pointer duration-300"
            >
              Sign Up
            </button>
          </form>

          {/* Footer link — identical to login */}
          <p className="text-center text-zinc-400 mt-6">
            Already have an account?{" "}
            <Link href="/" className="text-[#F9671A] font-semibold hover:underline cursor-pointer transition-colors duration-300">
              Sign In
            </Link>{" "}
            Here
          </p>
        </div>
      </div>
    </div>
  );
}
