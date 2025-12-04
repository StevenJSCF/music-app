// components/AudioChordRecorder.tsx
"use client";

import React, { useState, useRef } from "react";

/**
 * Simple 1s audio recorder that stores base64 WAV blobs with a label.
 * - Works in a secure context (https / localhost).
 * - Records 1 second per click (you can change durationMs).
 */
export default function AudioChordRecorder() {
  const [label, setLabel] = useState("G");
  const [samples, setSamples] = useState<{ label: string; audioDataUrl: string }[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const durationMs = 1000; // 1 second samples

  async function startRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("getUserMedia not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setRecording(true);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setRecording(false);
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        // convert to data URL for easier storage/transfer
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setSamples((prev) => [...prev, { label, audioDataUrl: dataUrl }]);
        };
        reader.readAsDataURL(blob);

        // stop tracks to release mic
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, durationMs);
    } catch (err) {
      console.error("Recording failed:", err);
      alert("Could not access microphone. Check permissions.");
    }
  }

  function downloadDataset() {
    const json = JSON.stringify(samples, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chord-audio-dataset.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function playSample(idx: number) {
    const item = samples[idx];
    if (!item) return;
    const audio = new Audio(item.audioDataUrl);
    audio.play();
  }

  return (
    <div style={{ color: "white", padding: 16 }}>
      <h3>🎤 Chord Audio Recorder</h3>

      <div style={{ marginBottom: 8 }}>
        <label>Label: </label>
        <select value={label} onChange={(e) => setLabel(e.target.value)} style={{ marginLeft: 8 }}>
          <option value="G">G</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button onClick={startRecording} disabled={recording}>
          {recording ? "Recording…" : "Record 1s sample"}
        </button>
        <button onClick={downloadDataset} style={{ marginLeft: 12 }}>
          Download Dataset ({samples.length})
        </button>
      </div>

      <div>
        <strong>Collected samples:</strong>
        <ul>
          {samples.map((s, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              {i + 1}. {s.label}{" "}
              <button onClick={() => playSample(i)} style={{ marginLeft: 8 }}>
                ▶︎ Play
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
