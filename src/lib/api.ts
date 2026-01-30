import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: Access Token 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 401 에러 시 토큰 갱신
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
          // Refresh Token이 없으면 로그인 페이지로
          clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }

        // Refresh Token으로 새 Access Token 발급
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh/`, {
          refresh: refresh,
        });

        const { access, refresh: newRefresh } = response.data;
        setTokens(access, newRefresh || refresh);

        // 실패한 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh Token도 만료됨
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// API 함수들
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post("/api/auth/login/", { username, password });
    const { access, refresh } = response.data;
    setTokens(access, refresh);
    return response.data;
  },

  logout: () => {
    clearTokens();
  },

  getCurrentUser: async () => {
    const response = await api.get("/api/auth/me/");
    return response.data;
  },
};
