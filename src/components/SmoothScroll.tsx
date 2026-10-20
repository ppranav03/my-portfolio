"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Register GSAP plugins ONCE for the whole app. Every section component
// can now use useGSAP() and `scrollTrigger: {...}` without registering again.
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Lenis replaces the browser's jumpy wheel scrolling with smooth scrolling.
    // anchors: true makes links like <a href="#about"> glide to their section.
    const lenis = new Lenis({ anchors: true });

    // Every time Lenis scrolls, tell ScrollTrigger so animations stay in sync
    lenis.on("scroll", ScrollTrigger.update);

    // Let GSAP's ticker drive Lenis, so both share one animation loop.
    // GSAP gives time in seconds; Lenis wants milliseconds.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    // Turn off GSAP's "catch up after lag" behavior so scrolling never jumps
    gsap.ticker.lagSmoothing(0);

    // Cleanup so nothing doubles up when React re-mounts in dev
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
