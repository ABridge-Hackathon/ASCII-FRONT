"use client";

import { useState, useEffect, useRef } from "react";
import AudioVisualizer from "@/components/develop/AudioVisualizer";

type CallState = "idle" | "calling" | "connected" | "ended";

export default function VideoChat() {
  const [callState, setCallState] = useState<CallState>("idle");
  const [showDebug, setShowDebug] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  // 로컬 스트림 시작
  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("미디어 접근 오류:", error);
      alert("카메라/마이크 접근에 실패했습니다.");
    }
  };

  // 통화 시작
  const handleStartCall = async () => {
    await startLocalStream();
    setCallState("calling");

    // TODO: WebSocket으로 매칭 요청
    // 시뮬레이션: 2초 후 연결됨
    setTimeout(() => {
      setCallState("connected");
      // TODO: 실제로는 상대방 스트림을 받아옴
      simulateRemoteStream();
    }, 2000);
  };

  // 시뮬레이션: 원격 스트림 (실제로는 WebRTC로 받아옴)
  const simulateRemoteStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true, // 오디오 활성화 (디버그 모드 테스트용)
      });
      remoteStreamRef.current = stream;
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("원격 스트림 시뮬레이션 오류:", error);
    }
  };

  // 통화 종료
  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    setCallState("ended");
  };

  // 다음 사람으로 넘어가기
  const handleNext = async () => {
    setIsSliding(true);

    // 슬라이딩 애니메이션 후 새로운 매칭
    setTimeout(async () => {
      if (remoteStreamRef.current) {
        remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      setCallState("calling");

      // TODO: WebSocket으로 새로운 매칭 요청
      setTimeout(() => {
        setCallState("connected");
        simulateRemoteStream();
        setIsSliding(false);
      }, 1000);
    }, 500);
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (remoteStreamRef.current) {
        remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 디버그 토글 버튼 */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="absolute top-4 left-4 z-50 bg-gray-800 text-white px-3 py-1 rounded text-xs opacity-50 hover:opacity-100"
      >
        {showDebug ? "디버그 숨기기" : "디버그 보기"}
      </button>

      {/* 디버그 패널 */}
      {showDebug && (
        <div className="absolute top-16 left-4 z-50 bg-gray-900 bg-opacity-95 p-4 rounded-lg max-w-sm">
          <AudioVisualizer
            localStream={localStreamRef.current}
            remoteStream={remoteStreamRef.current}
          />
        </div>
      )}

      {/* 시작 화면 */}
      {callState === "idle" && (
        <div className="flex items-center justify-center h-full">
          <button
            onClick={handleStartCall}
            className="bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold py-6 px-12 rounded-full transition-all transform hover:scale-105 shadow-2xl"
          >
            🎥 통화 시작
          </button>
        </div>
      )}

      {/* 매칭 중 */}
      {callState === "calling" && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white text-xl">매칭 중...</p>
          </div>
        </div>
      )}

      {/* 통화 중 */}
      {(callState === "connected" || callState === "ended") && (
        <div className="relative w-full h-full">
          {/* 상대방 영상 (전체 화면) */}
          <div
            className={`absolute inset-0 transition-transform duration-500 ${
              isSliding ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>

          {/* 내 영상 (작은 화면, 오른쪽 상단) */}
          <div className="absolute top-4 right-4 w-32 h-40 md:w-40 md:h-52 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700 z-40">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          </div>

          {/* 컨트롤 버튼들 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-40">
            {callState === "connected" && (
              <button
                onClick={handleEndCall}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-2xl"
              >
                ❌ 통화 종료
              </button>
            )}

            {callState === "ended" && (
              <button
                onClick={handleNext}
                disabled={isSliding}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-2xl disabled:cursor-not-allowed"
              >
                ➡️ 다음
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
