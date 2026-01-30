/**
 * 매칭 관련 HTTP API 서비스
 * - 매칭 요청 (POST /match/request)
 * - 매칭 취소 (POST /match/cancel)
 * - 세션 종료 (POST /match/end)
 * - 친구 추가 (POST /friends/add)
 */

import { API_BASE_URL } from "@/utils/config";
import { MatchRequest, MatchResponse } from "@/types/webrtc";

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
      console.log("🔍 매칭 요청:", request);

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
      console.log("✅ 매칭 응답:", data);
      return data;
    } catch (error) {
      console.error("❌ 매칭 요청 오류:", error);
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
      console.log("🚫 매칭 취소:", sessionId);

      const response = await fetch(`${API_BASE_URL}/match/end`, {
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

      console.log("✅ 매칭 취소 완료");
    } catch (error) {
      console.error("❌ 매칭 취소 오류:", error);
      throw error;
    }
  }

  /**
   * 통화 종료 (세션 종료)
   * @param sessionId - 세션 ID
   * @param accessToken - JWT 액세스 토큰
   */
  static async endSession(
    sessionId: string,
    accessToken: string,
  ): Promise<void> {
    try {
      console.log("📞 세션 종료:", sessionId);

      const response = await fetch(`${API_BASE_URL}/match/end`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ sessionId }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`세션 종료 실패: ${response.status}`);
      }

      console.log("✅ 세션 종료 완료");
    } catch (error) {
      console.error("❌ 세션 종료 오류:", error);
      throw error;
    }
  }

  /**
   * 친구 추가
   * @param targetUserId - 상대방 유저 ID
   * @param accessToken - JWT 액세스 토큰
   */
  static async addFriend(
    targetUserId: number,
    accessToken: string,
  ): Promise<{ added: boolean }> {
    try {
      console.log("👥 친구 추가:", targetUserId);

      const response = await fetch(`${API_BASE_URL}/friends/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ targetUserId }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `친구 추가 실패: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("✅ 친구 추가 완료:", data);
      return data;
    } catch (error) {
      console.error("❌ 친구 추가 오류:", error);
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
        console.warn("⚠️ Geolocation API를 지원하지 않습니다.");
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log("📍 위치 정보:", coords);
          resolve(coords);
        },
        (error) => {
          console.warn("⚠️ 위치 정보 가져오기 실패:", error);
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
