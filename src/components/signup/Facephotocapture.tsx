"use client";

import { useEffect, useRef, useState } from "react";

interface FacePhotoCaptureProps {
  onCapture: (photoBlob: Blob) => void;
  onBack: () => void;
}

export default function FacePhotoCapture({
  onCapture,
  onBack,
}: FacePhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // 전면 카메라 스트림 시작
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" }, // 전면 카메라
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

    // 클린업
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || isProcessing) return;

    setIsProcessing(true);

    // Canvas에 현재 비디오 프레임 캡처
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);

      // Canvas를 Blob으로 변환
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }

          // 촬영된 사진 전달
          onCapture(blob);
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
    <div className="relative w-[360px] h-[800px] bg-black mx-auto overflow-hidden">
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
      <nav className="absolute top-10 left-0 right-0 h-14 bg-black flex justify-between items-center px-1 z-10">
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
        <span className="font-semibold text-lg text-white tracking-[-0.03em]">
          얼굴 사진 촬영
        </span>
        <div className="w-12 h-12" />
      </nav>

      {/* Title */}
      <h1 className="absolute left-4 top-[139px] font-semibold text-[28px] leading-[130%] tracking-[-0.03em] text-white z-10">
        얼굴을 촬영할게요
      </h1>

      {/* Description */}
      <p className="absolute left-4 top-[178px] w-[246px] font-medium text-lg leading-[140%] tracking-[-0.03em] text-white z-10">
        나를 보여줄 수 있는 사진이 필요해요
      </p>

      {/* Face Guide Oval */}
      <div className="absolute left-[37px] top-[271px] w-[286px] h-[328px] border-4 border-white rounded-[50%] z-10" />

      {/* Face Features Guide (Eyes and Smile) */}
      <div className="absolute left-[37px] top-[271px] w-[286px] h-[328px] z-10">
        {/* Left Eye */}
        <div className="absolute w-[21px] h-[38px] left-[97px] top-[117px] bg-white/50 rounded-full" />
        {/* Right Eye */}
        <div className="absolute w-[21px] h-[38px] left-[168px] top-[117px] bg-white/50 rounded-full" />
        {/* Smile */}
        <div
          className="absolute w-[82px] h-[28px] left-[102px] top-[189px] border-[10px] border-white/50 rounded-b-full"
          style={{ transform: "rotate(-1.82deg)" }}
        />
      </div>

      {/* Instruction Text */}
      <p className="absolute left-1/2 -translate-x-1/2 top-[613px] font-semibold text-lg text-white tracking-[-0.03em] text-center z-10">
        편안하게 미소지어 주세요!
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
