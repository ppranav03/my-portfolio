"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// One chain link is 3 lines: an oval link, then a short connector.
// It's repeated far more than needed; the box around it cuts off the extra at the top.
const link = ["/^\\", "\\_/", " | "];
const chain = Array.from({ length: 150 }, () => link.join("\n")).join("\n");

const anchor = String.raw`
     O
  ___|___
     |
\    |    /
 '-._|_.-'`.slice(1);

export default function AnchorChain() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Only on wide screens (where it's visible) and only if motion is OK.
      // Otherwise it just shows the anchor already at the bottom.
      mm.add("(min-width: 1280px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            // The whole white area is the trigger
            trigger: container.current,
            // Start lowering when the top of the white area is 80% down the screen
            start: "top 80%",
            // Hit the bottom when the bottom of the white area reaches the bottom of the screen
            end: "bottom bottom",
            scrub: true,
          },
        });

        // Lower the anchor: the chain + anchor start pulled up 90% of their height
        // (hidden above the top edge), and slide down to their normal spot.
        tl.fromTo(".anchor-drop", { yPercent: -90 }, { yPercent: 0 }, 0)
          // Sway the anchor a little on the way down, pivoting where it hangs from the chain
          .to(
            ".anchor",
            {
              keyframes: { rotation: [0, 6, -5, 4, -3, 0], easeEach: "sine.inOut" },
              transformOrigin: "50% 0%",
            },
            0
          );
      });
    },
    { scope: container }
  );

  return (
    // inset-y-0 + overflow-hidden: the art can never poke out above or below the white area.
    // hidden xl:block: only shows on screens 1280px+, where the side margins have room.
    <div
      ref={container}
      className="pointer-events-none absolute inset-y-0 left-12 hidden overflow-hidden xl:block"
      aria-hidden="true"
    >
      {/* The chain + anchor move together. pb-16 makes the anchor land a little above the very bottom. */}
      <div className="anchor-drop flex h-full flex-col items-center pb-16">
        {/* justify-end pins the END of the chain to the anchor; extra links get cut off at the top */}
        <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden">
          <pre className="text-sm leading-4 text-hero/50">{chain}</pre>
        </div>

        <pre className="anchor text-lg font-bold leading-5 text-hero/70">{anchor}</pre>
      </div>

      {/* TODO: add a second chain on the right side, or a little "splash" when the anchor lands */}
    </div>
  );
}
