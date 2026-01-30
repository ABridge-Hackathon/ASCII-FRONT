"use client";

interface SignUpCompleteProps {
  userName?: string;
  onStart: () => void;
}

export default function SignUpComplete({
  userName = "임영웅",
  onStart,
}: SignUpCompleteProps) {
  return (
    <div className="relative w-[360px] h-[800px] bg-gradient-to-b from-white via-white to-[#D1EBFF] mx-auto">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-10 flex justify-between items-center px-4">
        <div className="text-sm text-[#111111]">9:30</div>
        <div className="flex gap-1">
          <div className="w-4 h-4" />
          <div className="w-4 h-4" />
          <div className="w-4 h-4" />
        </div>
      </div>

      {/* Title */}
      <h1 className="absolute left-1/2 -translate-x-1/2 top-[90px] font-semibold text-2xl leading-[130%] tracking-[-0.03em] text-[#262931] text-center">
        가입 완료!
      </h1>

      {/* Description */}
      <p className="absolute left-1/2 -translate-x-1/2 top-[135px] w-[276px] font-semibold text-2xl leading-[130%] tracking-[-0.03em] text-[#262931] text-center">
        지금 {userName}님께
        <br />
        근처 복지관이 바로 연결됐어요
      </p>

      {/* Community Centers */}
      <div className="absolute inset-0 top-[236px]">
        {/* Center 1 - 아주복지관 (큰 원, 오른쪽 위) */}
        <div className="absolute left-[176px] top-0 flex flex-col items-center gap-3">
          <div className="w-[163px] h-[163px] rounded-full bg-gray-200 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="px-2 py-1 bg-blue-100 rounded">
              <span className="text-sm font-semibold text-[#0074C7]">
                수원시 팔달구
              </span>
            </div>
            <span className="text-lg font-semibold text-[#262931]">
              아주복지관
            </span>
          </div>
        </div>

        {/* Center 2 - 남구종합 사회복지관 (중간 원, 왼쪽) */}
        <div className="absolute left-[28px] top-[134px] flex flex-col items-center gap-3">
          <div className="w-[132px] h-[132px] rounded-full bg-gray-200 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="px-2 py-1 bg-green-100 rounded">
              <span className="text-sm font-semibold text-[#236723]">
                수원시 남구
              </span>
            </div>
            <span className="text-lg font-semibold text-[#262931] text-center leading-tight">
              남구종합
              <br />
              사회복지관
            </span>
          </div>
        </div>

        {/* Center 3 - 아스키복지관 (작은 원, 오른쪽 아래) */}
        <div className="absolute left-[183px] top-[261px] flex flex-col items-center gap-[11px]">
          <div className="w-[124px] h-[124px] rounded-full bg-gray-200 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="px-2 py-1 bg-blue-100 rounded-sm">
              <span className="text-[13px] font-semibold text-[#0074C7]">
                수원시 팔달구
              </span>
            </div>
            <span className="text-[17px] font-semibold text-[#262931]">
              아스키복지관
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-8">
        <button
          onClick={onStart}
          className="w-full h-[52px] bg-[#3A3935] rounded-lg flex items-center justify-center"
        >
          <span className="font-semibold text-xl text-white tracking-[-0.03em]">
            다음
          </span>
        </button>
      </div>
    </div>
  );
}
