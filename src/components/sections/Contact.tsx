"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa6";

// A bottle with a rolled-up note inside
const bottle = String.raw`
    _
   |~|
   | |
  /   \
 /     \
|  ___  |
| |~~~| |
| |___| |
|_______|`.slice(1);

const waves = "~^~~~^~~~^~~~^~";

// TODO: put your real email address here
const EMAIL = "pranavyp15@gmail.com";

export default function Contact() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The card fades up when you reach it (same pattern as About)
        gsap.from(".contact-card", {
          y: 60,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: ".contact-card", start: "top 85%" },
        });

        // The bottle bobs and tilts on the waves, forever
        gsap.to(".bottle", {
          keyframes: {
            y: [0, -8, 0], // up, then back down
            rotation: [-6, 6, -6], // tilt one way, then the other
            easeEach: "sine.inOut",
          },
          transformOrigin: "50% 100%", // tilt from the bottom, where it sits in the water
          duration: 4,
          repeat: -1,
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} id="contact" className="mx-auto max-w-5xl px-6 py-32">
      {/* A dark card in the hero's gray, so the page ends back at sea */}
      <div className="contact-card rounded-3xl bg-hero p-8 text-white md:p-12">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-mono text-sm text-white/50">~ end of the voyage ~</p>
            <h2 className="mt-2 text-4xl font-bold md:text-5xl">Send me a message in a bottle</h2>

            {/* TODO: write a short, friendly call to action in your own words */}
            <p className="mt-4 max-w-lg text-lg text-white/70">
              Whether it&apos;s a project, an opportunity, or just a chat, my inbox is open.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full bg-blue-800 px-6 py-3 font-bold transition-colors hover:bg-blue-900"
              >
                <FaEnvelope className="size-4" />
                Say hello
              </a>
              <a
                href="https://github.com/ppranav03"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 transition-colors hover:bg-white/10"
              >
                <FaGithub className="size-4" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/ppranav03"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 transition-colors hover:bg-white/10"
              >
                <FaLinkedin className="size-4" />
                LinkedIn
              </a>
              {/* TODO: add a résumé button. Put resume.pdf in /public, then copy a link above with href="/resume.pdf" */}
            </div>
          </div>

          {/* The bottle floating on a little row of waves */}
          <div className="flex flex-col items-center" aria-hidden="true">
            <pre className="bottle text-base font-bold leading-5 text-white/80">{bottle}</pre>
            <pre className="-mt-1 text-base text-white/40">{waves}</pre>
          </div>
        </div>
      </div>

      <footer className="mt-10 text-center text-sm text-muted">
        Built with Next.js, GSAP and Lenis · © {new Date().getFullYear()} Pranav Patel
      </footer>
    </section>
  );
}
