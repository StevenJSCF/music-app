// pages/spotify.tsx

import { cookies } from "next/headers";

export default async function SpotifyPage() {
  let profile = null;
  let error = "";
  const cookieStore = await cookies();
  const access_token = cookieStore.get("spotify_access_token")?.value;

  if (!access_token) {
    return (
      <div>
        Not logged in after login. <a href="/api/login">Login with Spotify</a>
      </div>
    );
  }

  try {
    const profileRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (profileRes.status === 401) {
      // token expired — you can redirect the client to call /api/refresh or call refresh here
      return (
        <div>
          Not logged in it failed. <a href="/api/login">Login with Spotify</a>
        </div>
      );
    }

    if (!profileRes.ok) {
      const txt = await profileRes.text();
      error = `Spotify API error: ${txt}`;
    } else {
      profile = await profileRes.json();
    }
  } catch (e) {
    error = "Failed to fetch profile.";
  }

  if (error) return <div>Error: {error}</div>;
  if (!profile) return null;

  return (
    <div>
      <h1>Welcome, {profile.display_name}</h1>
      <p>Email: {profile.email}</p>
      {profile.images?.[0]?.url && (
        <img src={profile.images[0].url} alt="avatar" width={120} />
      )}
    </div>
  );
}
