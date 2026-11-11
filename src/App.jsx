import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Building from "./components/Building";
import CTA from "./components/CTA";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import SmoothBackground from "./components/SmoothBackground";

export default function App() {
  return (
    <>
      <SmoothBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Building />
          <CTA />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}