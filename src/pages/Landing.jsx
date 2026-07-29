import { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import SocialProofSection from "../components/SocialProofSection";
import HowItWorksSection from "../components/HowItWorksSection";
import FeaturesSection from "../components/FeaturesSection";
import FinalCTASection from "../components/FinalCTASection";
import LandingFooter from "../components/LandingFooter";

// Efek scroll (parallax hero) & fade-in panel, dipisah jadi hook kecil
// supaya Landing.jsx sendiri tetap bersih dan cuma fokus nyusun section.
function useScrollEffects() {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const heroText = document.querySelector("h1");
      const heroMockup = document.querySelector(".hero-mockup");
      if (heroText) heroText.style.transform = `translateY(${scrolled * 0.1}px)`;
      if (heroMockup) {
        heroMockup.style.transform = `perspective(1000px) rotateX(${
          2 + scrolled * 0.02
        }deg) translateY(-${scrolled * 0.05}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-panel").forEach((el) => {
      el.classList.add("transition-all", "duration-700", "opacity-0", "translate-y-10");
      observer.observe(el);
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}

export default function Landing() {
  useScrollEffects();

  return (
    <div className="bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-400/30 selection:text-purple-200">
      <Navbar />
      <HeroSection />
      <SocialProofSection />
      <HowItWorksSection />
      <FeaturesSection />
      <FinalCTASection />
      <LandingFooter />
    </div>
  );
}
