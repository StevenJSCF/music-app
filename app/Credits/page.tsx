import { ExternalLink, Music2, Heart } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '../components/NavBar';

export default function Credits() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-primary/10 p-6 rounded-full">
                  <Heart className="h-12 w-12 text-primary" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-balance">
              Credits & Acknowledgments
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              MusicLab is made possible by these amazing services and tools
            </p>
          </div>

          {/* Credits Cards */}
          <div className="space-y-4">
            {/* Spotify Card */}
            <Card className="p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Music2 className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Spotify</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Music streaming and profile data powered by the Spotify Web API
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://spotify.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Card>

            {/* GetSongBPM Card */}
            <Card className="p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <h2 className="text-xl font-semibold">GetSongBPM</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    BPM (beats per minute) data and music analysis provided by GetSongBPM
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://getsongbpm.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Card>
          </div>

          {/* Footer Message */}
          <div className="text-center pt-8">
            <p className="text-sm text-muted-foreground">
              Built with passion for music and technology
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
