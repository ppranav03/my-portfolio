"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import NowPlaying from "@/components/NowPlaying";

// ASCII art lives outside the component so it isn't rebuilt on every render.
// String.raw keeps the backslashes exactly as typed; .slice(1) drops the first empty line.
// TODO: try adding a flag or a name on the hull
const ship = String.raw`
           ;~
         ,/|\,
       ,/ /| '\,
      /  | |   '\,
     |   | |     '\,
     |    \|       '\,
     '-----|__________\,
___________|________________
\    o     o     o     o   /
 \________________________/`.slice(1);

// One "tile" of mountains. It gets repeated side by side to make a whole range.
// The bottom corners (/ and \) meet the next tile to form a valley: \/
// Careful: a \ right before the closing backtick would "escape" it and break the string,
// so the backtick goes on its own line and .slice(1, -1) drops the first AND last newline.
const mountainTile = String.raw`
        /\
       /  \    /\
  /\  /    \  /  \
 /  \/      \/    \
/                  \
`.slice(1, -1);

// Repeats an ASCII drawing side by side, `times` times.
// Each line is padded to the same width first, so the tiles line up.
function repeatArt(art: string, times: number) {
  const lines = art.split("\n");
  const width = Math.max(...lines.map((line) => line.length));
  return lines.map((line) => line.padEnd(width).repeat(times)).join("\n");
}

const mountains = repeatArt(mountainTile, 40);

// Two cloud shapes, so the sky doesn't look copy-pasted
// TODO: draw a third cloud shape of your own
const cloudSmall = String.raw`
   .--.
 .(    ).
(___.__)__)`.slice(1);

const cloudBig = String.raw`
      .-~~-.
  .-~(      )~-.
 (              )
  '-.________.-'`.slice(1);

// One row of waves is a short pattern repeated many times,
// so it stays wider than the screen even while it slides sideways.
const wavesBack = "   ~    ~~   ".repeat(80);
const wavesMid = " ~^~   ~~^~  ".repeat(80);
const wavesFront = "~~^~~~~^~~~~^".repeat(80);

