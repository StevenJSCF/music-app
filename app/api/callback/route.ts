// app/api/callback/route.ts
import { NextResponse } from "next/server";

// tiny cookie serializer to avoid external deps
function serializeCookie(
  name: string,
  val: string,
  opts: Record<string, any> = {}
) {
  const enc = encodeURIComponent;
  let cookie = `${name}=${enc(val)}`;
  if (opts.maxAge) cookie += `; Max-Age=${opts.maxAge}`;
  if (opts.domain) cookie += `; Domain=${opts.domain}`;
  if (opts.path) cookie += `; Path=${opts.path}`;
  if (opts.expires) cookie += `; Expires=${opts.expires.toUTCString()}`;
  if (opts.httpOnly) cookie += `; HttpOnly`;
  if (opts.secure) cookie += `; Secure`;
  if (opts.sameSite) cookie += `; SameSite=${opts.sameSite}`;
  return cookie;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  if (error) return NextResponse.json({ error }, { status: 400 });
  if (!code)
    return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI!;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri,
  });

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!tokenRes.ok) {
    const txt = await tokenRes.text();
    return NextResponse.json(
      { error: "Token exchange failed", details: txt },
      { status: 500 }
    );
  }

  const { access_token, refresh_token, expires_in } = await tokenRes.json();

  // cookie params - adjust secure for prod
  const cookieOpts = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production', // Removed for local development
    path: "/",
    sameSite: "Lax" as const,
  };

  const accessCookie = serializeCookie("spotify_access_token", access_token, {
    ...cookieOpts,
    maxAge: expires_in,
  });

  const refreshCookie = serializeCookie(
    "spotify_refresh_token",
    refresh_token,
    {
      ...cookieOpts,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    }
  );

  const res = NextResponse.redirect(new URL("/spotify", request.url));
  // Set both cookies
  res.headers.append("Set-Cookie", accessCookie);
  res.headers.append("Set-Cookie", refreshCookie);

  return res;
}
