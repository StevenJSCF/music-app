"use client";
import * as tf from "@tensorflow/tfjs";

// Load MediaPipe Hands from CDN
const HANDS_SCRIPT = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
const CAMERA_SCRIPT =
  "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";

import { useEffect, useRef, useState } from "react";

/**
 * Normalize landmarks so ML training learns relative hand shape,
 * not position inside the frame.
 */
function normalizeLandmarks(landmarks: any[]) {
  // Use the wrist point as the anchor (landmark index 0)
  const baseX = landmarks[0].x;
  const baseY = landmarks[0].y;
  const baseZ = landmarks[0].z;

  const normalized: number[] = [];

  for (const p of landmarks) {
    normalized.push(p.x - baseX, p.y - baseY, p.z - baseZ);
  }

  return normalized; // 63 numbers
}

export default function TensorFlow() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // This will hold the latest feature vector (63 numbers)
  const lastVectorRef = useRef<number[] | null>(null);
  const samplesRef = useRef<{ label: string; landmarks: number[] }[]>([]);
  const modelRef = useRef<tf.LayersModel | null>(null);

  const [label, setLabel] = useState("G");

  function captureSample() {
    if (!lastVectorRef.current) {
      console.warn("No landmarks available yet.");
      return;
    }

    samplesRef.current.push({
      label,
      landmarks: lastVectorRef.current,
    });

    console.log(
      `Saved sample #${samplesRef.current.length} for chord ${label}`
    );
  }

  function downloadDataset() {
    if (samplesRef.current.length === 0) {
      alert("No samples collected yet!");
      return;
    }

    const blob = new Blob([JSON.stringify(samplesRef.current, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chord-dataset.json";
    a.click();
    URL.revokeObjectURL(url);
  }

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
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        // If no hand detected this frame, skip
        if (
          !results.multiHandLandmarks ||
          results.multiHandLandmarks.length === 0
        ) {
          lastVectorRef.current = null;
          return;
        }

        const landmarks = results.multiHandLandmarks[0];

        if (results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          for (let p of landmarks) {
            ctx.beginPath();
            ctx.arc(p.x * canvas.width, p.y * canvas.height, 6, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
          }
        }

        // Extract normalized vector for ML
        const vector = normalizeLandmarks(landmarks);
        lastVectorRef.current = vector;

        // shape: [1, 63]
        const input = tf.tensor2d([vector]);

        // make sure the model is loaded
        if (!modelRef.current) return;

        // run prediction
        const prediction = modelRef.current.predict(input) as
          | tf.Tensor
          | tf.Tensor[];

        // normalize tensor output
        const predictionTensor = Array.isArray(prediction)
          ? prediction[0]
          : prediction;

        // highest probability index
        const chordIndex = predictionTensor.argMax(-1).dataSync()[0];

        // map index → chord
        const chordMap = ["G", "C", "D", "Em"];
        const predictedChord = chordMap[chordIndex];

        console.log("Predicted chord:", predictedChord);

        // dispose tensors
        input.dispose();
        if (Array.isArray(prediction)) {
          prediction.forEach((t) => t.dispose());
        } else {
          prediction.dispose();
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

      modelRef.current = await tf.loadLayersModel("/model/model.json");
      console.log("Model loaded!");
    }

    // Everything runs here, IN ORDER
    async function main() {
      await loadScripts(); //load MediaPipe first
      await enableCameraAndHands(); //then run tracking
    }

    main();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ color: "white", marginRight: 8 }}>Chord:</label>
        <select
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={{ padding: 4 }}
        >
          <option value="G">G</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="Em">Em</option>
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button
          onClick={captureSample}
          style={{ padding: "6px 12px", cursor: "pointer" }}
        >
          Capture Sample
        </button>
      </div>

      <div style={{ marginBottom: 12, marginLeft: 12 }}>
        Samples: {samplesRef.current.length}
      </div>

      <button
        onClick={downloadDataset}
        style={{
          padding: "6px 12px",
          marginBottom: 12,
          cursor: "pointer",
          marginLeft: 8,
        }}
      >
        Download Dataset
      </button>

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
    </div>
  );
}
