"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { SignalingMessage, CallState, Gender } from "@/types/webrtc";
import { MatchService } from "@/services/matchService";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

interface UseWebRTCProps {
  getAccessToken: () => string | null;
}

export const useWebRTC = (
  baseUrl: string,
  { getAccessToken }: UseWebRTCProps,
) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callState, setCallState] = useState<CallState>({
    isMatching: false,
    isConnected: false,
    roomId: null,
    remoteUserId: null,
  });
  const [wsConnected, setWsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ws = useRef<ReconnectingWebSocket | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const currentSessionId = useRef<string | null>(null);

  // WebSocket 연결 (sessionId와 토큰 포함)
  const connectWebSocket = useCallback(
    (sessionId: string) => {
      const token = getAccessToken();
      if (!token) {
        setError("인증 토큰이 없습니다. 로그인이 필요합니다.");
        return;
      }

      // ws://<host>/ws/signaling/<sessionId>/?token=<ACCESS_TOKEN>
      const wsUrl = `${baseUrl}/ws/signaling/${sessionId}/?token=${token}`;
      console.log("WebSocket 연결 시도:", wsUrl);

      ws.current = new ReconnectingWebSocket(wsUrl, [], {
        maxRetries: 10,
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000,
        reconnectionDelayGrowFactor: 1.5,
        connectionTimeout: 4000,
      });

      ws.current.onopen = () => {
        console.log("✅ WebSocket 연결됨");
        setWsConnected(true);
        setError(null);
      };

      ws.current.onclose = () => {
        console.log("🔌 WebSocket 연결 종료");
        setWsConnected(false);
      };

      ws.current.onerror = (error) => {
        console.error("❌ WebSocket 에러:", error);
        setError("WebSocket 연결 오류");
      };

      ws.current.onmessage = async (event) => {
        try {
          const data: SignalingMessage = JSON.parse(event.data);
          await handleSignalingMessage(data);
        } catch (err) {
          console.error("메시지 처리 에러:", err);
        }
      };
    },
    [baseUrl, getAccessToken],
  );

  // 시그널링 메시지 처리
  const handleSignalingMessage = async (data: SignalingMessage) => {
    console.log("📩 시그널링 메시지:", data);

    switch (data.type) {
      case "match-found":
        // 백엔드에서 매칭이 완료되면 WebSocket으로 알림
        setCallState((prev) => ({
          ...prev,
          isMatching: false,
          roomId: data.roomId || null,
          remoteUserId: data.userId || null,
        }));
        // Offer를 생성하는 쪽이 먼저 PeerConnection 시작
        await createOffer();
        break;

      case "offer":
        if (data.offer) {
          await handleOffer(data.offer);
        }
        break;

      case "answer":
        if (data.answer) {
          await handleAnswer(data.answer);
        }
        break;

      case "ice-candidate":
        if (data.candidate) {
          await handleIceCandidate(data.candidate);
        }
        break;

      case "user-disconnected":
        handleDisconnect();
        break;

      case "match-cancelled":
        setCallState((prev) => ({ ...prev, isMatching: false }));
        currentSessionId.current = null;
        setError("매칭이 취소되었습니다.");
        break;

      case "pong":
        // 핑퐁 응답 (연결 유지 확인)
        console.log("🏓 PONG 수신");
        break;

      default:
        console.log("알 수 없는 메시지 타입:", data.type);
    }
  };

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

      setLocalStream(stream);
      console.log("✅ 로컬 스트림 시작됨");
      return stream;
    } catch (err) {
      console.error("❌ 미디어 접근 에러:", err);
      setError("카메라/마이크 접근 권한이 필요합니다.");
      throw err;
    }
  };

  // PeerConnection 생성
  const createPeerConnection = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);

    // 로컬 스트림 추가
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    // 원격 스트림 수신
    pc.ontrack = (event) => {
      console.log("🎥 원격 스트림 수신됨");
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        setCallState((prev) => ({ ...prev, isConnected: true }));
      }
    };

    // ICE candidate 처리
    pc.onicecandidate = (event) => {
      if (event.candidate && ws.current) {
        sendSignalingMessage({
          type: "ice-candidate",
          candidate: event.candidate.toJSON(),
        });
      }
    };

    // 연결 상태 변화
    pc.onconnectionstatechange = () => {
      console.log("🔗 연결 상태:", pc.connectionState);
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        handleDisconnect();
      }
    };

    // ICE 연결 상태
    pc.oniceconnectionstatechange = () => {
      console.log("🧊 ICE 연결 상태:", pc.iceConnectionState);
    };

    peerConnection.current = pc;
    return pc;
  };

  // Offer 생성
  const createOffer = async () => {
    try {
      const pc = createPeerConnection();
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      sendSignalingMessage({
        type: "offer",
        offer: offer,
        roomId: callState.roomId || undefined,
      });

      console.log("📤 Offer 전송됨");
    } catch (err) {
      console.error("Offer 생성 에러:", err);
      setError("통화 연결에 실패했습니다.");
    }
  };

  // Offer 수신 처리
  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    try {
      const pc = createPeerConnection();
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      sendSignalingMessage({
        type: "answer",
        answer: answer,
        roomId: callState.roomId || undefined,
      });

      console.log("📤 Answer 전송됨");
    } catch (err) {
      console.error("Offer 처리 에러:", err);
      setError("통화 연결에 실패했습니다.");
    }
  };

  // Answer 수신 처리
  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    try {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer),
        );
        console.log("✅ Answer 수신됨");
      }
    } catch (err) {
      console.error("Answer 처리 에러:", err);
    }
  };

  // ICE Candidate 수신 처리
  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate),
        );
        console.log("✅ ICE Candidate 추가됨");
      }
    } catch (err) {
      console.error("ICE Candidate 추가 에러:", err);
    }
  };

  // 시그널링 메시지 전송
  const sendSignalingMessage = (data: SignalingMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    } else {
      console.error("WebSocket이 연결되지 않음");
    }
  };

  // 매칭 시작 (HTTP + WebSocket)
  const startMatching = async (
    targetGender: Gender,
    includeLocation: boolean = false,
  ) => {
    try {
      // 1. 로컬 스트림이 없으면 먼저 시작
      if (!localStream) {
        await startLocalStream();
      }

      setCallState((prev) => ({ ...prev, isMatching: true }));
      setError(null);

      // 2. JWT 토큰 가져오기
      const token = getAccessToken();
      if (!token) {
        throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
      }

      // 3. 위치 정보 가져오기 (선택사항)
      let location: { latitude?: number; longitude?: number } = {};
      if (includeLocation) {
        const coords = await MatchService.getCurrentLocation();
        if (coords) {
          location = coords;
        }
      }

      // 4. HTTP POST로 매칭 요청 (토큰 포함)
      const matchResponse = await MatchService.requestMatch(
        {
          targetGender,
          ...location,
        },
        token,
      );

      console.log("✅ 매칭 응답:", matchResponse);
      currentSessionId.current = matchResponse.sessionId;

      // 5. WebSocket 연결 (sessionId와 토큰 포함)
      connectWebSocket(matchResponse.sessionId);
    } catch (err) {
      console.error("매칭 시작 에러:", err);
      setError(
        err instanceof Error ? err.message : "매칭 요청에 실패했습니다.",
      );
      setCallState((prev) => ({ ...prev, isMatching: false }));
    }
  };

  // 매칭 취소
  const cancelMatching = async () => {
    try {
      const token = getAccessToken();

      if (currentSessionId.current && token) {
        await MatchService.cancelMatch(currentSessionId.current, token);
      }

      setCallState((prev) => ({ ...prev, isMatching: false }));
      currentSessionId.current = null;

      // WebSocket으로도 알림
      sendSignalingMessage({ type: "match-cancelled" });
    } catch (err) {
      console.error("매칭 취소 에러:", err);
    }
  };

  // 통화 종료
  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    setRemoteStream(null);
    setCallState({
      isMatching: false,
      isConnected: false,
      roomId: null,
      remoteUserId: null,
    });

    currentSessionId.current = null;

    // WebSocket으로 상대방에게 알림
    sendSignalingMessage({ type: "user-disconnected" });
  };

  // 연결 해제 처리
  const handleDisconnect = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    setRemoteStream(null);
    setCallState({
      isMatching: false,
      isConnected: false,
      roomId: null,
      remoteUserId: null,
    });

    currentSessionId.current = null;
    setError("상대방과의 연결이 끊어졌습니다.");
  };

  // 주기적인 핑 전송 (연결 유지)
  useEffect(() => {
    if (!wsConnected) return;

    const pingInterval = setInterval(() => {
      sendSignalingMessage({ type: "ping" });
    }, 30000); // 30초마다

    return () => clearInterval(pingInterval);
  }, [wsConnected]);

  // 정리
  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [localStream]);

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
