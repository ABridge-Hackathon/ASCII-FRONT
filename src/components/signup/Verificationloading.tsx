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
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative w-full max-w-[500px] min-h-screen bg-white mx-auto">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-1 h-14 bg-white">
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
      <h1 className="mt-[63px] px-4 font-semibold text-xl sm:text-2xl leading-[130%] tracking-[-0.03em] text-[#262931]">
        신분증을 확인하고 있어요
      </h1>

      {/* Loading Animation */}
      <div className="mt-[161px] mx-auto w-full max-w-[323.76px] aspect-square px-4">
        <div className="relative w-full h-full animate-pulse">
          {/* ID Card */}
          <div
            className="absolute w-[80%] h-[79.4%] left-[4.4%] top-[5.1%] bg-[#FF7F1E] rounded-lg"
            style={{ transform: "rotate(-8.5deg)" }}
          />

          {/* Eyes */}
          <div
            className="absolute w-[3.4%] h-[5.8%] left-[53.2%] top-[23.2%] bg-[#3A3935] rounded-full"
            style={{ transform: "rotate(-0.46deg)" }}
          />
          <div
            className="absolute w-[3.4%] h-[5.8%] left-[41.7%] top-[23%] bg-[#3A3935] rounded-full"
            style={{ transform: "rotate(-0.46deg)" }}
          />

          {/* Smile */}
          <div
            className="absolute w-[24.5%] h-[3.5%] left-[37.2%] top-[31.2%] border-[5.74px] border-[#3A3935] rounded-b-full"
            style={{
              transform: "rotate(0.8deg)",
              background: "linear-gradient(180deg, #FF7F1E 0%, #E27624 100%)",
            }}
          />

          {/* Magnifying Glass */}
          <div
            className="absolute w-[57.5%] h-[69.7%] right-0 top-0"
            style={{ transform: "rotate(2.39deg)" }}
          >
            {/* Handle */}
            <div
              className="absolute w-[13.2%] h-[33.7%] left-[-10.4%] top-[73.8%] bg-[#6F4124] rounded-[5.16px]"
              style={{ transform: "rotate(35.75deg)" }}
            />

            {/* Glass circle */}
            <div
              className="absolute w-[72.1%] h-[59.4%] left-[-8%] top-[8.6%] border-[12.9px] border-[#AAAAAA] rounded-full"
              style={{
                transform: "rotate(35.75deg)",
                background: "rgba(255, 255, 255, 0.3)",
              }}
            />

            {/* Search area highlight */}
            <div
              className="absolute w-[13.5%] h-[9.4%] left-[48.9%] top-[57.9%] border-[9px] border-white rounded"
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
      <p className="fixed bottom-32 left-0 right-0 text-center text-[#3A3935] text-sm sm:text-base px-4">
        잠시만 기다려주세요...
      </p>

      {/* Debug: OCR 결과 표시 (개발용) */}
      {idCardInfo && process.env.NODE_ENV === "development" && (
        <div className="fixed left-4 right-4 bottom-48 max-w-[500px] mx-auto bg-white p-4 rounded-lg shadow-lg text-xs sm:text-sm">
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
