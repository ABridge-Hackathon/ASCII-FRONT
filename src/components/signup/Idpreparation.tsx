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
      <h1 className="absolute left-4 top-[127px] font-semibold text-2xl leading-[130%] tracking-[-0.03em] text-[#262931]">
        신분증을 준비해 주세요
      </h1>

      {/* Description */}
      <p className="absolute left-4 top-[179px] w-[302px] font-semibold text-lg leading-[135%] tracking-[-0.03em] text-[#3A3935]">
        주민등록증 또는 운전면허증을 준비해주세요. 인쇄물이나 화면이 아닌 실제
        신분증을 촬영하주세요. 임시 신분증은 쓸 수 없어요.
      </p>

      {/* ID Card Illustration */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[319px] w-[339px] h-[238px]">
        <div className="absolute left-[33.55px] top-[36.08px] w-[270.9px] h-[164.85px]">
          {/* Card Background */}
          <div className="absolute w-full h-full bg-[#E7EBED] rounded-[8.4px]" />

          {/* Photo area */}
          <div className="absolute w-[98.7px] h-[118.65px] right-0 top-[12.6px] bg-[#DCDCDC] rounded-[8.4px]" />

          {/* Rotated Card */}
          <div
            className="absolute w-[152.58px] h-[151.6px] -left-[31.5px] top-[9.45px]"
            style={{ transform: "rotate(-8.5deg)" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-[#FF7F1E] to-[#E27624]" />
          </div>

          {/* Card Details */}
          <div className="absolute left-[21px] top-[26.25px] w-[44.1px] h-[11.55px] bg-[#808FA3] rounded-full" />
          <div className="absolute left-[69.3px] top-[26.25px] w-[26.25px] h-[11.55px] bg-[#808FA3] rounded-full" />

          <div className="absolute left-[21px] top-[92.4px] w-[50.4px] h-[8.4px] bg-[#CBD1D9] rounded-full" />
          <div className="absolute left-[76.65px] top-[92.4px] w-[48.3px] h-[8.4px] bg-[#CBD1D9] rounded-full" />
          <div className="absolute left-[21px] top-[110.25px] w-[73.5px] h-[8.4px] bg-[#CBD1D9] rounded-full" />
          <div className="absolute left-[101.85px] top-[140.7px] w-[73.5px] h-[8.4px] bg-[#CBD1D9] rounded-full" />

          {/* Colored shapes */}
          <div className="absolute left-[23.62px] top-[63px] w-[18.9px] h-[18.9px] bg-[#FFE14F] rounded-sm" />
          <div className="absolute left-[49.35px] top-[64.05px] w-[17.85px] h-[17.85px] bg-[#32AAFF] rounded-sm" />
          <div className="absolute left-[71.4px] top-[63px] w-[24.15px] h-[24.15px] bg-[#AD4AD2] rounded-sm" />

          {/* Corner brackets */}
          <svg
            className="absolute left-[23.05px] top-[25.58px]"
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
          >
            <path
              d="M0 4.2V0H4.2M0 16.8V21H4.2"
              stroke="rgba(50, 170, 255, 0.5)"
              strokeWidth="4.2"
            />
          </svg>
          <svg
            className="absolute right-[23.05px] top-[25.58px]"
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
          >
            <path
              d="M21 4.2V0H16.8M21 16.8V21H16.8"
              stroke="rgba(50, 170, 255, 0.5)"
              strokeWidth="4.2"
            />
          </svg>
          <svg
            className="absolute left-[23.05px] bottom-[25.58px]"
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
          >
            <path
              d="M0 16.8V21H4.2M0 4.2V0H4.2"
              stroke="rgba(50, 170, 255, 0.5)"
              strokeWidth="4.2"
            />
          </svg>
          <svg
            className="absolute right-[23.05px] bottom-[25.58px]"
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
          >
            <path
              d="M21 16.8V21H16.8M21 4.2V0H16.8"
              stroke="rgba(50, 170, 255, 0.5)"
              strokeWidth="4.2"
            />
          </svg>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-8">
        <button
          onClick={handleCapture}
          className="w-full h-[52px] bg-[#FF6E00] rounded-lg flex items-center justify-center"
        >
          <span className="font-semibold text-xl text-white tracking-[-0.03em]">
            신분증 촬영하기
          </span>
        </button>
      </div>
    </div>
  );
}
