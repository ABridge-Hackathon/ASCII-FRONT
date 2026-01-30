import React from "react";

interface NextCallChoiceScreenProps {
  onEndCall: () => void;
  onNextCall: () => void;
}

export default function NextCallChoiceScreen({
  onEndCall,
  onNextCall,
}: NextCallChoiceScreenProps) {
  return (
    <div className="relative w-full h-full bg-[#F3F3F3]">
      {/* 상단 메시지 */}
      <div className="absolute top-[170px] left-1/2 transform -translate-x-1/2 text-center">
        <h2 className="text-[#111111] text-[28px] font-semibold leading-[130%] tracking-[-0.03em]">
          더 대화해 볼까요?
        </h2>
      </div>

      {/* 선택 카드 영역 */}
      <div className="absolute top-[326px] left-4 right-4 flex gap-9">
        {/* 그만하기 카드 */}
        <button
          onClick={onEndCall}
          className="w-40 h-[197px] bg-[#FE5454] rounded-[20px] transition-all hover:bg-[#E04848] active:scale-95 relative"
        >
          {/* X 아이콘 */}
          <div className="absolute top-9 left-1/2 transform -translate-x-1/2">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 14L34 34M34 14L14 34"
                stroke="white"
                strokeWidth="4.7"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* 텍스트 */}
          <div className="absolute top-[116px] left-1/2 transform -translate-x-1/2">
            <span className="text-white text-2xl font-bold leading-[130%] tracking-[-0.03em]">
              그만하기
            </span>
          </div>
        </button>

        {/* 다른 친구랑 대화하기 카드 */}
        <button
          onClick={onNextCall}
          className="w-40 h-[197px] bg-[#3A3935] rounded-[20px] transition-all hover:bg-[#2E2D2A] active:scale-95 relative"
        >
          {/* 화살표 아이콘 */}
          <div className="absolute top-[39px] left-1/2 transform -translate-x-1/2">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 24H34M34 24L24 14M34 24L24 34"
                stroke="white"
                strokeWidth="4.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* 텍스트 */}
          <div className="absolute top-[100px] left-1/2 transform -translate-x-1/2 text-center">
            <span className="text-white text-2xl font-bold leading-[130%] tracking-[-0.03em] whitespace-pre-line">
              다른 친구랑{"\n"}대화하기
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
