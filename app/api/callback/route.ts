const client_id = process.env.SPOTIFY_CLIENT_ID || "";
const client_secret = process.env.SPOTIFY_CLIENT_SECRET || "";
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI || "";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri,
    client_id,
    client_secret,
  });

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok) {
    return new Response(JSON.stringify(tokenData), { status: 400 });
  }

  // For now, just return the token data as JSON
  return new Response(JSON.stringify(tokenData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
