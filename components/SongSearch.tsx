"use client";
import { useState } from "react";

interface SongSearchProps {
  accessToken: string;
}

export default function SongSearch({ accessToken }: SongSearchProps) {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<any[]>([]);
  const [audioFeatures, setAudioFeatures] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawResponse, setRawResponse] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      console.log("Raw Spotify API response:", data);
      setRawResponse(data); // Save raw response for debugging
      const items = data.tracks?.items || [];
      items.forEach((track: any) => {
        console.log("Track object:", track);
      });
      setTracks(items);
      // Fetch audio features for each track
      const features: Record<string, any> = {};
      await Promise.all(
        items.map(async (track: any) => {
          try {
            const res = await fetch(`/api/audio-features?id=${track.id}`);
            if (res.ok) {
              features[track.id] = await res.json();
            }
          } catch {error}{
            console.error("Error fetching audio features for track:", track.id, error);
            console.log("Track object causing error:", res.status, await res.text());
          }
        })
      );
      setAudioFeatures(features);
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
              {track.preview_url ? (
                <div style={{ marginTop: 8 }}>
                  <audio
                    controls
                    src={track.preview_url}
                    style={{ width: "100%" }}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ) : (
                <div style={{ color: "#aaa", fontSize: 13, marginTop: 8 }}>
                  No preview available
                </div>
              )}
              {audioFeatures[track.id] && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    background: "#f6f6f6",
                    padding: 8,
                    borderRadius: 6,
                  }}
                >
                  <strong>Audio Features:</strong>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    <li>
                      Danceability: {audioFeatures[track.id].danceability}
                    </li>
                    <li>Energy: {audioFeatures[track.id].energy}</li>
                    <li>Tempo: {audioFeatures[track.id].tempo}</li>
                    <li>Valence: {audioFeatures[track.id].valence}</li>
                  </ul>
                </div>
              )}
              <pre
                style={{
                  fontSize: 10,
                  background: "#f8f8f8",
                  marginTop: 8,
                  padding: 8,
                  borderRadius: 6,
                  overflowX: "auto",
                }}
              >
                {JSON.stringify(track, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
