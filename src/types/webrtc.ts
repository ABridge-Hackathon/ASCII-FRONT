// types/webrtc.ts
export interface CallState {
  isMatching: boolean;
  isConnected: boolean;
  roomId: string | null;
  remoteUserId: string | null;
}

export interface SignalingMessage {
  type:
    | "match-request"
    | "match-found"
    | "match-cancelled"
    | "offer"
    | "answer"
    | "ice-candidate"
    | "user-disconnected"
    | "ping"
    | "pong";
  roomId?: string;
  userId?: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

export interface MatchRequest {
  targetGender: "M" | "F";
  latitude?: number;
  longitude?: number;
}

export interface MatchResponse {
  sessionId: string;
  peerUserId: number;
}

export type Gender = "M" | "F";
