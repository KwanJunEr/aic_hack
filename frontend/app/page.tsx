import About from "@/components/landing/About";
import HeroSection_05 from "@/components/landing/hero-section-with-gradient";
import Header from "@/components/landing/LandingHeader";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-screen overflow-y-auto no-scrollbar">
        <Header/>
        <HeroSection_05/>
        <About/>
    </div>
  );
}
