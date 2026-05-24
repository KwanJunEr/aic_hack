"use client";
import { Globe3D, GlobeMarker } from "@/components/ui/3d-globe";

const sampleMarkers: GlobeMarker[] = [
  { lat: 40.7128,  lng: -74.006,   src: "https://assets.aceternity.com/avatars/1.webp",  label: "New York" },
  { lat: 51.5074,  lng: -0.1278,   src: "https://assets.aceternity.com/avatars/2.webp",  label: "London" },
  { lat: 35.6762,  lng: 139.6503,  src: "https://assets.aceternity.com/avatars/3.webp",  label: "Tokyo" },
  { lat: -33.8688, lng: 151.2093,  src: "https://assets.aceternity.com/avatars/4.webp",  label: "Sydney" },
  { lat: 48.8566,  lng: 2.3522,    src: "https://assets.aceternity.com/avatars/5.webp",  label: "Paris" },
  { lat: 28.6139,  lng: 77.209,    src: "https://assets.aceternity.com/avatars/6.webp",  label: "New Delhi" },
  { lat: 55.7558,  lng: 37.6173,   src: "https://assets.aceternity.com/avatars/7.webp",  label: "Moscow" },
  { lat: -22.9068, lng: -43.1729,  src: "https://assets.aceternity.com/avatars/8.webp",  label: "Rio de Janeiro" },
  { lat: 31.2304,  lng: 121.4737,  src: "https://assets.aceternity.com/avatars/9.webp",  label: "Shanghai" },
  { lat: 25.2048,  lng: 55.2708,   src: "https://assets.aceternity.com/avatars/10.webp", label: "Dubai" },
  { lat: -34.6037, lng: -58.3816,  src: "https://assets.aceternity.com/avatars/11.webp", label: "Buenos Aires" },
  { lat: 1.3521,   lng: 103.8198,  src: "https://assets.aceternity.com/avatars/12.webp", label: "Singapore" },
  { lat: 37.5665,  lng: 126.978,   src: "https://assets.aceternity.com/avatars/13.webp", label: "Seoul" },
];

const problems = [
  "Critical specs are buried in hours of meeting recordings, emails, and notes. Manual extraction is slow, inconsistent, and prone to costly omissions.",
  "Teams spend days cross-referencing compatibility matrices and product catalogs before a single proposal draft can be written.",
  "Different stakeholders need different framing. Creating multiple tailored versions manually multiplies effort with no accuracy guarantee.",
  "Without automated validation, proposals return with compatibility issues and scope gaps that delay deals and signal incompetence.",
];

const solutions = [
  {
    step: "01",
    title: "AI Requirement Extraction",
    body: "Automatically parses meeting transcripts and surfaces every requirement, constraint, and preference — with zero manual effort.",
  },
  {
    step: "02",
    title: "Real-Time Compatibility Validation",
    body: "Cross-references your product catalog and knowledge base instantly, flagging conflicts before they become proposal blockers.",
  },
  {
    step: "03",
    title: "Multi-Version Proposal Generation",
    body: "Produces tailored drafts for every stakeholder profile in seconds — executive summaries, technical specs, and commercial proposals.",
  },
  {
    step: "04",
    title: "Human-in-the-Loop Control",
    body: "Consultants review, override, and approve at every decision point. AI augments your judgment — it never replaces it.",
  },
];

const stats = [
  { value: "3×", label: "Faster proposal turnaround" },
  { value: "94%", label: "Requirement accuracy" },
  { value: "60%", label: "Fewer revision cycles" },
];

