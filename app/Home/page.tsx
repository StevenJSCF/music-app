// pages/spotify.tsx

import { cookies } from "next/headers";
import { Music2, Sparkles, LogOut, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6 border-2">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-primary/10 p-6 rounded-full">
                <Music2 className="h-16 w-16 text-primary" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-balance">
              Welcome to <span className="text-primary">MusicLab</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover, explore, and connect with your music
            </p>
          </div>
          <div className="space-y-4 pt-4">
            <p className="text-lg text-muted-foreground">
              Spotify login is temporarily disabled.
            </p>
          </div>
        </Card>
      </main>
    );
  }

  const profile = await getProfile(accessToken);
  if (!profile) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6 border-2">
          <div className="flex justify-center">
            <div className="bg-destructive/10 p-6 rounded-full">
              <RotateCw className="h-16 w-16 text-destructive" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Session Expired</h2>
            <p className="text-muted-foreground">
              Your connection needs to be refreshed
            </p>
          </div>

          <Button
            asChild
            size="lg"
            variant="default"
            className="w-full text-lg h-12"
          >
            <a href="/api/refresh">
              <RotateCw className="mr-2 h-5 w-5" />
              Refresh Connection
            </a>
          </Button>

          <p className="text-xs text-muted-foreground">
            Click once, then reload the page
          </p>
        </Card>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        <ProfileCard profile={profile} />
        <SongSearch accessToken={accessToken} />
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by Spotify · Made with MusicLab</p>
        </div>
      </footer>
    </div>
  );
}
