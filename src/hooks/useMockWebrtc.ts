"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { CallState, Gender } from "@/types/webrtc";

/**
 * 서버 연결 없이 UI만 테스트하기 위한 Mock useWebRTC
 */
export const useMockWebRTC = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callState, setCallState] = useState<CallState>({
    isMatching: false,
    isConnected: false,
    roomId: null,
    remoteUserId: null,
  });
  const [wsConnected, setWsConnected] = useState(true); // 항상 연결된 것처럼
  const [error, setError] = useState<string | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  // 로컬 미디어 스트림 시작
  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      localStreamRef.current = stream;
      setLocalStream(stream);
      console.log("✅ [MOCK] 로컬 스트림 시작됨");
      return stream;
    } catch (err) {
      console.error("❌ [MOCK] 미디어 접근 에러:", err);
      setError("카메라/마이크 접근 권한이 필요합니다.");
      throw err;
    }
  };

  // 가짜 원격 스트림 생성 (자기 자신의 카메라를 원격으로 시뮬레이션)
  const createFakeRemoteStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      remoteStreamRef.current = stream;
      setRemoteStream(stream);
      console.log("✅ [MOCK] 원격 스트림 시뮬레이션됨");
    } catch (err) {
      console.error("❌ [MOCK] 원격 스트림 생성 에러:", err);
    }
  };

  // 매칭 시작 (가짜)
  const startMatching = async (
    targetGender: Gender,
    includeLocation: boolean = false,
  ) => {
    try {
      console.log(
        `🔍 [MOCK] 매칭 시작 - 성별: ${targetGender}, 위치: ${includeLocation}`,
      );

      // 로컬 스트림이 없으면 먼저 시작
      if (!localStream) {
        await startLocalStream();
      }

      setCallState((prev) => ({ ...prev, isMatching: true }));
      setError(null);

      // 2초 후 매칭 완료 시뮬레이션
      setTimeout(() => {
        console.log("✅ [MOCK] 매칭 완료");
        setCallState({
          isMatching: false,
          isConnected: false,
          roomId: "mock-room-123",
          remoteUserId: "mock-user-456",
        });

        // 1초 후 연결 완료
        setTimeout(async () => {
          console.log("✅ [MOCK] WebRTC 연결 완료");
          await createFakeRemoteStream();
          setCallState((prev) => ({ ...prev, isConnected: true }));
        }, 1000);
      }, 2000);
    } catch (err) {
      console.error("❌ [MOCK] 매칭 시작 에러:", err);
      setError(
        err instanceof Error ? err.message : "매칭 요청에 실패했습니다.",
      );
      setCallState((prev) => ({ ...prev, isMatching: false }));
    }
  };

  // 매칭 취소
  const cancelMatching = async () => {
    console.log("🚫 [MOCK] 매칭 취소");
    setCallState((prev) => ({ ...prev, isMatching: false }));
  };

  // 통화 종료
  const endCall = () => {
    console.log("📞 [MOCK] 통화 종료");

    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      remoteStreamRef.current = null;
    }

    setRemoteStream(null);
    setCallState({
      isMatching: false,
      isConnected: false,
      roomId: null,
      remoteUserId: null,
    });
  };

  // 정리
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

  return {
    localStream,
    remoteStream,
    callState,
    wsConnected,
    error,
    startLocalStream,
    startMatching,
    cancelMatching,
    endCall,
    clearError: () => setError(null),
  };
};
