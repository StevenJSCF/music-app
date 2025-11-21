"use client";

// Load MediaPipe Hands from CDN
const HANDS_SCRIPT = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
const CAMERA_SCRIPT =
  "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";

import { useEffect, useRef } from "react";

export default function TensorFlow() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Load MediaPipe scripts dynamically
    const loadScripts = async () => {
      await Promise.all([
        new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = HANDS_SCRIPT;
          script.onload = resolve;
          document.body.appendChild(script);
        }),
        new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = CAMERA_SCRIPT;
          script.onload = resolve;
          document.body.appendChild(script);
        }),
      ]);
    };

    // Real MediaPipe + camera logic
    async function enableCameraAndHands() {
      // @ts-ignore
      const hands = new window.Hands({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });

      hands.onResults((results: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          for (let p of landmarks) {
            ctx.beginPath();
            ctx.arc(p.x * canvas.width, p.y * canvas.height, 6, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
          }
        }
      });

      // Start camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // @ts-ignore
      const Camera = window.Camera;

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
      });

      camera.start();
    }

    // 3️⃣ Everything runs here, IN ORDER
    async function main() {
      await loadScripts(); // ← load MediaPipe first
      await enableCameraAndHands(); // ← then run tracking
    }

    main(); // ★ THIS IS WHAT YOU WERE MISSING ★
  }, []);

  return (
    <div style={{ position: "relative", width: 640, height: 480 }}>
      <video
        ref={videoRef}
        style={{
          width: 640,
          height: 480,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
