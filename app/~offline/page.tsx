"use client";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-[#18181A] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F9671A]/10">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F9671A"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 1l22 22" />
            <path d="M16.72 11.06A10.94 10.94 0 0 0 12 10c-1.57 0-3.06.33-4.41.93" />
            <path d="M5 16.55A10.94 10.94 0 0 1 12 14c1.83 0 3.55.45 5 1.24" />
            <path d="M8.53 20.11A6 6 0 0 1 12 19c1.3 0 2.5.41 3.47 1.11" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          You&apos;re Offline
        </h1>

        <p className="text-zinc-400 leading-relaxed mb-8">
          It looks like you&apos;re not connected to the internet.
          Please check your connection and try again.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-[#F9671A] px-6 py-3 font-semibold text-white transition hover:bg-[#e85c12]"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}