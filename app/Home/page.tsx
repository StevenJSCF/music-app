// pages/spotify.tsx

import { cookies } from "next/headers";
import ProfileCard from "../components/ProfileCard";
import SongSearch from "../components/SongSearch";

async function getProfile(accessToken: string) {
  const profileRes = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 0 },
  });
  if (!profileRes.ok) return null;
  return profileRes.json();
}

export default async function Home() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token")?.value;

  if (!accessToken) {
    return (
      <main
        style={{
          padding: 32,
          maxWidth: 400,
          margin: "40px auto",
          textAlign: "center",
        }}
      >
        <h2>Not logged in</h2>
        <a
          href="/api/login"
          style={{
            color: "#1DB954",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Login with Spotify
        </a>
      </main>
    );
  }

  const profile = await getProfile(accessToken);
  if (!profile) {
    return (
      <main
        style={{
          padding: 32,
          maxWidth: 400,
          margin: "40px auto",
          textAlign: "center",
        }}
      >
        <h2>Session expired</h2>
        <p>
          <a
            href="/api/refresh"
            style={{
              color: "#1DB954",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Refresh token
          </a>{" "}
          (click once, then reload)
        </p>
      </main>
    );
  }

  return (
    <div>
      <ProfileCard profile={profile} />
      <SongSearch accessToken={accessToken} />
      <div style={{ marginTop: 12, textAlign: "center" }}>
        <a
          href="/api/login"
          style={{
            color: "#1DB954",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Re-login
        </a>
        <span style={{ margin: "0 8px" }}>·</span>
        <a
          href="/api/refresh"
          style={{
            color: "#1DB954",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Refresh token
        </a>
      </div>
    </div>
  );
}
