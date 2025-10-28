"use client";
import { useState } from "react";

interface SongSearchProps {
  accessToken: string;
}

export default function SongSearch({ accessToken }: SongSearchProps) {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setTracks(data.tracks?.items || []);
    } catch (err) {
      setError("Failed to search songs.");
    }
    setLoading(false);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Search for a song"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #ddd",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#1DB954",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
          }}
          disabled={loading || !query.trim()}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && (
        <div style={{ color: "#c00", fontSize: 13, marginTop: 6 }}>{error}</div>
      )}
      {tracks.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tracks.map((track) => (
            <li
              key={track.id}
              style={{
                marginBottom: 12,
                padding: 8,
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ fontWeight: "bold" }}>{track.name}</div>
              <div style={{ color: "#666", fontSize: 14 }}>
                {track.artists.map((a: any) => a.name).join(", ")}
              </div>
              {track.album?.images?.[0]?.url && (
                <img
                  src={track.album.images[0].url}
                  alt="album"
                  width={60}
                  style={{ borderRadius: 8, marginTop: 6 }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
