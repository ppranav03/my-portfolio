"use client";

import { useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import virginiaTechIcon from "@/components/images/virginia-tech-icon.png";
import peratonIcon from "@/components/images/peraton-icon.png";
import ibmIcon from "@/components/images/ibm-icon.png";

// TODO: replace these with your real schools. Add a new { ... } to add another.
const education = [
  {
    id: 1,
    school: "Virginia Tech",
    logo: virginiaTechIcon,
    degree: "M.Eng in Computer Science",
    dates: "2025 – 2026",
    details: "Concentration in Data Analytics and Artificial Intelligence",
  },
  {
    id: 2,
    school: "Virginia Tech",
    logo: virginiaTechIcon,
    degree: "B.S. in Computer Science",
    dates: "2021 – 2025",
    details: "Magna Cum Laude",
  }
];

// TODO: replace these with your real jobs, internships, or club roles.
const experience = [
  {
    role: "Software Engineer",
    logo: ibmIcon,
    company: "IBM",
    dates: "June 2026 - Present",
  },
  {
    role: "Software Engineer Intern",
    logo: ibmIcon,
    company: "IBM",
    dates: "Summer 2025",
  }, 
  {
    role: "Software Engineer Intern",
    logo: peratonIcon,
    company: "Peraton",
    dates: "Fall 2024",
  },
];

export default function About() {
  // Scope ref: ".reveal" only matches elements inside this section
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Same reduced-motion check as the Hero
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // gsap.utils.toArray finds every .reveal element (inside our scope).
        // Each one gets its OWN ScrollTrigger, so things lower down the page
        // fade in when YOU reach them, not all at once when the section starts.
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
          // gsap.from() animates FROM these values TO the element's normal look
          gsap.from(element, {
            // Start 40px lower than normal...
            y: 40,
            // ...and invisible (autoAlpha = opacity + visibility)
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              // This time the trigger is the element itself
              trigger: element,
              // Play when the TOP of the element reaches 85% down the viewport
              start: "top 85%",
              // No scrub here: this plays once, like a normal animation
            },
          });
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} id="about" className="mx-auto max-w-5xl px-6 py-32">
      {/* Anything with the "reveal" class fades up. Add it to new elements! */}
      <h2 className="reveal text-4xl font-bold md:text-5xl">About me</h2>

      {/* TODO: write 2-3 short paragraphs about who you are and what you enjoy building */}
      <div className="max-w-3xl">
        <p className="reveal mt-6 text-lg leading-relaxed text-muted">Hello, I&apos;m Pranav. I&apos;m a graduate from Virginia Tech and aspiring software engineer.
          My passions are in cloud development, machine learning, and automation. I don’t just write code, I build end-to-end architectures that solve real-world problems. I love to talk tech, jump into deep technical discussions, and am constantly tinkering with new tools.
        </p>
        <p className="reveal mt-4 text-lg leading-relaxed text-muted">
        </p>
      </div>

      {/* TODO: add a photo of yourself next to the intro */}

      {/* Two columns on bigger screens, stacked on phones */}
      <div className="mt-20 grid gap-16 md:grid-cols-2">
        <div>
          <h3 className="reveal text-2xl font-bold">Education</h3>
          <ul className="mt-6 space-y-8">
            {education.map((item) => (
              <li key={item.id} className="reveal flex gap-4 border-l-2 border-accent pl-4">
                {/* Rounded-square school logo. shrink-0 stops it from squishing when the text is long. */}
                <Image
                  src={item.logo}
                  alt={`${item.school} logo`}
                  width={56}
                  height={56}
                  className="size-14 shrink-0 rounded-xl object-cover"
                />
                <div>
                  <p className="text-sm text-muted">{item.dates}</p>
                  <p className="mt-1 text-lg font-bold">{item.school}</p>
                  <p>{item.degree}</p>
                  <p className="mt-2 text-muted">{item.details}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="reveal text-2xl font-bold">Experience</h3>
          <ul className="mt-6 space-y-8">
            {experience.map((item) => (
              <li key={item.role + item.company} className="reveal flex gap-4 border-l-2 border-accent pl-4">
                {/* Same rounded-square logo as Education */}
                <Image
                  src={item.logo}
                  alt={`${item.company} logo`}
                  width={56}
                  height={56}
                  className="size-14 shrink-0 rounded-xl object-cover"
                />
                <div>
                  <p className="text-sm text-muted">{item.dates}</p>
                  <p className="mt-1 text-lg font-bold">{item.role}</p>
                  <p>{item.company}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