export default function Hero() {
  // The scope ref: GSAP only looks for classes like ".layer-text" inside this section,
  // and useGSAP cleans up every animation here when the component unmounts.
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // matchMedia runs the code inside only when the media query matches.
      // People who turn on "reduce motion" in their OS see a still scene.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The scroll parallax: one timeline, one ScrollTrigger, many layers
        const tl = gsap.timeline({
          // Every tween here moves at constant speed so it tracks the scrollbar
          defaults: { ease: "none" },
          scrollTrigger: {
            // The element whose position decides when the animation runs
            trigger: container.current,
            // Start when the TOP of the hero hits the TOP of the viewport
            start: "top top",
            // End when the BOTTOM of the hero hits the TOP of the viewport
            end: "bottom top",
            // Tie progress to the scrollbar (scrolling back plays it in reverse)
            scrub: true,
          },
        });

        // xPercent/yPercent are percentages of the element's OWN size.
        // Wave rows are 200% wide, so 20% of that = 40% of the screen (always < 50%).
        // Back rows move less than front rows, and that difference is what reads as depth.
        // The `0` at the end of each line means "all start at the same time".
        tl.to(".layer-mountains", { xPercent: -3 }, 0) // farthest: barely moves
          // Clouds drift by a percent of their OWN width (100 = one cloud-width)
          .to(".cloud-1", { xPercent: 120 }, 0) // drifts right
          .to(".cloud-2", { xPercent: -80 }, 0) // drifts left
          .to(".cloud-3", { xPercent: 60 }, 0) // drifts right, slower
          .to(".layer-waves-back", { xPercent: -8 }, 0) // far: slow, to the left
          .to(".layer-waves-mid", { xPercent: 12 }, 0) // middle: to the right
          .to(".layer-waves-front", { xPercent: -20 }, 0) // near: fast, to the left
          .to(".layer-text", { yPercent: -80, autoAlpha: 0 }, 0) // rises and fades
          // The ship rocks side to side while you scroll.
          // keyframes = a list of values to go through in order, spread evenly over the scroll.
          .to(
            ".layer-ship",
            {
              keyframes: {
                rotation: [0, -6, 5, -5, 4, 0], // tilt left, right, left... back to level
                y: [0, 6, 0, 6, 0, 6], // dip a little on each tilt
                easeEach: "sine.inOut", // ease every swing, like a real wave
              },
              // Pivot near the bottom of the hull (the waterline), not the middle
              transformOrigin: "50% 85%",
            },
            0
          )
          // The ship sails LEFT by 1.5x its own width over the scroll.
          // This is on a different box than the rocking, so the two don't fight.
          .to(".layer-sail", { xPercent: -150 }, 0);

        // TODO: try adding more numbers to the rotation list for faster rocking
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} id="hero" className="relative h-screen overflow-hidden bg-hero text-white">
      {/* Scenery comes FIRST in the HTML so everything else is drawn on top of it */}

      {/* Clouds: dim, scattered around the sky */}
      <pre className="cloud-1 absolute left-[5%] top-[14%] text-xs text-white/25 md:text-sm" aria-hidden="true">
        {cloudBig}
      </pre>
      <pre className="cloud-2 absolute left-[55%] top-[22%] text-xs text-white/20 md:text-sm" aria-hidden="true">
        {cloudSmall}
      </pre>
      <pre className="cloud-3 absolute left-[30%] top-[48%] hidden text-sm text-white/15 md:block" aria-hidden="true">
        {cloudBig}
      </pre>

      {/* Mountains sit right on the horizon, just above the back waves */}
      <pre
        className="layer-mountains absolute bottom-24 -left-1/2 w-[200%] text-sm leading-none text-white/15"
        aria-hidden="true"
      >
        {mountains}
      </pre>

      {/* Spotify pill: centered under the navbar on phones, top-right on bigger screens */}
      <div className="absolute inset-x-0 top-20 flex justify-center px-6 md:left-auto md:right-[8%] md:top-24 md:px-0">
        <NowPlaying />
      </div>

      {/* Your text: centered on phones, on the left on bigger screens */}
      <div className="layer-text absolute inset-x-0 top-[26%] px-6 text-center md:left-[8%] md:right-auto md:top-1/3 md:text-left">
        {/* TODO: try animating this heading with SplitText */}
        {/* whitespace-nowrap = never wrap onto a second line (only on large screens, where it fits) */}
        <h1 className="text-5xl font-bold md:text-7xl lg:whitespace-nowrap">Hi, I&apos;m Pranav!</h1>
        {/* TODO: write a one-line intro about yourself */}
        {/* max-w-xl keeps the quote from stretching too wide on big screens */}
        <p className="mt-4 text-lg text-white/70 md:max-w-l md:text-l">&quot;If you don&apos;t take risks, you can&apos;t create a future&quot; - Monkey D. Luffy</p>
      </div>

      {/* Wave rows: the ones later in the HTML are drawn in front of earlier ones */}
      <pre className="layer-waves-back absolute bottom-20 -left-1/2 w-[200%] text-xs text-white/20" aria-hidden="true">
        {wavesBack}
      </pre>
      <pre className="layer-waves-mid absolute bottom-12 -left-1/2 w-[200%] text-sm text-white/40" aria-hidden="true">
        {wavesMid}
      </pre>
      {/*
        The ship uses three boxes so each has one job:
        1. the outer div places it with Tailwind (bottom-center on phones, right on desktop)
        2. .layer-sail moves it left as you scroll
        3. .layer-ship rocks it side to side
        Two animations on the SAME element would overwrite each other's transform.
      */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:left-auto md:right-[8%] md:translate-x-0">
        <div className="layer-sail">
          <pre
            className="layer-ship text-xs leading-tight text-white/90 sm:text-base md:text-lg"
            role="img"
            aria-label="ASCII art of a sailboat"
          >
            {ship}
          </pre>
        </div>
      </div>

      {/* Front waves sit IN FRONT of the ship, so the hull looks like it's in the water */}
      <pre className="layer-waves-front absolute bottom-4 -left-1/2 w-[200%] text-base text-white/70" aria-hidden="true">


        {wavesFront}
      </pre>
    </section>
  );
}
