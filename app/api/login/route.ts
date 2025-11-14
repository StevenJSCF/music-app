// app/api/login/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const client_id = process.env.SPOTIFY_CLIENT_ID!;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI!;
  const scopes = process.env.NEXT_PUBLIC_SPOTIFY_SCOPES ?? '';

  const state = Math.random().toString(36).slice(2, 15);

  const params = new URLSearchParams({
    client_id,
    response_type: 'code',
    redirect_uri,
    scope: decodeURIComponent(scopes),
    state,
    show_dialog: 'true'
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}