"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { SignalingMessage, CallState } from "@/types/webtrc";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export const useWebRTC = (serverUrl: string) => {
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

  // WebSocket 연결
  const connectWebSocket = useCallback(() => {
    ws.current = new ReconnectingWebSocket(serverUrl, [], {
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
  }, [serverUrl]);

  // 시그널링 메시지 처리
  const handleSignalingMessage = async (data: SignalingMessage) => {
    console.log("📩 시그널링 메시지:", data);

    switch (data.type) {
      case "match-found":
        setCallState((prev) => ({
          ...prev,
          isMatching: false,
          roomId: data.roomId || null,
          remoteUserId: data.userId || null,
        }));
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
        setError("매칭이 취소되었습니다.");
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
        audio: true,
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

  // 매칭 시작
  const startMatching = async () => {
    if (!localStream) {
      await startLocalStream();
    }

    setCallState((prev) => ({ ...prev, isMatching: true }));
    sendSignalingMessage({ type: "match-request" });
    console.log("🔍 매칭 요청 전송됨");
  };

  // 매칭 취소
  const cancelMatching = () => {
    setCallState((prev) => ({ ...prev, isMatching: false }));
    sendSignalingMessage({ type: "match-cancelled" });
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

    setError("상대방과의 연결이 끊어졌습니다.");
  };

  // 정리
  useEffect(() => {
    connectWebSocket();

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
  }, [connectWebSocket]);

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
