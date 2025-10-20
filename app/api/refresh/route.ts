// app/api/refresh/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// reuse serializer
function serializeCookie(name: string, val: string, opts: Record<string, any> = {}) {
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

export async function GET() {
  const cookieStore = cookies();
  const refresh_token = (await cookieStore).get('spotify_refresh_token')?.value;
  if (!refresh_token) return NextResponse.json({ error: 'No refresh token' }, { status: 400 });

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token
  });

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  });

  if (!tokenRes.ok) {
    const txt = await tokenRes.text();
    return NextResponse.json({ error: 'Failed to refresh token', details: txt }, { status: 500 });
  }

  const { access_token, expires_in } = await tokenRes.json();

  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'Lax' as const
  };

  const accessCookie = serializeCookie('spotify_access_token', access_token, {
    ...cookieOpts,
    maxAge: expires_in
  });

  const res = NextResponse.json({ ok: true });
  res.headers.append('Set-Cookie', accessCookie);
  return res;
}
