import ExperienceSection from "@/components/sections/Experience";
import Footer from "@/components/sections/Footer";

export default function ExperiencePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1">
        <ExperienceSection />
      </div>
      <Footer />
    </main>
  );
}
