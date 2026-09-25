import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Branches from "@/components/Branches";
import Partners from "@/components/Partners";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Branches />
        <Partners />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
