// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const accessToken = req.cookies.get("spotify_access_token")?.value;

  if (!q) {
    return NextResponse.json(
      { error: "Missing search query" },
      { status: 400 }
    );
  }
  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      q
    )}&type=track&limit=10`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const data = await res.json();
  return NextResponse.json(data);
}
