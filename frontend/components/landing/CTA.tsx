"use client";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

const CTA = () => {
  return (
    <div className="p-6 overflow-hidden rounded-xl">
      <BackgroundBeamsWithCollision
        className="rounded-2xl bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 min-h-[480px]"
      >
        <div className="relative z-20 flex flex-col items-center text-center px-6 py-16 max-w-3xl mx-auto">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Start Today
          </span>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            Stop Losing Deals to{" "}
            <span className="bg-gradient-to-r from-rose-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              Slow Proposals
            </span>
          </h2>

          {/* Sub-copy */}
          <p className="text-lg text-gray-400 max-w-xl leading-relaxed mb-10">
            Turn client conversations into polished, multi-version proposals in
            minutes — not days. Let AI handle the heavy lifting while you focus
            on closing.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-400 hover:to-violet-500 shadow-lg shadow-violet-900/30 transition-all duration-200 hover:scale-105 active:scale-100">
              Get Started Free
            </button>
            <button className="px-7 py-3.5 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500 hover:text-white bg-white/5 hover:bg-white/10 transition-all duration-200">
              Book a Demo →
            </button>
          </div>

          {/* Trust note */}
          <p className="mt-8 text-xs text-gray-600">
            No credit card required &nbsp;·&nbsp; Setup in under 5 minutes &nbsp;·&nbsp; Cancel anytime
          </p>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
};

export default CTA;
