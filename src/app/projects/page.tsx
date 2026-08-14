import ProjectsSection from "@/components/sections/Projects";
import Footer from "@/components/sections/Footer";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1">
        <ProjectsSection />
      </div>
      <Footer />
    </main>
  );
}
