export interface SignalingMessage {
  type:
    | "offer"
    | "answer"
    | "ice-candidate"
    | "match-request"
    | "match-found"
    | "match-cancelled"
    | "user-disconnected";
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  roomId?: string;
  userId?: string;
  message?: string;
}

export interface CallState {
  isMatching: boolean;
  isConnected: boolean;
  roomId: string | null;
  remoteUserId: string | null;
}
