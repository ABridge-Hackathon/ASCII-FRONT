"use client";

import { useRef, useEffect } from "react";

interface VideoCallProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isConnected: boolean;
}

export default function VideoCall({
  localStream,
  remoteStream,
  isConnected,
}: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {/* 원격 비디오 (전체 화면) */}
      {remoteStream ? (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white text-lg">
          {isConnected ? "상대방 연결 중..." : "매칭을 기다리는 중입니다"}
        </div>
      )}

      {/* 로컬 비디오 (작은 화면, 우측 상단) */}
      {localStream && (
        <div className="absolute top-4 right-4 w-32 h-24 md:w-48 md:h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover mirror"
          />
        </div>
      )}

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}
