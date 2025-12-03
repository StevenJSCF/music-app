import { NextRequest } from "next/server";
import { getAudioFeatures } from "@/lib/action/getAudioFeatures";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const accessToken = req.cookies.get("spotify_access_token")?.value;

  console.log("Fetching audio features for track ID:", id);
  console.log("Using access token:", accessToken ? "present" : "missing");

  try {
    const data = await getAudioFeatures(id || "", accessToken || "");
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
