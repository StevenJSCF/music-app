import { Music2, Info, Music3, Disc3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Music2 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">
            Music<span className="text-primary">Lab</span>
          </h1>
        </Link>
        
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/Bpm">
              <Disc3 className="h-4 w-4" />
              Bpm
            </Link>
          </Button>   
          <Button variant="ghost" size="sm" asChild>
            <Link href="/TensorFlow">
              <Music3 className="h-4 w-4" />
              Chords Recognition
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/Credits">
              <Info className="h-4 w-4" />
              Credits
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
