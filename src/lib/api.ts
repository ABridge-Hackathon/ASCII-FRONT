/**
 * Axios 기반 HTTP API 클라이언트
 * - Access Token 자동 첨부
 * - 401 에러 시 Refresh Token으로 자동 갱신
 */

import axios from "axios";
import { API_BASE_URL } from "@/utils/config";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "@/utils/auth";

// Axios 인스턴스 생성
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/**
 * 요청 인터셉터: Access Token 자동 첨부
 */
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * 응답 인터셉터: 401 에러 시 토큰 갱신 후 재시도
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = getRefreshToken();

        if (!refresh) {
          console.error("❌ Refresh Token 없음 - 로그인 필요");
          clearTokens();
          // TODO: 로그인 페이지로 리다이렉트
          // if (typeof window !== "undefined") {
          //   window.location.href = "/login";
          // }
          return Promise.reject(error);
        }

        console.log("🔄 Access Token 갱신 시도...");

        // Refresh Token으로 새 Access Token 발급
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refresh,
        });

        const { access, refresh: newRefresh } = response.data;
        setTokens(access, newRefresh || refresh);

        console.log("✅ Access Token 갱신 성공");

        // 실패한 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh Token도 만료됨 - 재로그인 필요");
        clearTokens();
        // TODO: 로그인 페이지로 리다이렉트
        // if (typeof window !== "undefined") {
        //   window.location.href = "/login";
        // }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

/**
 * 인증 관련 API
 */
export const authAPI = {
  /**
   * 로그인
   */
  login: async (username: string, password: string) => {
    const response = await api.post("/auth/login/", { username, password });
    const { access, refresh } = response.data;
    setTokens(access, refresh);
    return response.data;
  },

  /**
   * 로그아웃
   */
  logout: () => {
    clearTokens();
  },

  /**
   * JWT 발급
   */
  getCurrentUser: async () => {
    const response = await api.get("/user/me");
    return response.data;
  },

  /**
   * 사용자 정보
   */
  getJWToken: async () => {
    const response = await api.get("/api/auth/otp/verify");
    return response.data;
  },
};
