/**
 * JWT 토큰 관리 (임시 검증 버전)
 * React Native WebView와의 통신 포함
 */

// 메모리 기반 토큰 저장 (임시 - 개발용)
let accessToken: string | null = "dev_access_token_temp";
let refreshToken: string | null = "dev_refresh_token_temp";

/**
 * 두 토큰 모두 설정
 */
export const setTokens = (access: string, refresh: string): void => {
  accessToken = access;
  refreshToken = refresh;

  console.log("✅ 토큰 설정됨:", {
    access: access.substring(0, 20) + "...",
    refresh: refresh.substring(0, 20) + "...",
  });

  // React Native에 Refresh Token 저장 요청
  if (typeof window !== "undefined" && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: "SAVE_REFRESH_TOKEN",
        token: refresh,
      }),
    );
    console.log("📤 Native에 Refresh Token 저장 요청");
  }
};

/**
 * Access Token 가져오기
 */
export const getAccessToken = (): string | null => {
  return accessToken;
};

/**
 * Refresh Token 가져오기
 */
export const getRefreshToken = (): string | null => {
  return refreshToken;
};

/**
 * 모든 토큰 삭제 (로그아웃)
 */
export const clearTokens = (): void => {
  console.log("🗑️ 토큰 삭제");
  accessToken = null;
  refreshToken = null;

  // React Native에 토큰 삭제 요청
  if (typeof window !== "undefined" && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: "DELETE_REFRESH_TOKEN",
      }),
    );
    console.log("📤 Native에 토큰 삭제 요청");
  }
};

/**
 * Native에서 받은 Refresh Token 설정
 */
export const setRefreshTokenFromNative = (token: string): void => {
  refreshToken = token;
  console.log(
    "✅ Native로부터 Refresh Token 받음:",
    token.substring(0, 20) + "...",
  );
};

/**
 * 토큰 존재 여부 확인
 */
export const hasToken = (): boolean => {
  return accessToken !== null;
};

/**
 * AuthManager 객체 (하위 호환성을 위한 래퍼)
 * 기존 코드에서 AuthManager.getAccessToken() 형태로 사용 가능
 */
export const AuthManager = {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  setRefreshTokenFromNative,
  hasToken,
};

// TypeScript 전역 타입 확장
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
