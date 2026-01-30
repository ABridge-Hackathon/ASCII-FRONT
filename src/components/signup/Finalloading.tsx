"use client";

import { useEffect } from "react";

interface FinalLoadingProps {
  onComplete: () => void;
}

export default function FinalLoading({ onComplete }: FinalLoadingProps) {
  useEffect(() => {
    // 3초 후 완료 화면으로
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative w-[360px] h-[800px] bg-white mx-auto">
      {/* Status Bar */}
      {/* <div className="absolute top-0 left-0 right-0 h-10 flex justify-between items-center px-4">
        <div className="text-sm text-[#111111]">9:30</div>
        <div className="flex gap-1">
          <div className="w-4 h-4" />
          <div className="w-4 h-4" />
          <div className="w-4 h-4" />
        </div>
      </div> */}

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
      <h1 className="absolute left-1/2 -translate-x-1/2 top-[153px] font-semibold text-[28px] leading-[130%] tracking-[-0.03em] text-[#262931] text-center">
        잠시만 기다려 주세요
      </h1>

      {/* Loading Illustration */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[246px] w-[361px] h-[554px]">
        {/* Green Background */}
        <div
          className="absolute w-[439px] h-[603px] left-[-129px] top-[284px] bg-[#6BC176] rounded-full"
          style={{ transform: "rotate(90deg)" }}
        />

        {/* Shadow */}
        <div className="absolute w-[160px] h-[49px] left-[94px] top-[289px] bg-[#4F9058] rounded-full" />

        {/* Character */}
        <div
          className="absolute w-[253px] h-[251px] left-[37px] top-[47px]"
          style={{ transform: "rotate(-8.5deg)" }}
        >
          {/* Face/Body */}
          <div className="absolute w-full h-full bg-gradient-to-br from-[#FF7F1E] to-[#E27624] rounded-lg" />

          {/* Smile */}
          <div
            className="absolute w-[101px] h-[15px] left-[79px] top-[74px] border-[5.6px] border-[#3A3935] rounded-b-full"
            style={{
              transform: "rotate(-8.5deg)",
              background: "linear-gradient(180deg, #FF7F1E 0%, #E27624 100%)",
            }}
          />
        </div>

        {/* Hand waving */}
        <div
          className="absolute w-[90px] h-[68px] right-[46px] top-[66px] bg-[#FCD7AA] rounded-lg animate-[wave_1s_ease-in-out_infinite]"
          style={{ transform: "matrix(-0.06, 1, 1, 0.06, 0, 0)" }}
        />
        <div
          className="absolute w-[44px] h-[43px] right-[24px] top-[67px] bg-[#D9D9D9] rounded-full"
          style={{ transform: "matrix(-0.06, 1, 1, 0.06, 0, 0)" }}
        />
      </div>

      {/* Loading Spinner */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-32">
        <div className="w-12 h-12 border-4 border-[#FF6E00] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
