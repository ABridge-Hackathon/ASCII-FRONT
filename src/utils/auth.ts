/**
 * JWT 토큰 관리 유틸리티
 */
export class AuthManager {
  private static readonly ACCESS_TOKEN_KEY = "accessToken";
  private static readonly REFRESH_TOKEN_KEY = "refreshToken";

  /**
   * Access Token 저장
   */
  static setAccessToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }
  }

  /**
   * Access Token 가져오기
   */
  static getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  /**
   * Refresh Token 저장
   */
  static setRefreshToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  /**
   * Refresh Token 가져오기
   */
  static getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  /**
   * 모든 토큰 삭제 (로그아웃)
   */
  static clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  /**
   * 토큰 존재 여부 확인
   */
  static hasToken(): boolean {
    return this.getAccessToken() !== null;
  }

  /**
   * JWT 토큰 디코딩 (검증 없이)
   */
  static decodeToken(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("토큰 디코딩 실패:", error);
      return null;
    }
  }

  /**
   * 토큰 만료 확인
   */
  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }

  /**
   * Access Token 유효성 확인
   */
  static isAccessTokenValid(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }
}
