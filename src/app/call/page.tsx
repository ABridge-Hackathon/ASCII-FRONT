"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useMockWebRTC } from "@/hooks/useMockWebrtc";
import AudioVisualizer from "@/components/develop/AudioVisualizer";
import { Gender } from "@/types/webrtc";
import { AuthManager } from "@/utils/auth";
import CallEndScreen from "@/components/CallEndScreen";
import FriendAddedChoiceScreen from "@/components/FriendAddedChoiceScreen";
import NextCallChoiceScreen from "@/components/NextCallChoiceScreen";

const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_BASE_URL || "ws://localhost:8000";
const USE_MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

type AppState =
  | "matching"
  | "connected"
  | "call-ended"
  | "friend-added"
  | "next-choice";

function CallPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 클라이언트 사이드 마운트 체크
  const [mounted, setMounted] = useState(false);

  // URL에서 파라미터 가져오기
  const genderParam = searchParams.get("gender") as Gender | null;
  const locationParam = searchParams.get("location") === "true";

  const [showDebug, setShowDebug] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [selectedGender] = useState<Gender>(genderParam || "F");
  const [includeLocation] = useState(locationParam);
  const [appState, setAppState] = useState<AppState>("matching");
  const [callDuration, setCallDuration] = useState("00:00");
  const [callStartTime, setCallStartTime] = useState<number | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoSmallRef = useRef<HTMLVideoElement>(null);

  const webRTCHook = USE_MOCK_MODE
    ? useMockWebRTC()
    : useWebRTC(WS_BASE_URL, {
        getAccessToken: () => AuthManager.getAccessToken(),
      });

  const {
    localStream,
    remoteStream,
    callState: webRTCState,
    wsConnected,
    error,
    startMatching,
    cancelMatching,
    endCall,
    clearError,
  } = webRTCHook;

  // 초기 매칭 시작 - 한 번만 실행되도록 수정
  const hasStartedMatching = useRef(false);

  // 클라이언트 사이드 마운트
  useEffect(() => {
    setMounted(true);
  }, []);

  // 초기 매칭 시작 (클라이언트에서만)
  useEffect(() => {
    if (!mounted) return;

    // Mock 모드가 아닐 때만 자동으로 매칭 시작
    if (!USE_MOCK_MODE && !hasStartedMatching.current) {
      console.log("🚀 페이지 로드 완료, 자동 매칭 시작");
      hasStartedMatching.current = true;
      startMatching(selectedGender, includeLocation);
    }
  }, [mounted, selectedGender, includeLocation, startMatching]);

  // 통화 시간 계산
  useEffect(() => {
    if (webRTCState.isConnected && !callStartTime) {
      setCallStartTime(Date.now());
    }

    if (webRTCState.isConnected && callStartTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - callStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        setCallDuration(
          `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      }, 1000);

      return () => clearInterval(interval);
    }

    if (!webRTCState.isConnected) {
      setCallStartTime(null);
    }
  }, [webRTCState.isConnected, callStartTime]);

  // 앱 상태 동기화
  useEffect(() => {
    if (webRTCState.isConnected) {
      setAppState("connected");
    } else if (webRTCState.isMatching) {
      setAppState("matching");
    }
  }, [webRTCState.isConnected, webRTCState.isMatching]);

  // 로컬 스트림 연결
  useEffect(() => {
    if (!localStream) return;

    // 매칭 화면 (큰 비디오)
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }

    // 통화 중 화면 (작은 비디오)
    if (localVideoSmallRef.current) {
      localVideoSmallRef.current.srcObject = localStream;
    }
  }, [localStream, appState]);

  // 리모트 스트림 연결
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      alert(error);
      clearError();
    }
  }, [error, clearError]);

  const handleEndCall = () => {
    endCall();
    setAppState("call-ended");
  };

  const handleCancelMatching = () => {
    cancelMatching();
    router.push("/");
  };

  const handleAddFriend = async () => {
    const token = AuthManager.getAccessToken();
    const peerUserId = webRTCState.peerUserId;

    if (!token || !peerUserId) {
      alert("친구 추가에 필요한 정보가 없습니다.");
      return;
    }

    try {
      const response = await fetch("http://15.165.159.68:8000/friends/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId: peerUserId }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`친구 추가 실패: ${response.status}`);
      }

      const data = await response.json();
      if (data.added) {
        setAppState("friend-added");
      } else {
        alert("친구 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("친구 추가 오류:", error);
      alert("친구 추가 중 오류가 발생했습니다.");
    }
  };

  const handleSkipFriend = () => {
    setAppState("next-choice");
  };

  const handleNextCallFromFriendAdded = async () => {
    setCallDuration("00:00");
    hasStartedMatching.current = false;
    setAppState("matching");
    await startMatching(selectedGender, includeLocation);
  };

  const handleNextCallFromChoice = async () => {
    setIsSliding(true);
    setTimeout(async () => {
      setIsSliding(false);
      setCallDuration("00:00");
      hasStartedMatching.current = false;
      setAppState("matching");
      await startMatching(selectedGender, includeLocation);
    }, 300);
  };

  const handleEndFromChoice = () => {
    setCallDuration("00:00");
    router.push("/");
  };

  // 서버 사이드 렌더링 시 로딩 화면
  if (!mounted) {
    return (
      <div className="relative w-full h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-[#111111] overflow-hidden">
      {/* Mock 모드 표시 */}
      {USE_MOCK_MODE && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-600 text-black px-4 py-2 rounded font-bold text-sm">
          🧪 테스트 모드 (서버 연결 없음)
        </div>
      )}

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
            localStream={localStream}
            remoteStream={remoteStream}
          />
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>통화 상태:</span>
                <span className="text-blue-400">{appState}</span>
              </div>
              <div className="flex justify-between">
                <span>선택 성별:</span>
                <span className="text-purple-400">
                  {selectedGender === "M" ? "남성" : "여성"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>위치 사용:</span>
                <span
                  className={
                    includeLocation ? "text-green-400" : "text-gray-500"
                  }
                >
                  {includeLocation ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>매칭 중:</span>
                <span
                  className={
                    webRTCState.isMatching ? "text-yellow-400" : "text-gray-500"
                  }
                >
                  {webRTCState.isMatching ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>통화 연결:</span>
                <span
                  className={
                    webRTCState.isConnected ? "text-green-400" : "text-gray-500"
                  }
                >
                  {webRTCState.isConnected ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>WS 연결:</span>
                <span
                  className={wsConnected ? "text-green-400" : "text-red-400"}
                >
                  {wsConnected ? "✓" : "✗"}
                </span>
              </div>
              {webRTCState.roomId && (
                <div className="flex justify-between">
                  <span>방 ID:</span>
                  <span className="text-blue-400">{webRTCState.roomId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>통화 시간:</span>
                <span className="text-green-400">{callDuration}</span>
              </div>
              <div className="flex justify-between">
                <span>로컬 스트림:</span>
                <span
                  className={localStream ? "text-green-400" : "text-red-400"}
                >
                  {localStream ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>리모트 스트림:</span>
                <span
                  className={remoteStream ? "text-green-400" : "text-red-400"}
                >
                  {remoteStream ? "✓" : "✗"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 매칭 중 (로딩) 화면 */}
      {appState === "matching" && (
        <div className="relative w-full h-full">
          {/* 상단 그라데이션 오버레이 */}
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/80 to-transparent z-10"></div>

          {/* 내 비디오 배경 (전체 화면) */}
          <div className="absolute inset-0">
            {localStream ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-pulse text-6xl mb-4">👤</div>
                  <p className="text-white text-lg">카메라를 준비하는 중...</p>
                </div>
              </div>
            )}
          </div>

          {/* 중앙 메시지 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <h1 className="text-white text-[28px] font-bold leading-[130%] tracking-[-0.03em] text-center mb-4">
              곧 대화가 시작돼요
            </h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
            </div>
          </div>

          {/* 하단 그라데이션 + 취소 버튼 */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
          <div className="absolute bottom-[109px] left-1/2 transform -translate-x-1/2 z-20">
            <button
              onClick={handleCancelMatching}
              className="flex items-center justify-center gap-2 px-7 py-4 bg-[#FE5454] rounded-[40px] transition-all hover:bg-[#e04848]"
            >
              <span className="text-white text-2xl font-bold leading-[130%] tracking-[-0.03em]">
                그만하기
              </span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"
                  fill="white"
                  transform="rotate(135 12 12)"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 통화 연결됨 */}
      {appState === "connected" && (
        <div className="relative w-full h-full">
          {/* 상대방 비디오 (전체 화면) */}
          <div className="absolute inset-0">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!remoteStream && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <div className="animate-pulse text-4xl mb-2">👤</div>
                  <p className="text-white">상대방 영상을 기다리는 중...</p>
                </div>
              </div>
            )}
          </div>

          {/* 상단 그라데이션 오버레이 */}
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/80 to-transparent z-10"></div>

          {/* 상대방 정보 (왼쪽 상단) */}
          <div className="absolute top-12 left-4 z-20">
            <h2 className="text-white text-[28px] font-bold leading-[130%] tracking-[-0.03em] mb-1">
              송가인
            </h2>
            <div className="flex items-center gap-1.5 text-white text-xl font-medium leading-[135%] tracking-[-0.03em]">
              <span>71년생</span>
              <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
              <span>여성</span>
              <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
              <span>우만동</span>
            </div>
          </div>

          {/* 내 비디오 (오른쪽 상단) */}
          <div className="absolute right-4 top-12 w-[123px] h-44 bg-gray-800 rounded-[10px] overflow-hidden shadow-2xl z-20 animate-[slideInScale_0.5s_ease-out]">
            {localStream ? (
              <video
                ref={localVideoSmallRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <div className="text-2xl">👤</div>
              </div>
            )}
          </div>

          {/* 하단 그라데이션 + 종료 버튼 */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
          <div className="absolute bottom-[109px] left-1/2 transform -translate-x-1/2 z-20">
            <button
              onClick={handleEndCall}
              className="flex items-center justify-center gap-2 px-7 py-4 bg-[#FE5454] rounded-[40px] transition-all hover:bg-[#e04848]"
            >
              <span className="text-white text-2xl font-bold leading-[130%] tracking-[-0.03em]">
                그만하기
              </span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"
                  fill="white"
                  transform="rotate(135 12 12)"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 통화 종료 화면 */}
      {appState === "call-ended" && (
        <CallEndScreen
          onAddFriend={handleAddFriend}
          onNextCall={handleSkipFriend}
          callDuration={callDuration}
        />
      )}

      {/* 친구 추가 완료 화면 */}
      {appState === "friend-added" && (
        <FriendAddedChoiceScreen
          onEndCall={handleEndFromChoice}
          onNextCall={handleNextCallFromFriendAdded}
        />
      )}

      {/* 다음 선택 화면 */}
      {appState === "next-choice" && (
        <NextCallChoiceScreen
          onEndCall={handleEndFromChoice}
          onNextCall={handleNextCallFromChoice}
        />
      )}

      {/* 커스텀 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: scale(2) translateY(-50%);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default function CallPage() {
  return (
    <Suspense
      fallback={
        <div className="relative w-full h-screen bg-[#111111] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading...</p>
          </div>
        </div>
      }
    >
      <CallPageContent />
    </Suspense>
  );
}
