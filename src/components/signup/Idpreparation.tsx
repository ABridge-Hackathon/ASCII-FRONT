"use client";

interface IDPreparationProps {
  onNext: () => void;
  onBack: () => void;
}

export default function IDPreparation({ onNext, onBack }: IDPreparationProps) {
  const handleCapture = () => {
    onNext();
  };

  return (
    <div className="relative w-full max-w-[500px] min-h-screen bg-white mx-auto">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-1 h-14 bg-white">
        <button
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center"
        >
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
        신분증을 준비해 주세요
      </h1>

      {/* Description */}
      <p className="mt-[52px] px-4 max-w-[302px] font-semibold text-base sm:text-lg leading-[135%] tracking-[-0.03em] text-[#3A3935]">
        주민등록증 또는 운전면허증을 준비해주세요. 인쇄물이나 화면이 아닌 실제
        신분증을 촬영하주세요. 임시 신분증은 쓸 수 없어요.
      </p>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto px-4 pb-8 bg-white">
        <button
          onClick={handleCapture}
          className="w-full h-[52px] bg-[#FF6E00] rounded-lg flex items-center justify-center"
        >
          <span className="font-semibold text-lg sm:text-xl text-white tracking-[-0.03em]">
            신분증 촬영하기
          </span>
        </button>
      </div>
    </div>
  );
}
