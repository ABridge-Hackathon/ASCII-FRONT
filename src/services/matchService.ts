import { MatchRequest, MatchResponse } from "@/types/webrtc";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class MatchService {
  /**
   * 매칭 요청
   * @param request - 매칭 요청 데이터 (성별, 위치)
   * @param accessToken - JWT 액세스 토큰
   * @returns 매칭 응답 (sessionId, peerUserId)
   */
  static async requestMatch(
    request: MatchRequest,
    accessToken: string,
  ): Promise<MatchResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/match/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(request),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `매칭 요청 실패: ${response.status}`,
        );
      }

      const data: MatchResponse = await response.json();
      return data;
    } catch (error) {
      console.error("매칭 요청 오류:", error);
      throw error;
    }
  }

  /**
   * 매칭 취소
   * @param sessionId - 세션 ID
   * @param accessToken - JWT 액세스 토큰
   */
  static async cancelMatch(
    sessionId: string,
    accessToken: string,
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/match/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ sessionId }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`매칭 취소 실패: ${response.status}`);
      }
    } catch (error) {
      console.error("매칭 취소 오류:", error);
      throw error;
    }
  }

  /**
   * 위치 정보 가져오기 (브라우저 Geolocation API)
   * @returns 위도/경도 또는 null
   */
  static async getCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
  } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn("Geolocation API를 지원하지 않습니다.");
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("위치 정보 가져오기 실패:", error);
          resolve(null);
        },
        {
          timeout: 5000,
          maximumAge: 60000,
        },
      );
    });
  }
}
