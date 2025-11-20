"use client"; 

import { useEffect, useRef } from 'react'

export default function TensorFlow() {

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    async function enableCamera(){
        try {
            // Ask browser for access camera 
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            }); 

            // If we have a <video> element, attach the stream to it
            if(videoRef.current){
                videoRef.current.srcObject = stream; 
                await videoRef.current.play(); 
            }
        } catch(err){
            console.error("Erro accessing camera", err); 
        }
    }
    enableCamera();
  }, []);

  return (
    <div>
        <h1>Guitar Vision</h1>
        <p>Step 2: show webcam feed</p>

        <video
            ref={videoRef}
            style={{ width: "640px", height: "480px", border: "2px solid white" }}        
        />
    </div>
  )
}

