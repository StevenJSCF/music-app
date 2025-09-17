import type { NextApiRequest, NextApiResponse } from "next";

const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
].join(" ");

export async function GET(request: Request) {
  const client_id = process.env.SPOTIFY_CLIENT_ID || "";
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI || "";
  const state = Math.random().toString(36).slice(2, 12);

  const params = new URLSearchParams({
    response_type: "code",
    client_id,
    scope: scopes,
    redirect_uri,
    state,
  });

  return Response.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
}