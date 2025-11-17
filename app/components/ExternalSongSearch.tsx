"use client";
import { useState } from "react";

export default function ExternalSongSearch() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("song");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const url = `https://api.getsong.co/search/?api_key=${process.env.NEXT_PUBLIC_GET_SONG_BPM}&type=${type}&lookup=${encodeURIComponent(query)}&limit=10`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setError("Failed to fetch data: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <form onSubmit={handleSearch} className="flex flex-col gap-2">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a song"
          className="border p-2"
        />

        <button className="bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </form>

      {loading && <p>Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {results && (
        <pre className="bg-gray-800 text-white p-3 mt-3 overflow-x-auto">
          {JSON.stringify(results, null, 2)}
        </pre>
      )}
    </div>
  );
}
