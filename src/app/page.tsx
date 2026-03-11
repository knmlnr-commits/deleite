import { getContent } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeContent from "@/components/HomeContent";

export const dynamic = "force-dynamic";

export default function Home() {
  const content = getContent();

  return (
    <main>
      <Navbar />
      <HomeContent initialContent={content} />
      <Footer />
    </main>
  );
}
