"use client";

import { IDCardInfo } from "@/lib/api";

interface OCRConfirmationProps {
  idCardInfo: IDCardInfo | null;
  onConfirm: () => void;
  onRetry: () => void;
}

export default function OCRConfirmation({
  idCardInfo,
  onConfirm,
  onRetry,
}: OCRConfirmationProps) {
  if (!idCardInfo) return null;

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
      <h1 className="mt-[52px] px-4 font-semibold text-2xl sm:text-[28px] leading-[130%] tracking-[-0.03em] text-[#262931] rowrap">
        이 정보가 맞나요?
      </h1>

      {/* Description */}
      <p className="mt-[44px] px-4 max-w-[227px] font-medium text-base sm:text-lg leading-[140%] tracking-[-0.03em] text-[#918D89] rowrap">
        나중에 정보를 수정하기 어려워요.
        <br />꼭 꼼꼼하게 확인해 주세요!
      </p>

      {/* Information Card */}
      <div className="mt-[95px] mx-4 max-w-[328px] bg-[#F3F3F3] rounded-xl p-6">
        {/* 이름 */}
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium text-sm sm:text-base text-[#918D89]">
            이름
          </span>
          <span className="font-medium text-sm sm:text-base text-[#3A3935]">
            {idCardInfo.name}
          </span>
        </div>

        {/* 생년월일 */}
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium text-sm sm:text-base text-[#918D89]">
            생년월일
          </span>
          <span className="font-medium text-sm sm:text-base text-[#3A3935]">
            {idCardInfo.birth_date}
          </span>
        </div>

        {/* 성별 */}
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium text-sm sm:text-base text-[#918D89]">
            성별
          </span>
          <span className="font-medium text-sm sm:text-base text-[#3A3935]">
            {idCardInfo.gender}
          </span>
        </div>

        {/* 거주지 */}
        <div className="flex justify-between items-center">
          <span className="font-medium text-sm sm:text-base text-[#918D89]">
            거주지
          </span>
          <span className="font-medium text-sm sm:text-base text-[#3A3935] text-right max-w-[60%] break-words">
            {idCardInfo.address}
          </span>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto px-4 pb-8 flex flex-col gap-2 bg-white">
        {/* 맞아요 버튼 */}
        <button
          onClick={onConfirm}
          className="w-full h-[52px] bg-[#FF6E00] rounded-lg flex items-center justify-center"
        >
          <span className="font-semibold text-lg sm:text-xl text-white tracking-[-0.03em]">
            맞아요
          </span>
        </button>

        {/* 아니요 버튼 */}
        <button
          onClick={onRetry}
          className="w-full h-[52px] bg-[#F3F3F3] rounded-lg flex items-center justify-center"
        >
          <span className="font-semibold text-lg sm:text-xl text-[#3A3935] tracking-[-0.03em]">
            아니요, 정보가 달라요
          </span>
        </button>
      </div>
    </div>
  );
}
