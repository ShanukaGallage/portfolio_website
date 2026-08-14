import RoadmapSection from "@/components/sections/Roadmap";
import Footer from "@/components/sections/Footer";

export default function RoadmapPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1">
        <RoadmapSection />
      </div>
      <Footer />
    </main>
  );
}
