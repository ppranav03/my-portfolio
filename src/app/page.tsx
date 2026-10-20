import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import AnchorChain from "@/components/AnchorChain";
import UnderwaterMargin from "@/components/UnderwaterMargin";

// Each section is its own component, so you can later move any of them
// to its own route (e.g. src/app/projects/page.tsx) without changes.
export default function Home() {
  return (
    <main>
      <Hero />

      {/* `relative` so the margin art (anchor on the left, sea life on the right) can stretch over all the white sections */}
      <div className="relative">
        <AnchorChain />
        <UnderwaterMargin />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </div>
    </main>
  );
}
