// app/spotify/SpotifyClient.tsx
"use client";

import { useState } from "react";

interface SpotifyClientProps {
  accessToken: string;
  profile: any;
}

export default function SpotifyClient({ accessToken, profile }: SpotifyClientProps) {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setTracks(data.tracks?.items || []);
    setLoading(false);
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Welcome, {profile.display_name ?? profile.id}</h1>
      <p>Email: {profile.email}</p>

      {profile.images?.[0]?.url && (
        <img
          src={profile.images[0].url}
          width={120}
          height={120}
          alt="avatar"
        />
      )}

      <div>
        <form onSubmit={handleSearch}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a song"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        <ul>
          {tracks.map((track) => (
            <li key={track.id}>
              {track.name} by {track.artists.map((a: any) => a.name).join(", ")}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 12 }}>
        <a href="/api/login">Re-login</a> ·{" "}
        <a href="/api/refresh">Refresh token</a>
      </div>
    </main>
  );
}
