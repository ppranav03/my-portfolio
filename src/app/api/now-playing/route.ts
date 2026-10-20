// Returns the song I'm listening to on Spotify (or the last one I played).
// Needs SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN in .env.local.

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

export type NowPlayingData =
  | { isPlaying: boolean; title: string; artist: string; albumArt: string | null; url: string }
  | { isPlaying: false; title: null };

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  external_urls: { spotify: string };
};

async function getAccessToken(): Promise<string> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error("Missing Spotify environment variables");
  }

  const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to refresh Spotify token (${res.status})`);
  }

  const { access_token } = await res.json();
  return access_token;
}

function spotifyGet(url: string, token: string) {
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

function formatTrack(track: SpotifyTrack, isPlaying: boolean): NowPlayingData {
  return {
    isPlaying,
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(", "),
    albumArt: track.album.images[0]?.url ?? null,
    url: track.external_urls.spotify,
  };
}

async function getCurrentTrack(token: string): Promise<NowPlayingData | null> {
  const res = await spotifyGet(NOW_PLAYING_URL, token);

  // Spotify sends 204 (no body) when nothing is playing
  if (res.status !== 200) return null;

  const data = await res.json();

  // Skip ads and podcasts, they don't have a normal track object
  if (data.currently_playing_type !== "track" || !data.item) return null;

  return formatTrack(data.item, data.is_playing);
}

async function getLastPlayedTrack(token: string): Promise<NowPlayingData | null> {
  const res = await spotifyGet(RECENTLY_PLAYED_URL, token);
  if (!res.ok) return null;

  const data = await res.json();
  const track = data.items?.[0]?.track;

  return track ? formatTrack(track, false) : null;
}

export async function GET() {
  try {
    const token = await getAccessToken();
    const track = (await getCurrentTrack(token)) ?? (await getLastPlayedTrack(token));

    return Response.json(track ?? { isPlaying: false, title: null });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Could not reach Spotify" }, { status: 500 });
  }
}
