import ContactSection from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1">
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}
