"use client";
import { useState } from "react";

export default function ExternalSongSearch() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("track");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

async function handleSearch(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError("");
  setResults(null);

  try {
    const res = await fetch(
      `/api/song?type=${type}&lookup=${encodeURIComponent(query)}`
    );

    if (!res.ok) throw new Error("API error");

    const data = await res.json();
    setResults(data);
  } catch (err: any) {
    setError("Failed to fetch song data");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="w-full max-w-md mx-auto p-4">
      <form onSubmit={handleSearch} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="track">Track</option>
            <option value="artist">Artist</option>
            <option value="album">Album</option>
          </select>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a song, artist, or album"
            className="flex-1 border rounded px-2 py-1"
            required
          />
          <button
            type="submit"
            className="px-4 py-1 bg-primary text-white rounded"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {results && (
        <pre className="mt-4 bg-muted p-2 rounded text-xs overflow-x-auto">
          {JSON.stringify(results, null, 2)}
        </pre>
      )}
    </div>
  );
}
