export async function getAudioFeatures(id: string, accessToken: string) {
  if (!id || !accessToken) {
    throw new Error("Missing track id or not authenticated");
  }
  const apiUrl = `https://api.spotify.com/v1/audio-features/${id}`;
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
