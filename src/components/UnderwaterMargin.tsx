"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Each fish: its ASCII art, where it sits, how far it drifts sideways (+ = right),
// and how far it rises while you scroll the whole white area (parallax).
// "><>" faces right, "<><" faces left, so `swim` matches the way each one points.
// TODO: add more fish, or try a crab "(\/)(;,,;)(\/)" on the sea floor
const fishes = [
  { art: "><>", top: "8%", left: "15%", swim: 12, rise: -120 },
  { art: "<><", top: "26%", left: "55%", swim: -10, rise: -60, accent: true },
  { art: "><(((o>", top: "45%", left: "5%", swim: 16, rise: -160 },
  { art: "<o)))><", top: "64%", left: "35%", swim: -14, rise: -90 },
  { art: "><>", top: "80%", left: "60%", swim: 10, rise: -40 },
];

const bubbles = [
  { char: "o", top: "15%", left: "75%" },
  { char: ".", top: "22%", left: "30%" },
  { char: "O", top: "38%", left: "70%" },
  { char: "o", top: "55%", left: "20%" },
  { char: ".", top: "72%", left: "80%" },
  { char: "o", top: "88%", left: "45%" },
];

// Builds a strand of seaweed that wiggles: ( and ) on alternating lines
function seaweed(height: number) {
  return Array.from({ length: height }, (_, i) => (i % 2 === 0 ? "( " : " )")).join("\n");
}

const seaweeds = [
  { art: seaweed(7), left: "5%" },
  { art: seaweed(10), left: "40%" },
  { art: seaweed(6), left: "75%" },
];

export default function UnderwaterMargin() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1280px) and (prefers-reduced-motion: no-preference)", () => {
        // 1) Scroll parallax: each fish rises by its own amount (read from data-rise)
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: container.current,
            start: "top bottom", // as soon as the white area appears
            end: "bottom top", // until it's fully scrolled past
            scrub: true,
          },
        });
        gsap.utils.toArray<HTMLElement>(".fish").forEach((fish) => {
          tl.to(fish, { y: Number(fish.dataset.rise) }, 0);
        });

        // 2) Fish drift back and forth on their own, forever.
        // This moves `x` while the scroll moves `y`. Different properties on the
        // same element are fine; it's the SAME property twice that would fight.
        gsap.utils.toArray<HTMLElement>(".fish").forEach((fish) => {
          gsap.to(fish, {
            x: Number(fish.dataset.swim),
            duration: gsap.utils.random(2, 4), // each fish gets its own pace
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });

        // 3) Bubbles float up and fade out, then start again
        gsap.utils.toArray<HTMLElement>(".bubble").forEach((bubble) => {
          gsap.fromTo(
            bubble,
            { y: 0, autoAlpha: 0.9 },
            {
              y: -140, // float up 140px
              autoAlpha: 0, // fading as they go
              duration: gsap.utils.random(3, 6),
              delay: gsap.utils.random(0, 3), // so they don't all start together
              ease: "none",
              repeat: -1,
            }
          );
        });

        // 4) Seaweed sways, pivoting at its roots
        gsap.utils.toArray<HTMLElement>(".seaweed").forEach((strand) => {
          gsap.fromTo(
            strand,
            { rotation: -5 },
            {
              rotation: 5,
              transformOrigin: "50% 100%", // bottom center = the roots
              duration: gsap.utils.random(2, 3.5),
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            }
          );
        });
      });
    },
    { scope: container }
  );

  return (
    // Right margin only, on screens 1280px+ (same as the anchor on the left)
    <div
      ref={container}
      className="pointer-events-none absolute inset-y-0 right-8 hidden w-28 overflow-hidden xl:block"
      aria-hidden="true"
    >
      {fishes.map((fish, i) => (
        <pre
          key={i}
          className={`fish absolute text-sm font-bold ${fish.accent ? "text-accent/70" : "text-hero/50"}`}
          style={{ top: fish.top, left: fish.left }}
          data-swim={fish.swim}
          data-rise={fish.rise}
        >
          {fish.art}
        </pre>
      ))}

      {bubbles.map((bubble, i) => (
        <span key={i} className="bubble absolute text-sm text-hero/40" style={{ top: bubble.top, left: bubble.left }}>
          {bubble.char}
        </span>
      ))}

      {/* Seaweed sits on the "sea floor", level with where the anchor lands */}
      {seaweeds.map((strand, i) => (
        <pre
          key={i}
          className="seaweed absolute bottom-16 text-sm font-bold leading-4 text-hero/50"
          style={{ left: strand.left }}
        >
          {strand.art}
        </pre>
      ))}
    </div>
  );
}