const About = () => {
  return (
    <div className="p-6 overflow-hidden rounded-xl">
      <div className="relative w-full">
        {/* Background gradient */}
        <div
          className="absolute inset-0 -z-10 rounded-2xl"
          style={{
            background:
              "linear-gradient(160deg, #fce7f3 0%, #f3e8ff 25%, #ede9fe 50%, #f5f3ff 75%, #ffffff 100%)",
          }}
        />

        {/* Soft ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl" aria-hidden>
          <div className="absolute top-32 left-10 w-[420px] h-[420px] bg-rose-200/20 rounded-full blur-3xl" />
          <div className="absolute top-10 right-20 w-[320px] h-[320px] bg-violet-200/25 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-[360px] h-[360px] bg-fuchsia-100/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto p-6">

          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-violet-600 bg-violet-50/80 border border-violet-200/60 rounded-full mb-5 tracking-widest uppercase backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Why SpecPilot AI
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight leading-tight">
              The Proposal Problem Is{" "}
              <span className="bg-gradient-to-r from-rose-400 to-violet-500 bg-clip-text text-transparent">
                Costing You Deals
              </span>
            </h2>
            <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Technical sales teams lose 40–60% of productive time to manual proposal work.
              SpecPilot AI eliminates that drag — intelligently, safely, and at scale.
            </p>
          </div>

          {/* Two-column body */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-start">

            {/* Left column: Problems → Solutions */}
            <div className="space-y-10">

              {/* Problems */}
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-rose-400 to-rose-600" />
                  <span className="text-xs font-bold text-rose-500 tracking-widest uppercase">
                    Where Technical Sales Breaks Down
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  In modern technical sales environments, proposals are rarely blocked by lack of effort —
                  they fail because information is fragmented, decisions are manual, and complexity grows faster
                  than teams can manage.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {problems.map((p, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-white/55 border border-rose-100/70 backdrop-blur-sm hover:bg-white/75 hover:border-rose-200/80 hover:shadow-sm transition-all duration-200"
                    >
                      <p className="text-gray-500 text-xs leading-relaxed">{p}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider arrow */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent" />
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-violet-500 shadow-sm">
                  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-white">
                    <path d="M8 3v10m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent" />
              </div>

              {/* Solutions */}
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-400 to-violet-600" />
                  <span className="text-xs font-bold text-violet-500 tracking-widest uppercase">
                    The Solution
                  </span>
                </div>

                <div className="space-y-3">
                  {solutions.map((s, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 rounded-2xl bg-white/55 border border-violet-100/70 backdrop-blur-sm hover:bg-white/75 hover:border-violet-200/80 hover:shadow-sm transition-all duration-200"
                    >
                      <span className="flex-shrink-0 text-xs font-bold text-violet-400 w-6 pt-0.5">{s.step}</span>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm leading-snug">{s.title}</p>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed">{s.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right column: Globe + Stats */}
            <div className="flex flex-col items-center gap-6 lg:sticky lg:top-28">

              {/* Globe card */}
              <div className="relative w-full rounded-3xl overflow-hidden border border-white/60 bg-white/25 backdrop-blur-md shadow-xl shadow-violet-100/30">
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 40%, rgba(216, 180, 254, 0.3) 0%, rgba(251, 207, 232, 0.2) 50%, transparent 75%)",
                  }}
                />
                <Globe3D
                  markers={sampleMarkers}
                  config={{
                    showAtmosphere: true,
                    atmosphereColor: "#c084fc",
                    atmosphereIntensity: 0.28,
                    atmosphereBlur: 2.5,
                    bumpScale: 3,
                    autoRotateSpeed: 2.2,
                    ambientIntensity: 0.85,
                    pointLightIntensity: 1.3,
                  }}
                  className="h-[360px]"
                />
                {/* Coverage badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-white/70 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-700 leading-none">Global Coverage</p>
                    <p className="text-xs text-gray-400 mt-0.5">12+ active markets</p>
                  </div>
                </div>
              </div>

              {/* Stat pills */}
              <div className="grid grid-cols-3 gap-3 w-full">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 py-4 px-2 rounded-2xl bg-white/60 border border-white/70 backdrop-blur-sm shadow-sm hover:bg-white/80 transition-colors duration-200"
                  >
                    <span className="text-2xl font-bold bg-gradient-to-br from-rose-400 to-violet-500 bg-clip-text text-transparent leading-none">
                      {stat.value}
                    </span>
                    <span className="text-[11px] text-gray-500 text-center leading-tight">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Enterprise trust note */}
              <p className="text-xs text-gray-400 text-center px-4 leading-relaxed">
                Built for enterprise-grade compliance — SOC 2 aligned, Human-in-the-Loop by design.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
