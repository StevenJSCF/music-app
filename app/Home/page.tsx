// pages/spotify.tsx
"use client"

import { Music2, Sparkles, LogOut, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function Home() {
  const features = [
    {
      title: "Realtime Chord Detection",
      desc: "Use your webcam to detect hand shapes and map them to guitar chords in realtime.",
      icon: <Music2 size={20} />,
    },
    {
      title: "Song Search",
      desc: "Find songs in your library or on Spotify; import and analyze audio features.",
      icon: <Sparkles size={20} />,
    },
    {
      title: "Export / Download",
      desc: "Save recorded training samples or download datasets for offline training.",
      icon: <RotateCw size={20} />,
    },
    {
      title: "External Integrations",
      desc: "Connect to external APIs and services to enrich song metadata and features.",
      icon: <Music2 size={20} />,
    },
    {
      title: "Privacy-first",
      desc: "All model inference runs in your browser; we don't send raw video to servers.",
      icon: <LogOut size={20} />,
    },
    {
      title: "Quick Samples",
      desc: "Capture and label training samples quickly to improve recognition quality.",
      icon: <Sparkles size={20} />,
    },
  ];

 return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Features</h1>
        <p className="mt-2 text-sm text-slate-600">
          What this site offers — tap a card to learn more or export data.
        </p>
      </header>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {features.map((f, i) => (
          <Card
            key={i}
            tabIndex={0}
            onClick={() => console.log("clicked", f.title)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                console.log("activated by keyboard", f.title);
              }
            }}
            className="
              p-4
              hover:shadow-lg
              transition-shadow
              duration-150
              ease-in-out
              cursor-pointer
              flex
              flex-col
              justify-between
              min-h-[160px]
            "
            role="article"
            aria-label={f.title}
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex-shrink-0
                  bg-slate-100
                  rounded-lg
                  p-2
                  inline-flex
                  items-center
                  justify-center
                "
              >
                {f.icon}
              </div>

              <div>
                <h3 className="text-lg font-medium leading-6">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">More details</span>
              <Button variant="ghost" size="sm" className="px-2 py-1" aria-label={`Learn more about ${f.title}`}>
                Explore
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
