import About from "@/components/landing/About";
import Features from "@/components/landing/Features";
import HeroSection_05 from "@/components/landing/hero-section-with-gradient";
import Header from "@/components/landing/LandingHeader";

export default function Home() {
  return (
    <div className="w-full h-screen overflow-y-auto no-scrollbar">
        <Header/>
        <HeroSection_05/>
        <About/>
        <Features/>
    </div>
  );
}
