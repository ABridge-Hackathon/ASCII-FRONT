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

        // console.log("🔄 Access Token 갱신 시도...");

        // // Refresh Token으로 새 Access Token 발급
        // const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
        //   refresh: refresh,
        // });

        // const { access, refresh: newRefresh } = response.data;
        // setTokens(access, newRefresh || refresh);

        // console.log("✅ Access Token 갱신 성공");

        // 실패한 요청 재시도
        // originalRequest.headers.Authorization = `Bearer ${access}`;
        // return api(originalRequest);
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
   * 사용자 정보
   */
  getJWToken: async () => {
    const response = await api.get("/api/auth/otp/verify");
    return response.data;
  },
};

/**
 * 신분증 이미지를 백엔드로 전송하여 OCR 처리
 */
export async function verifyIDCard(imageBlob: Blob) {
  const formData = new FormData();
  formData.append("id_image", imageBlob, "id_card.jpg");

  try {
    const response = await fetch(`${API_BASE_URL}/auth/idcard/ocr/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // 백엔드 응답 구조에 맞게 변환
    return {
      success: result.success,
      name: result.data.name,
      gender: result.data.gender,
      birth_date: result.data.birthDate,
      address: result.data.address,
      onboarding_token: result.data.onboardingToken,
      message: result.error,
    };
  } catch (error) {
    console.error("신분증 인증 오류:", error);
    throw error;
  }
}

/**
 * OCR 결과 타입 정의
 */
export interface IDCardInfo {
  name: string;
  gender: string;
  birth_date: string;
  address: string;
  onboarding_token: string;
  success: boolean;
  message?: string;
}

interface OTPRequestResponse {
  success: boolean;
  data: {
    expiresInSec: number;
  } | null;
  error: string | null;
}

interface OTPVerifyResponse {
  success: boolean;
  data: {
    accessToken: string;
    tokenType: string;
    isRegistered: boolean;
  } | null;
  error: string | null;
}

/**
 * 휴대폰 인증번호 발송
 */
export async function sendVerificationCode(
  phoneNumber: string,
): Promise<OTPRequestResponse> {
  try {
    const response = await api.post<OTPRequestResponse>("/auth/otp/request", {
      phoneNumber: phoneNumber.replace(/[^\d]/g, ""), // 숫자만 전송
    });

    if (!response.data.success) {
      throw new Error(response.data.error || "인증번호 발송에 실패했습니다.");
    }

    return response.data;
  } catch (error: any) {
    console.error("인증번호 발송 오류:", error);
    throw new Error(
      error.response?.data?.error || "인증번호 발송에 실패했습니다.",
    );
  }
}

/**
 * 휴대폰 인증번호 검증
 */
export async function verifyPhoneCode(
  phoneNumber: string,
  verificationCode: string,
): Promise<OTPVerifyResponse> {
  try {
    const response = await api.post<OTPVerifyResponse>("/auth/otp/verify", {
      phoneNumber: phoneNumber.replace(/[^\d]/g, ""),
      code: verificationCode,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || "인증번호가 일치하지 않습니다.");
    }

    return response.data;
  } catch (error: any) {
    console.error("인증번호 검증 오류:", error);
    throw new Error(
      error.response?.data?.error || "인증번호 검증에 실패했습니다.",
    );
  }
}

/**
 * 얼굴 사진 업로드
 */
export async function uploadFacePhoto(photoBlob: Blob) {
  const formData = new FormData();
  formData.append("face_image", photoBlob, "face_photo.jpg");

  try {
    const response = await api.post("/auth/profile-image/", formData);

    if (!response.data.success) {
      throw new Error(
        response.data.message || "얼굴 사진 업로드에 실패했습니다.",
      );
    }

    return response.data;
  } catch (error) {
    console.error("얼굴 사진 업로드 오류:", error);
    throw error;
  }
}

/**
 * 회원가입 완료 요청
 */
export async function registerUser(
  idInfo: IDCardInfo,
  phoneNumber: string,
  facePhotoBlob?: Blob,
) {
  try {
    const formData = new FormData();
    formData.append("name", idInfo.name);
    formData.append("gender", idInfo.gender);
    formData.append("birth_date", idInfo.birth_date);
    formData.append("address", idInfo.address);
    formData.append("phone_number", phoneNumber.replace(/[^\d]/g, ""));
    formData.append("onboarding_token", idInfo.onboarding_token);

    if (facePhotoBlob) {
      formData.append("face_image", facePhotoBlob, "face_photo.jpg");
    }

    const response = await api.post("auth/register/", formData);

    if (!response.data.success) {
      throw new Error(response.data.message || "회원가입에 실패했습니다.");
    }

    // 회원가입 성공 시 토큰 저장
    if (response.data.access && response.data.refresh) {
      setTokens(response.data.access, response.data.refresh);
    }

    return response.data;
  } catch (error) {
    console.error("회원가입 오류:", error);
    throw error;
  }
}

/**
 * 친구 목록 타입 정의
 */
export interface Friend {
  userId: number;
  name: string;
  age: number;
  region: string;
  online: boolean;
  isWelfareWorker: boolean;
  profileImageUrl: string;
}

export interface FriendsResponse {
  success: boolean;
  data: {
    friends: Friend[];
    offset: number;
    limit: number;
    nextOffset: number;
    total: number;
  };
  error: null | string;
}

/**
 * 친구 목록 조회
 */
export async function getFriends(
  offset: number = 0,
  limit: number = 6,
): Promise<FriendsResponse> {
  try {
    const response = await api.get<FriendsResponse>("/friends", {
      params: { offset, limit },
    });

    if (!response.data.success) {
      throw new Error(response.data.error || "친구 목록 조회에 실패했습니다.");
    }

    return response.data;
  } catch (error: any) {
    console.error("친구 목록 조회 오류:", error);
    throw new Error(
      error.response?.data?.error || "친구 목록 조회에 실패했습니다.",
    );
  }
}

/**
 * 사용자 프로필 정보 타입 정의
 */
export interface UserProfile {
  userId: number;
  name: string;
  gender: "M" | "F";
  birthDate: string;
  age: number;
  phoneNumber: string;
  profileImageUrl: string;
  region: string;
  isWelfareWorker: boolean;
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
  error: null | string;
}

/**
 * 사용자 프로필 정보 조회
 * GET /api/users/me/
 */
export async function getUserProfile(): Promise<UserProfileResponse> {
  try {
    const response = await api.get<UserProfileResponse>("/users/me/");

    if (!response.data.success) {
      throw new Error(
        response.data.error || "프로필 정보 조회에 실패했습니다.",
      );
    }

    return response.data;
  } catch (error: any) {
    console.error("프로필 정보 조회 오류:", error);
    throw new Error(
      error.response?.data?.error || "프로필 정보 조회에 실패했습니다.",
    );
  }
}
