"use client";

export default function Loader() {
  return (
    // backdrop-blur makes it feel like it's part of the page, not a separate wall
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6">
        {/* Modern Typography using Tailwind */}
        <p className="text-3xl font-mono font-medium tracking-[0.2em] uppercase text-slate-800">
          Loading
        </p>

        {/* Animated Dots using Tailwind's animate-bounce or custom pulse */}
        <div className="flex gap-3">
          <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce" />
        </div>
      </div>
    </div>
  );
}