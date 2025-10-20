// app/spotify/page.tsx
import { cookies } from "next/headers";
import SpotifyClient from "./SpotifyClient";

export default async function SpotifyPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  if (!accessToken) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Not logged in</h2>
        <a href="/api/login">Login with Spotify</a>
      </div>
    );
  }

  const profileRes = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 0 },
  });

  if (profileRes.status === 401) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Session expired</h2>
        <p>
          <a href="/api/refresh">Refresh token</a> (click once, then reload).
        </p>
      </div>
    );
  }

  const profile = await profileRes.json();

  return (
    <SpotifyClient
      accessToken={accessToken}
      profile={profile}
    />
  );
}
