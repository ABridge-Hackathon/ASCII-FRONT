"use client";

import { useEffect, useRef, useState } from "react";

interface IDCaptureProps {
  onNext: (imageBlob: Blob) => void;
  onBack: () => void;
}

export default function IDCapture({ onNext, onBack }: IDCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("카메라 접근 오류:", error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || isProcessing) return;

    setIsProcessing(true);

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }

          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }

          onNext(blob);
        },
        "image/jpeg",
        0.95,
      );
    }
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onBack();
  };

  return (
    <div className="relative w-full max-w-[500px] min-h-screen bg-black mx-auto overflow-hidden">
      {/* Camera Video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-10 flex justify-between items-center px-4 bg-black z-10">
        <div className="text-sm text-white">9:30</div>
        <div className="flex gap-1">
          <div className="w-4 h-4" />
          <div className="w-4 h-4" />
          <div className="w-4 h-4" />
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="absolute top-10 left-0 right-0 h-14 bg-[#111111] flex justify-between items-center px-1 z-10">
        <button
          onClick={handleClose}
          className="w-12 h-12 flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="font-semibold text-base sm:text-lg text-white tracking-[-0.03em]">
          신분증 촬영
        </span>
        <div className="w-12 h-12" />
      </nav>

      {/* Title */}
      <h1 className="absolute left-4 right-4 top-[124px] sm:top-[148px] font-semibold text-xl sm:text-2xl leading-[130%] tracking-[-0.03em] text-white z-10">
        사각형에
        <br />
        신분증을 놓아주세요
      </h1>

      {/* Capture Frame */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[220px] sm:top-[268px] w-[90%] max-w-[328px] aspect-[328/206] z-10">
        <div className="w-full h-full border-4 border-white rounded-[10px]" />
      </div>

      {/* Instruction Text */}
      <p className="absolute left-1/2 -translate-x-1/2 bottom-[140px] sm:bottom-[187px] font-semibold text-base sm:text-lg text-white tracking-[-0.03em] text-center z-10 px-4">
        너무 밝으면 촬영이 잘 안돼요
      </p>

      {/* Capture Button */}
      <button
        onClick={handleCapture}
        disabled={isProcessing}
        className={`absolute left-1/2 -translate-x-1/2 bottom-12 w-16 h-16 rounded-full border-4 border-white/50 z-10 ${
          isProcessing ? "bg-gray-400" : "bg-white"
        }`}
      >
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#FF6E00] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>
    </div>
  );
}
