import React from "react";

interface FriendAddedChoiceScreenProps {
  onEndCall: () => void;
  onNextCall: () => void;
}

export default function FriendAddedChoiceScreen({
  onEndCall,
  onNextCall,
}: FriendAddedChoiceScreenProps) {
  return (
    <div className="relative w-full h-full bg-[#F3F3F3]">
      {/* 상단 메시지 */}
      <div className="absolute top-[150px] left-1/2 transform -translate-x-1/2 text-center">
        <h2 className="text-[#111111] text-[28px] font-semibold leading-[130%] tracking-[-0.03em]">
          송가인님과
          <br />
          친구를 맺었어요!
        </h2>
      </div>

      {/* 체크 아이콘 */}
      <div className="absolute top-[307.7px] left-1/2 transform -translate-x-1/2 w-[184.6px] h-[184.6px] flex items-center justify-center">
        <svg
          width="185"
          height="185"
          viewBox="0 0 185 185"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="92.5"
            cy="92.5"
            r="75"
            stroke="#32AAFF"
            strokeWidth="17.25"
            fill="none"
          />
          <path
            d="M55 92.5L80 117.5L130 67.5"
            stroke="#32AAFF"
            strokeWidth="17.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-[32px] left-4 right-4">
        <button
          onClick={onNextCall}
          className="w-full flex items-center justify-center px-2 py-2 h-[52px] bg-[#FF6E00] rounded-lg transition-all hover:bg-[#E66300]"
        >
          <span className="text-white text-xl font-semibold leading-[135%] tracking-[-0.03em]">
            다음
          </span>
        </button>
      </div>
    </div>
  );
}
