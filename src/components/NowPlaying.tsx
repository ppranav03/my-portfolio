"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaSpotify } from "react-icons/fa6";
import type { NowPlayingData } from "@/app/api/now-playing/route";

// How often to ask for a new song (30 seconds)
const REFRESH_MS = 30_000;

export default function NowPlaying() {
  // null = still loading, or Spotify isn't set up yet
  const [song, setSong] = useState<NowPlayingData | null>(null);

  useEffect(() => {
    async function loadSong() {
      try {
        const response = await fetch("/api/now-playing");
        if (!response.ok) return; // keys missing or Spotify is down: show nothing
        setSong(await response.json());
      } catch {
        // Network hiccup: keep showing the last song we had
      }
    }

    loadSong(); // once right away...
    const timer = setInterval(loadSong, REFRESH_MS); // ...then every 30 seconds
    return () => clearInterval(timer); // stop when the component goes away
  }, []);

  // Nothing to show yet (or ever, if Spotify isn't connected)
  if (!song || !song.title) return null;

  return (
    <a
      href={song.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex max-w-xs items-center gap-3 rounded-full bg-white/10 py-2 pl-2 pr-4 text-sm backdrop-blur transition-colors hover:bg-white/20"
    >
      {song.albumArt ? (
        <Image src={song.albumArt} alt="" width={36} height={36} className="rounded-full" />
      ) : (
        <FaSpotify className="size-9 text-[#1db954]" />
      )}

      {/* min-w-0 + truncate cut long song names off with "..." instead of stretching the pill */}
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-xs text-white/60">
          {/* A pulsing green dot only while a song is actually playing */}
          {song.isPlaying && <span className="size-2 animate-pulse rounded-full bg-[#1db954]" />}
          {song.isPlaying ? "Now playing" : "Last played"}
        </p>
        <p className="truncate font-bold">{song.title}</p>
        <p className="truncate text-white/70">{song.artist}</p>
      </div>
    </a>
  );
}

// TODO: try a little animated equalizer instead of the pulsing dot
