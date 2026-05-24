"use client";
import { Meteors } from "@/components/ui/meteors";

const features = [
  {
    step: "01",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-rose-300" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z" />
        <path d="M19.14 19.14 21 21M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
    title: "Intelligent Requirements Extraction",
    description:
      "Agent ingests meeting recordings, transcripts, or text briefs and automatically extracts key requirements — budget, technical specs, constraints, location, and timeline. Zero manual effort.",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    step: "02",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-violet-300" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: "Autonomous Catalog Navigation & Compatibility Engine",
    description:
      "Agent searches through hundreds of SKUs using Agentic RAG + MCP, cross-referencing compatibility matrices in real-time — flagging conflicts before they become proposal blockers.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    step: "03",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-fuchsia-300" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Versioned Automated Proposal & Quote Generation ",
    description:
      "Builds a complete, professional proposal document from matched components — producing Premium, Standard, and Budget versions tailored for every stakeholder profile simultaneously.",
    gradient: "from-fuchsia-500 to-violet-600",
  },
  {
    step: "04",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-rose-300" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Human-in-the-Loop for Sales Consultant",
    description:
      "Sales Consultant receives all 3 proposal versions for review and approval — with full override control at every decision point. AI augments your judgment, it never replaces it.",
    gradient: "from-rose-400 to-violet-500",
  },
];

const Features = () => {
  return (
    <div className="p-6 overflow-hidden rounded-xl">
      <div className="relative w-full">
        {/* Background gradient */}
        <div
          className="absolute inset-0 -z-10 rounded-2xl"
          style={{
            background:
              "linear-gradient(160deg, #f5f3ff 0%, #ede9fe 25%, #fce7f3 50%, #fff1f2 75%, #ffffff 100%)",
          }}
        />

        {/* Ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl" aria-hidden>
          <div className="absolute top-20 right-16 w-[380px] h-[380px] bg-violet-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-32 left-12 w-[320px] h-[320px] bg-rose-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto p-6">

          {/* Section header */}
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-rose-600 bg-rose-50/80 border border-rose-200/60 rounded-full mb-5 tracking-widest uppercase backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              How It Works
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight leading-tight">
              Four Steps from{" "}
              <span className="bg-gradient-to-r from-rose-400 to-violet-500 bg-clip-text text-transparent">
                Brief to Proposal
              </span>
            </h2>
            <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              A fully autonomous pipeline that turns client conversations into polished, validated proposals —
              with a human in control at every critical step.
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="relative w-full">
                {/* Glow blob behind card */}
                <div
                  className={`absolute inset-0 h-full w-full scale-[0.85] transform rounded-full bg-gradient-to-r ${feature.gradient} blur-3xl opacity-60`}
                />

                {/* Card */}
                <div className="relative flex min-h-[340px] flex-col items-start justify-between overflow-hidden rounded-2xl border border-gray-800/80 bg-gray-950 px-6 py-8 shadow-2xl">

                  {/* Top: icon + step */}
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700 bg-gray-900">
                        {feature.icon}
                      </div>
                      <span className="text-xs font-bold text-gray-600 tracking-widest">
                        STEP {feature.step}
                      </span>
                    </div>

                    <h3 className="relative z-50 mb-4 text-xl font-bold text-white leading-snug">
                      {feature.title}
                    </h3>

                    <p className="relative z-50 text-sm font-normal text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom: gradient pill */}
                  <div className="mt-8 relative z-50">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${feature.gradient} opacity-90`}
                    >
                      Feature {feature.step}
                    </span>
                  </div>

                  {/* Meteor effect */}
                  <Meteors number={40} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Features;
