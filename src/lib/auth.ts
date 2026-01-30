let accessToken: string | null = null;
let refreshToken: string | null = null;

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;

  // React Native에 Refresh Token 저장 요청
  if (typeof window !== "undefined" && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: "SAVE_REFRESH_TOKEN",
        token: refresh,
      }),
    );
  }
};

export const getAccessToken = () => accessToken;

export const getRefreshToken = () => refreshToken;

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;

  // React Native에 토큰 삭제 요청
  if (typeof window !== "undefined" && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: "DELETE_REFRESH_TOKEN",
      }),
    );
  }
};

export const setRefreshTokenFromNative = (token: string) => {
  refreshToken = token;
};

// TypeScript 타입 확장
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
