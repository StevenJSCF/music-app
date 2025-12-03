export async function searchSpotifyTracks(query: string, accessToken: string) {
  if (!query || !accessToken) {
    throw new Error("Missing query or not authenticated");
  }
  const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    query
  )}&type=track&limit=10`;
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return res.json();
}
