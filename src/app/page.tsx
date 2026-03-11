import { getContent } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import PropertyDetails from "@/components/PropertyDetails";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function Home() {
  const content = getContent();

  return (
    <main>
      <Navbar />
      <Hero content={content} />
      <About content={content} />
      <Gallery content={content} />
      <PropertyDetails content={content} />
      <Contact content={content} />
      <Footer />
    </main>
  );
}
