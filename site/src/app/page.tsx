import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import LogosStrip from "@/components/LogosStrip";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LogosStrip />
        <Services />
        <Portfolio />
        <Gallery />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
