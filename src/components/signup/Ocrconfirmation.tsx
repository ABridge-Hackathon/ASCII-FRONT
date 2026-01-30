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
      <h1 className="absolute left-4 top-[116px] font-semibold text-[28px] leading-[130%] tracking-[-0.03em] text-[#262931]">
        이 정보가 맞나요?
      </h1>

      {/* Description */}
      <p className="absolute left-4 top-[160px] w-[227px] font-medium text-lg leading-[140%] tracking-[-0.03em] text-[#918D89]">
        나중에 정보를 수정하기 어려워요.
        <br />꼭 꼼꼼하게 확인해 주세요!
      </p>

      {/* Information Card */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[255px] w-[328px] h-[158px] bg-[#F3F3F3] rounded-xl p-6">
        {/* 이름 */}
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium text-base text-[#918D89]">이름</span>
          <span className="font-medium text-base text-[#3A3935]">
            {idCardInfo.name}
          </span>
        </div>

        {/* 생년월일 */}
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium text-base text-[#918D89]">생년월일</span>
          <span className="font-medium text-base text-[#3A3935]">
            {idCardInfo.birth_date}
          </span>
        </div>

        {/* 성별 */}
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium text-base text-[#918D89]">성별</span>
          <span className="font-medium text-base text-[#3A3935]">
            {idCardInfo.gender}
          </span>
        </div>

        {/* 거주지 */}
        <div className="flex justify-between items-center">
          <span className="font-medium text-base text-[#918D89]">거주지</span>
          <span className="font-medium text-base text-[#3A3935]">
            {idCardInfo.address}
          </span>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 flex flex-col gap-2">
        {/* 맞아요 버튼 */}
        <button
          onClick={onConfirm}
          className="w-full h-[52px] bg-[#FF6E00] rounded-lg flex items-center justify-center"
        >
          <span className="font-semibold text-xl text-white tracking-[-0.03em]">
            맞아요
          </span>
        </button>

        {/* 아니요 버튼 */}
        <button
          onClick={onRetry}
          className="w-full h-[52px] bg-[#F3F3F3] rounded-lg flex items-center justify-center"
        >
          <span className="font-semibold text-xl text-[#3A3935] tracking-[-0.03em]">
            아니요, 정보가 달라요
          </span>
        </button>
      </div>
    </div>
  );
}
