import SkillsSection from "@/components/sections/Skills";
import Footer from "@/components/sections/Footer";

export default function SkillsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1">
        <SkillsSection />
      </div>
      <Footer />
    </main>
  );
}
