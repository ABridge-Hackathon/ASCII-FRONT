"use client";

interface FacePhotoGuideProps {
  onNext: () => void;
  onClose: () => void;
}

export default function FacePhotoGuide({
  onNext,
  onClose,
}: FacePhotoGuideProps) {
  return (
    <div className="relative w-[360px] h-[800px] bg-black mx-auto overflow-hidden">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-10 flex justify-between items-center px-4 bg-black z-10">
        <div className="text-sm text-white">9:30</div>
        <div className="flex gap-1">
          <div className="w-4 h-4" />
          <div className="w-4 h-4" />
          <div className="w-4 h-4" />
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="absolute top-10 left-0 right-0 h-14 bg-black flex justify-between items-center px-1 z-10">
        <button
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="font-semibold text-lg text-white tracking-[-0.03em]">
          얼굴 사진 촬영
        </span>
        <div className="w-12 h-12" />
      </nav>

      {/* Title */}
      <h1 className="absolute left-4 top-[139px] font-semibold text-[28px] leading-[130%] tracking-[-0.03em] text-white z-10">
        얼굴을 촬영할게요
      </h1>

      {/* Description */}
      <p className="absolute left-4 top-[178px] w-[246px] font-medium text-lg leading-[140%] tracking-[-0.03em] text-white z-10">
        나를 보여줄 수 있는 사진이 필요해요
      </p>

      {/* Face Guide Oval */}
      <div className="absolute left-[37px] top-[271px] w-[286px] h-[328px] border-4 border-white rounded-[50%] z-10" />

      {/* Face Features Guide (Eyes and Smile) */}
      <div className="absolute left-[37px] top-[271px] w-[286px] h-[328px] z-10">
        {/* Left Eye */}
        <div className="absolute w-[21px] h-[38px] left-[97px] top-[117px] bg-white/50 rounded-full" />
        {/* Right Eye */}
        <div className="absolute w-[21px] h-[38px] left-[168px] top-[117px] bg-white/50 rounded-full" />
        {/* Smile */}
        <div
          className="absolute w-[82px] h-[28px] left-[102px] top-[189px] border-[10px] border-white/50 rounded-b-full"
          style={{ transform: "rotate(-1.82deg)" }}
        />
      </div>

      {/* Instruction Text */}
      <p className="absolute left-1/2 -translate-x-1/2 top-[613px] font-semibold text-lg text-white tracking-[-0.03em] text-center z-10">
        편안하게 미소지어 주세요!
      </p>

      {/* Capture Button */}
      <button
        onClick={onNext}
        className="absolute left-1/2 -translate-x-1/2 bottom-12 w-16 h-16 bg-white rounded-full border-4 border-white/50 z-10"
      />
    </div>
  );
}
