"use server";

export async function getSongData(
  type: string,
  lookup: string,
  limit?: string
) {
  const apiKey = process.env.GET_SONG_BPM;
  if (!apiKey) throw new Error("Missing GETSONG_API_KEY");

  const base = "https://api.getsongbpm.com/search/";
  const params = new URLSearchParams({
    api_key: apiKey,
    type,
    lookup: lookup,
  });
  if (limit) params.append("limit", limit);

  const url = `${base}?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "(no body)");
    throw new Error(`External API error ${res.status}: ${text}`);
  }

  return await res.json();
}
