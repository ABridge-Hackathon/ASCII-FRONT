/**
 * 환경 설정 상수
 */

// 백엔드 서버 주소
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// WebSocket 서버 주소 (ws:// 또는 wss://)
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL;

// WebSocket 엔드포인트
export const WS_ENDPOINTS = {
  // 시그널링 서버: ws://15.165.159.68:8000/ws/signaling/{sessionId}/?token={token}
  SIGNALING: (sessionId: string) => `${WS_BASE_URL}/signaling/${sessionId}/`,

  // 테스트용: ws://15.165.159.68:8000/ws/test/
  TEST: `${WS_BASE_URL}/ws/test/`,
} as const;

// ICE 서버 설정
export const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

// WebSocket 재연결 설정
export const WS_RECONNECT_CONFIG = {
  maxRetries: 10,
  maxReconnectionDelay: 10000,
  minReconnectionDelay: 1000,
  reconnectionDelayGrowFactor: 1.5,
  connectionTimeout: 4000,
};
