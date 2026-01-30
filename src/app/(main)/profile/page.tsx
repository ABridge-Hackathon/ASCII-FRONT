"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserProfile, UserProfile } from "@/lib/api";
import { clearTokens } from "@/utils/auth";

export default function MyPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      setProfile(response.data);
    } catch (err: any) {
      console.error("프로필 로딩 실패:", err);
      setError(err.message || "프로필 정보를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  const handleWithdrawal = () => {
    // 회원탈퇴 로직
    if (confirm("정말 탈퇴하시겠습니까?")) {
      console.log("회원탈퇴");
      // TODO: 회원탈퇴 API 호출
    }
  };

  // 성별 한글 변환
  const getGenderText = (gender: "M" | "F") => {
    return gender === "M" ? "남성" : "여성";
  };

  // 전화번호 포맷팅 (01012341234 -> 010-1234-1234)
  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 11) {
      return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`;
    }
    return phone;
  };

  // 생년월일 포맷팅 (1972-03-30 -> 1972.03.30)
  const formatBirthDate = (date: string) => {
    return date.replace(/-/g, ".");
  };

  if (loading) {
    return (
      <div className="relative w-full min-h-screen bg-[#F3F3F3] flex items-center justify-center p-4">
        <div className="text-[#4F4E4A] text-base">로딩 중...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="relative w-full min-h-screen bg-[#F3F3F3] flex flex-col items-center justify-center gap-4 p-4">
        <div className="text-[#4F4E4A] text-base text-center">{error}</div>
        <button
          onClick={loadProfile}
          className="px-6 py-2 bg-[#FF6E00] text-white rounded-lg"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-[#F3F3F3] px-4 py-8 sm:py-12">
      <div className="max-w-[360px] mx-auto">
        {/* 인사말 */}
        <h1 className="mt-[44px] sm:mt-[64px] font-semibold text-[24px] sm:text-[28px] leading-[130%] tracking-[-0.03em] text-[#111111]">
          {profile.name}님 안녕하세요!
        </h1>

        {/* 프로필 카드 */}
        <div className="mt-[24px] sm:mt-[28px] w-full bg-white rounded-[12px] p-3">
          <div className="flex gap-3">
            {/* 프로필 이미지 */}
            <div className="flex-shrink-0 w-[100px] sm:w-[116px] h-[124px] sm:h-[144px] rounded-[11.93px] overflow-hidden bg-gray-200">
              {profile.profileImageUrl ? (
                <img
                  src={profile.profileImageUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 64 64"
                    fill="none"
                    className="opacity-50"
                  >
                    <circle cx="32" cy="20" r="12" fill="currentColor" />
                    <path
                      d="M10 54C10 42 20 34 32 34C44 34 54 42 54 54"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* 프로필 정보 */}
            <div className="flex-1 flex flex-col justify-center gap-2 sm:gap-4 min-w-0">
              {/* 성별 */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-[#C0BBB6] flex-shrink-0">
                  성별
                </span>
                <span className="text-sm sm:text-base font-medium text-[#65635F] truncate">
                  {getGenderText(profile.gender)}
                </span>
              </div>

              {/* 생년월일 */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-[#C0BBB6] flex-shrink-0">
                  생년월일
                </span>
                <span className="text-sm sm:text-base font-medium text-[#65635F] truncate">
                  {formatBirthDate(profile.birthDate)}
                </span>
              </div>

              {/* 거주지역 */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-[#C0BBB6] flex-shrink-0">
                  거주지역
                </span>
                <span className="text-sm sm:text-base font-medium text-[#65635F] truncate">
                  {profile.region}
                </span>
              </div>

              {/* 전화번호 */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-[#C0BBB6] flex-shrink-0">
                  전화번호
                </span>
                <span className="text-sm sm:text-base font-medium text-[#65635F] truncate">
                  {formatPhoneNumber(profile.phoneNumber)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 설정 메뉴 */}
        <div className="mt-4 w-full bg-white rounded-[12px] overflow-hidden">
          {/* 내 복지관 정보 */}
          <button
            onClick={() => router.push("/welfare-info")}
            className="flex items-center justify-between w-full h-12 px-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <span className="text-sm sm:text-base font-normal text-[#4F4E4A]">
              내 복지관 정보
            </span>
            <svg
              width="7"
              height="14"
              viewBox="0 0 7 14"
              fill="none"
              className="flex-shrink-0"
            >
              <path
                d="M1 1L6 7L1 13"
                stroke="#A7A39F"
                strokeWidth="1.44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 구분선 */}
          <div className="w-full h-[1px] bg-gray-100" />

          {/* 이용약관 및 정책 */}
          <button
            onClick={() => router.push("/terms")}
            className="flex items-center justify-between w-full h-12 px-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <span className="text-sm sm:text-base font-normal text-[#4F4E4A]">
              이용약관 및 정책
            </span>
            <svg
              width="7"
              height="14"
              viewBox="0 0 7 14"
              fill="none"
              className="flex-shrink-0"
            >
              <path
                d="M1 1L6 7L1 13"
                stroke="#A7A39F"
                strokeWidth="1.44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 구분선 */}
          <div className="w-full h-[1px] bg-gray-100" />

          {/* 로그아웃 */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-between w-full h-12 px-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <span className="text-sm sm:text-base font-normal text-[#4F4E4A]">
              로그아웃
            </span>
            <svg
              width="7"
              height="14"
              viewBox="0 0 7 14"
              fill="none"
              className="flex-shrink-0"
            >
              <path
                d="M1 1L6 7L1 13"
                stroke="#A7A39F"
                strokeWidth="1.44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 구분선 */}
          <div className="w-full h-[1px] bg-gray-100" />

          {/* 회원탈퇴 */}
          <button
            onClick={handleWithdrawal}
            className="flex items-center justify-between w-full h-12 px-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <span className="text-sm sm:text-base font-normal text-[#4F4E4A]">
              회원탈퇴
            </span>
            <svg
              width="7"
              height="14"
              viewBox="0 0 7 14"
              fill="none"
              className="flex-shrink-0"
            >
              <path
                d="M1 1L6 7L1 13"
                stroke="#A7A39F"
                strokeWidth="1.44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
