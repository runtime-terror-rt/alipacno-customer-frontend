import Image from "next/image";

export default function Home() {
  return (
    <div
      className="min-h-screen w-full bg-[#1E1E20] bg-cover bg-no-repeat flex flex-col md:flex-row relative overflow-hidden"
      style={{
        backgroundImage: "url('/customer/bg-image.png')",
        backgroundPosition: "center 105px"
      }}
    >
      {/* Gradient Glow - Absolute Page Corner */}
      <div className="absolute -bottom-48 -left-48 w-[800px] h-[800px] z-0 opacity-100 mix-blend-screen pointer-events-none">
        <Image
          src="/customer/gradient.png"
          alt="Glow"
          fill
          className="object-contain object-left-bottom"
        />
      </div>

      {/* Left Section: Visuals (50%) */}
      <div className="flex-1 relative flex items-center justify-center p-4 md:p-8 z-10 h-[400px] md:h-auto">


        {/* Design Lines */}
        <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
          <Image
            src="/customer/design.png"
            alt="Design Lines"
            fill
            className="object-contain"
          />
        </div>

        {/* Main Product Image */}
        <div className="relative w-full max-w-[600px] h-full z-10 transform scale-90 md:scale-100">
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
        <div className="w-full max-w-[500px] bg-[#1E1E20] border border-white/10 rounded-2xl p-6 md:p-12 shadow-2xl">
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

          <h2 className="text-3xl font-bold text-white text-center mb-10">Login to Account</h2>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="enter your email"
                className="w-full bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="enter your password"
                className="w-full bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#F9671A]/50 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zinc-400 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-zinc-800 text-[#F9671A] focus:ring-0 focus:ring-offset-0" />
                <span className="group-hover:text-zinc-200 transition-colors">Remember Password</span>
              </label>
              <a href="#" className="text-zinc-400 hover:text-[#F9671A] transition-colors">
                Forget Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F9671A] hover:bg-[#e85a15] text-white font-bold py-4 rounded-full shadow-lg shadow-orange-600/20 transform transition-all active:scale-[0.98]"
            >
              Sign in
            </button>
          </form>

          <p className="text-center text-zinc-400 mt-8">
            Already have an account?{" "}
            <a href="#" className="text-[#F9671A] font-semibold hover:underline">
              Sign Up
            </a>{" "}
            Here
          </p>
        </div>
      </div>
    </div>
  );
}
