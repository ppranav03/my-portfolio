import type { Metadata } from "next";
import { Arvo } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import "./globals.css";

// Arvo is not a variable font, so we must list the weights we want.
// `variable` exposes the font as a CSS variable (--font-arvo) that
// globals.css hands to Tailwind as the default sans font.
const arvo = Arvo({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-arvo",
  display: "swap",
});

export const metadata: Metadata = {
  // TODO: put your real name and a one-line description here
  title: "Pranav Patel",
  description: "Portfolio of Your Name, aspiring software engineer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${arvo.variable} antialiased`}>
      <body className="bg-background font-sans text-foreground">
        <SmoothScroll>
          {/* The navbar lives in the layout, so every page gets it */}
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
