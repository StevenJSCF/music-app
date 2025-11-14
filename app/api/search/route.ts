import { NextRequest } from "next/server";
import { searchSpotifyTracks } from "@/app/lib/action/searchSpotify";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const accessToken = req.cookies.get("spotify_access_token")?.value;

  try {
    const data = await searchSpotifyTracks(query || "", accessToken || "");
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
