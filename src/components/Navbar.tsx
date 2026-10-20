import { FaGithub, FaLinkedin } from "react-icons/fa6";

// Each link jumps to the section with that id (e.g. <section id="about">).
// TODO: if you add more routes later, switch to next/link with "/#about" so links work from any page
const links = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    // fixed + top-0 keeps the bar on screen while you scroll; z-50 keeps it above everything.
    // The bar is always dark (with a blur behind it) so it's readable on the gray hero AND the white sections.
    <header className="fixed inset-x-0 top-0 z-50 bg-hero/80 text-white backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
        {/* Your name doubles as a "back to top" link. Hidden on phones to save space. */}
        <a href="#hero" className="hidden text-xl font-bold sm:block">
          Pranav
        </a>

        <div className="flex items-center gap-4 text-base md:gap-8 md:text-lg">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-white/70 transition-colors hover:text-white">
              {link.label}
            </a>
          ))}

          {/* aria-label tells screen readers what an icon-only link is */}
          {/* TODO: put your real GitHub and LinkedIn URLs here */}
          <a href="https://github.com/ppranav03" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-white/70 transition-colors hover:text-white">
            <FaGithub className="size-5" />
          </a>
          <a href="https://www.linkedin.com/in/ppranav03" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white/70 transition-colors hover:text-white">
            <FaLinkedin className="size-5" />
          </a>
        </div>
      </nav>
    </header>
  );
}
