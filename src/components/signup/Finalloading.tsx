"use client";

import { useEffect } from "react";

interface FinalLoadingProps {
  onComplete: () => void;
}

export default function FinalLoading({ onComplete }: FinalLoadingProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative w-full max-w-[500px] min-h-screen bg-white mx-auto">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-1 h-14 bg-white mt-10">
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
      <h1 className="mt-[89px] px-4 font-semibold text-2xl sm:text-[28px] leading-[130%] tracking-[-0.03em] text-[#262931] text-center">
        잠시만 기다려 주세요
      </h1>

      {/* Loading Illustration */}
      <div className="relative mt-[93px] mx-auto w-full max-w-[361px] aspect-[361/554] px-4">
        <div className="relative w-full h-full">
          {/* Green Background */}
          <div
            className="absolute w-[120%] h-[110%] left-[-35%] top-[51%] bg-[#6BC176] rounded-full"
            style={{ transform: "rotate(90deg)" }}
          />

          {/* Shadow */}
          <div className="absolute w-[45%] h-[9%] left-[26%] top-[52%] bg-[#4F9058] rounded-full blur-sm" />

          {/* Character */}
          <div
            className="absolute w-[70%] h-[45%] left-[10%] top-[8%]"
            style={{ transform: "rotate(-8.5deg)" }}
          >
            {/* Face/Body */}
            <div className="absolute w-full h-full bg-gradient-to-br from-[#FF7F1E] to-[#E27624] rounded-lg" />

            {/* Smile */}
            <div
              className="absolute w-[40%] h-[6%] left-[31%] top-[29%] border-[5.6px] border-[#3A3935] rounded-b-full"
              style={{
                transform: "rotate(-8.5deg)",
                background: "linear-gradient(180deg, #FF7F1E 0%, #E27624 100%)",
              }}
            />
          </div>

          {/* Hand waving */}
          <div
            className="absolute w-[25%] h-[12%] right-[13%] top-[12%] bg-[#FCD7AA] rounded-lg animate-[wave_1s_ease-in-out_infinite]"
            style={{ transform: "matrix(-0.06, 1, 1, 0.06, 0, 0)" }}
          />
          <div
            className="absolute w-[12%] h-[8%] right-[7%] top-[12%] bg-[#D9D9D9] rounded-full"
            style={{ transform: "matrix(-0.06, 1, 1, 0.06, 0, 0)" }}
          />
        </div>
      </div>

      {/* Loading Spinner */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2">
        <div className="w-12 h-12 border-4 border-[#FF6E00] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
