"use client";
import { useState } from "react";

export default function ExternalSongSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

async function handleSearch(e: React.FormEvent) {
  e.preventDefault();

  const cleaned = query.trim();
  if (!cleaned) {
    setError("Please type something.");
    return;
  }

  setLoading(true);
  setError("");
  setResults([]);

  try {
    const lookup = `song:${encodeURIComponent(cleaned)}`;

    const url = `https://api.getsong.co/search/?api_key=${
      process.env.NEXT_PUBLIC_GET_SONG_BPM
    }&type=song&lookup=${lookup}&limit=10`;

    console.log("API URL:", url);
    console.log("Final lookup:", lookup);

    const res = await fetch(url);
    const data = await res.json();

    console.log("API RESPONSE:", data);

    const arr = Array.isArray(data.search) ? data.search : [];
    setResults(arr);
  } catch (err) {
    setError("Failed to fetch data");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="w-full max-w-md mx-auto p-4">
      <form onSubmit={handleSearch} className="flex flex-col gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a song..."
          className="border p-2 rounded"
        />
        <button className="bg-blue-600 text-white p-2 rounded">
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && results.length === 0 && (
        <p className="text-gray-400">No songs found.</p>
      )}

      <div className="flex flex-col gap-4 mt-4">
        {results.map((item, idx) => (
          <div
            key={idx}
            className="border p-4 rounded bg-gray-900 text-white shadow"
          >
            <h2 className="text-xl font-bold">{item.title}</h2>
            <p><strong>Artist:</strong> {item.artist?.name}</p>
            <p><strong>BPM:</strong> {item.tempo}</p>
            <p><strong>Key:</strong> {item.key_of}</p>
            <a href={item.uri} target="_blank" className="text-blue-400 underline">
              View Song →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
