"use client";

import { useEffect } from "react";
import { IDCardInfo } from "@/lib/api";

interface VerificationLoadingProps {
  onComplete: () => void;
  onBack: () => void;
  idCardInfo: IDCardInfo | null;
}

export default function VerificationLoading({
  onComplete,
  onBack,
  idCardInfo,
}: VerificationLoadingProps) {
  useEffect(() => {
    // 3초 후 다음 페이지로 이동 (실제로는 백엔드 응답에 따라)
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative w-[360px] h-[800px] bg-white mx-auto">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-10 flex justify-between items-center px-4">
        <div className="text-sm text-[#111111]">9:30</div>
        <div className="flex gap-1">
          <div className="w-4 h-4" />
          <div className="w-4 h-4" />
          <div className="w-4 h-4" />
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="absolute top-10 left-0 right-0 h-14 bg-white flex justify-between items-center px-1">
        <button className="w-12 h-12 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="#4F4E4A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="flex-1" />
        <div className="w-12 h-12" />
      </nav>

      {/* Title */}
      <h1 className="absolute left-4 top-[127px] font-semibold text-2xl leading-[130%] tracking-[-0.03em] text-[#262931]">
        신분증을 확인하고 있어요
      </h1>

      {/* Loading Animation */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[288px] w-[323.76px] h-[323.76px]">
        {/* Magnifying Glass Illustration */}
        <div className="relative w-full h-full animate-pulse">
          {/* ID Card */}
          <div
            className="absolute w-[258.91px] h-[257.25px] left-[14.13px] top-[16.48px] bg-[#FF7F1E] rounded-lg"
            style={{ transform: "rotate(-8.5deg)" }}
          />

          {/* Eyes */}
          <div
            className="absolute w-[10.97px] h-[18.66px] left-[172.37px] top-[75.22px] bg-[#3A3935] rounded-full"
            style={{ transform: "rotate(-0.46deg)" }}
          />
          <div
            className="absolute w-[10.97px] h-[18.66px] left-[135.07px] top-[74.33px] bg-[#3A3935] rounded-full"
            style={{ transform: "rotate(-0.46deg)" }}
          />

          {/* Smile */}
          <div
            className="absolute w-[79.44px] h-[11.3px] left-[120.58px] top-[100.99px] border-[5.74px] border-[#3A3935] rounded-b-full"
            style={{
              transform: "rotate(0.8deg)",
              background: "linear-gradient(180deg, #FF7F1E 0%, #E27624 100%)",
            }}
          />

          {/* Magnifying Glass */}
          <div
            className="absolute w-[186.17px] h-[225.75px] right-0 top-0"
            style={{ transform: "rotate(2.39deg)" }}
          >
            {/* Handle */}
            <div
              className="absolute w-[24.51px] h-[76.12px] left-[-19.42px] top-[166.63px] bg-[#6F4124] rounded-[5.16px]"
              style={{ transform: "rotate(35.75deg)" }}
            />

            {/* Glass circle */}
            <div
              className="absolute w-[134.18px] h-[134.18px] left-[-14.93px] top-[19.42px] border-[12.9px] border-[#AAAAAA] rounded-full"
              style={{
                transform: "rotate(35.75deg)",
                background: "rgba(255, 255, 255, 0.3)",
              }}
            />

            {/* Search area highlight */}
            <div
              className="absolute w-[25.16px] h-[21.29px] left-[91.1px] top-[130.76px] border-[9px] border-white rounded"
              style={{ transform: "rotate(-179.41deg)" }}
            />
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
          <div className="w-12 h-12 border-4 border-[#FF6E00] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>

      {/* Loading Text */}
      <p className="absolute left-1/2 -translate-x-1/2 bottom-32 text-center text-[#3A3935] text-base">
        잠시만 기다려주세요...
      </p>

      {/* Debug: OCR 결과 표시 (개발용) */}
      {idCardInfo && process.env.NODE_ENV === "development" && (
        <div className="absolute left-4 right-4 bottom-48 bg-white p-4 rounded-lg shadow-lg text-sm">
          <p>
            <strong>이름:</strong> {idCardInfo.name}
          </p>
          <p>
            <strong>성별:</strong> {idCardInfo.gender}
          </p>
          <p>
            <strong>생년월일:</strong> {idCardInfo.birth_date}
          </p>
          <p>
            <strong>주소:</strong> {idCardInfo.address}
          </p>
        </div>
      )}
    </div>
  );
}
