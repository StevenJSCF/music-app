"use server";

export async function getSongData(type: string, lookup: string) {
  const apiKey = process.env.GETSONG_API_KEY;

  const url = `https://api.getsong.co/search/?type=${type}&lookup=${encodeURIComponent(
    lookup
  )}&api_key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("API error");

  return await res.json();
}
