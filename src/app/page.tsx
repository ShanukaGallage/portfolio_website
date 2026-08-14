import Hero from "@/components/sections/Hero";
import Introduction from "@/components/sections/Introduction";
import LandingAbout from "@/components/sections/LandingAbout";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <Introduction />
      <LandingAbout />
      <Footer />
    </main>
  );
}
