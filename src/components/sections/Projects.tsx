import Image, { type StaticImageData } from "next/image";
import { FaArrowUpRightFromSquare, FaGithub } from "react-icons/fa6";
import { SiDevpost } from "react-icons/si";
import resumeExtension from "@/components/images/resume-extension.png";
import aviateAI from "@/components/images/aviate-ai.jpg";
import gmap from "@/components/images/gmap.png";
import wineML from "@/components/images/wine-ml.png";

// The `?` means a prop is optional. Leave out `image` and the card just has no picture.
type ProjectCardProps = {
  title: string;
  description: string;
  image?: string | StaticImageData; // an imported image, or a path inside /public like "/projects/my-app.png"
  imageAlt?: string; // describe the image for screen readers
  link?: { label: string; href: string }; // e.g. { label: "GitHub", href: "https://github.com/..." }
};

// Pick an icon based on where the link goes
function LinkIcon({ href }: { href: string }) {
  if (href.includes("github.com")) return <FaGithub className="size-4" />;
  if (href.includes("devpost.com")) return <SiDevpost className="size-4" />;
  return <FaArrowUpRightFromSquare className="size-3.5" />;
}

// A simple card for one project. Copy it, or turn the list below into data.
function ProjectCard({ title, description, image, imageAlt, link }: ProjectCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-black/10 transition-colors hover:border-accent">
      {/* Only show the image box if an image was passed in */}
      {image && (
        // aspect-video keeps every image the same 16:9 shape.
        // `relative` is required because <Image fill> fills its nearest positioned parent.
        <div className="relative aspect-video bg-black/5">
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill // stretch to fill the box above
            className="object-cover object-top" // crop instead of squishing, keeping the top visible
            sizes="(min-width: 768px) 50vw, 100vw" // half the screen on desktop (2 columns), full on phones
          />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-2 text-muted">{description}</p>

        {link && (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 font-bold text-accent hover:underline"
          >
            <LinkIcon href={link.href} />
            {link.label}
          </a>
        )}
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-32">
      <h2 className="text-4xl font-bold">Projects</h2>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {/* TODO: add your project cards here. To add a picture, put it in public/projects/ and pass its path: */}
        {/* <ProjectCard title="My App" description="..." image="/projects/my-app.png" imageAlt="Home screen of My App" /> */}
        <ProjectCard
          title="Referral Finder"
          description="A Chrome extension and React dashboard for job hunting. It finds LinkedIn referrals from your school for any job posting, groups saved jobs by role, duties, or skills using Gemini embeddings and KMeans, and tracks applications from Applied to Offer. Built with Flask, SQLite, React, and the Gemini API."
          image={resumeExtension}
          imageAlt="Referral Finder's Clusters tab, showing saved jobs grouped into Full Stack Cloud Engineering and General Software Engineering on a job map"
          link={{ label: "GitHub", href: "https://github.com/ppranav03/resume_extension" }}
        />
        <ProjectCard
          title="GMAP: Agentic Penetration Testing"
          image={gmap}
          description="A Virginia Tech capstone supported by Boeing: an AI agent that runs penetration tests. Built on LangGraph, it re-plans after each tool's output instead of following a fixed script, runs recon on its own, and asks for human approval before any exploit. Across 47 vulnerable Vulhub environments it found 110 vulnerabilities, with an 85% detection rate."
          link={{ label: "GitHub", href: "https://github.com/ameyadeshmukh/GMAP/tree/pranav-sprint5" }}
        />
        <ProjectCard
          title="Aviate.ai"
          image={aviateAI}
          description="A hackathon app, built in 36 hours, that identifies birds by their calls while you hike. It recognizes species from live audio with the BirdNET model (over 85% accuracy), lets you look back on and share past sightings, and saves every sighting to a database researchers can use to track bird populations. Built with React, Material UI, Flask, and MongoDB."
          link={{ label: "Devpost", href: "https://devpost.com/software/aviate-ai" }}
        />
        <ProjectCard
          title="Wine ML"
          image={wineML}
          description="A machine learning pipeline that predicts a wine's price from its Wine Enthusiast review. It combines one-hot encoded country, province, variety, region and points with 5,000 TF-IDF features from the review text, and trains on a log-transformed price. It compares Linear Regression, Ridge, Lasso and Gradient Boosting on RMSE, MAE and R² using scikit-learn pipelines, and plots the boosting error against training iterations."
          link={{ label: "GitHub", href: "https://github.com/ppranav03/wine_predictions_ml" }}
        />
      </div>

      {/* TODO: try making the cards fade up as you scroll (copy the .reveal pattern from About.tsx) */}
    </section>
  );
}
