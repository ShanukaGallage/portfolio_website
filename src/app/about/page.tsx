import AboutSection from "@/components/sections/About";
import Footer from "@/components/sections/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1">
        <AboutSection />
      </div>
      <Footer />
    </main>
  );
}
