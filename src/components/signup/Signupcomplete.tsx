"use client";

interface SignUpCompleteProps {
  userName?: string;
  onStart: () => void;
}

export default function SignUpComplete({
  userName = "임의웅",
  onStart,
}: SignUpCompleteProps) {
  return (
    <div className="relative w-full max-w-[500px] min-h-screen bg-gradient-to-b from-white via-white to-[#D1EBFF] mx-auto">
      {/* Title */}
      <h1 className="mt-[40px] px-4 font-semibold text-xl sm:text-2xl leading-[130%] tracking-[-0.03em] text-[#262931] text-center">
        가입 완료!
      </h1>

      {/* Description */}
      <p className="mt-[45px] px-4 font-semibold text-xl sm:text-2xl leading-[130%] tracking-[-0.03em] text-[#262931] text-center">
        지금 {userName}님께
        <br />
        근처 복지관이 바로 연결됐어요
      </p>

      {/* Community Centers */}
      <div className="relative mt-[100px] px-4 min-h-[400px]">
        {/* Center 1 - 아주복지관 */}
        <div className="absolute right-[10%] top-0 flex flex-col items-center gap-3 max-w-[45%]">
          <div className="w-[120px] sm:w-[163px] h-[120px] sm:h-[163px] rounded-full bg-gray-200 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="px-2 py-1 bg-blue-100 rounded">
              <span className="text-xs sm:text-sm font-semibold text-[#0074C7]">
                수원시 팔달구
              </span>
            </div>
            <span className="text-sm sm:text-lg font-semibold text-[#262931] text-center">
              아주복지관
            </span>
          </div>
        </div>

        {/* Center 2 - 남구종합 사회복지관 */}
        <div className="absolute left-[5%] top-[100px] flex flex-col items-center gap-3 max-w-[40%]">
          <div className="w-[100px] sm:w-[132px] h-[100px] sm:h-[132px] rounded-full bg-gray-200 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="px-2 py-1 bg-green-100 rounded">
              <span className="text-xs sm:text-sm font-semibold text-[#236723]">
                수원시 남구
              </span>
            </div>
            <span className="text-sm sm:text-lg font-semibold text-[#262931] text-center leading-tight">
              남구종합
              <br />
              사회복지관
            </span>
          </div>
        </div>

        {/* Center 3 - 아스키복지관 */}
        <div className="absolute right-[8%] top-[220px] flex flex-col items-center gap-[11px] max-w-[38%]">
          <div className="w-[95px] sm:w-[124px] h-[95px] sm:h-[124px] rounded-full bg-gray-200 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="px-2 py-1 bg-blue-100 rounded-sm">
              <span className="text-xs sm:text-[13px] font-semibold text-[#0074C7]">
                수원시 팔달구
              </span>
            </div>
            <span className="text-sm sm:text-[17px] font-semibold text-[#262931] text-center">
              아스키복지관
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto px-4 pb-8 bg-gradient-to-t from-[#D1EBFF] to-transparent pt-4">
        <button
          onClick={onStart}
          className="w-full h-[52px] bg-[#3A3935] rounded-lg flex items-center justify-center"
        >
          <span className="font-semibold text-lg sm:text-xl text-white tracking-[-0.03em]">
            다음
          </span>
        </button>
      </div>
    </div>
  );
}
