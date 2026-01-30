/**
 * WebRTC 관련 TypeScript 타입 정의
 */

/**
 * 통화 상태
 */
export interface CallState {
  isMatching: boolean; // 매칭 중인지 여부
  isConnected: boolean; // WebRTC 연결 완료 여부
  roomId: string | null; // 방 ID
  remoteUserId: string | null; // 상대방 사용자 ID (문자열)
  peerUserId?: number | null; // 상대방 사용자 ID (숫자, 친구 추가용)
}

/**
 * WebSocket 시그널링 메시지
 */
export interface SignalingMessage {
  type:
    | "match-request" // 매칭 요청
    | "match-found" // 매칭 완료
    | "match-cancelled" // 매칭 취소
    | "offer" // WebRTC Offer
    | "answer" // WebRTC Answer
    | "ice-candidate" // ICE Candidate
    | "user-disconnected" // 사용자 연결 해제
    | "ping" // 연결 유지 (클라이언트 → 서버)
    | "pong"; // 연결 유지 응답 (서버 → 클라이언트)

  roomId?: string;
  userId?: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

/**
 * 매칭 요청 데이터
 */
export interface MatchRequest {
  targetGender: "M" | "F"; // 원하는 성별
  latitude?: number; // 위도 (선택)
  longitude?: number; // 경도 (선택)
}

/**
 * 매칭 응답 데이터
 */
export interface MatchResponse {
  sessionId: string; // WebSocket 연결에 사용할 세션 ID
  peerUserId: number; // 상대방 사용자 ID (친구 추가용)
}

/**
 * 성별 타입
 */
export type Gender = "M" | "F";
