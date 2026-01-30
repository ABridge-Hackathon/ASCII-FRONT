import React from "react";

interface CallEndScreenProps {
  onAddFriend: () => void;
  onNextCall: () => void;
  partnerInfo?: {
    name: string;
    age: string;
    gender: string;
    location: string;
    profileImage?: string;
  };
  callDuration?: string;
}

export default function CallEndScreen({
  onAddFriend,
  onNextCall,
  partnerInfo = {
    name: "송가인",
    age: "71년생",
    gender: "여성",
    location: "우만동",
  },
  callDuration = "03:28",
}: CallEndScreenProps) {
  return (
    <div className="relative w-full h-full bg-[#111111]">
      {/* 상단 메시지 */}
      <div className="absolute top-[162px] left-1/2 transform -translate-x-1/2 text-center">
        <h2 className="text-white text-2xl font-medium leading-[130%] tracking-[-0.03em] mb-2">
          대화가 종료되었어요
        </h2>
        <p className="text-[#C0BBB6] text-xl font-medium leading-[135%] tracking-[-0.03em]">
          {callDuration}
        </p>
      </div>

      {/* 친구 정보 카드 */}
      <div className="absolute top-[371px] left-0 right-0 bottom-0 bg-white rounded-t-[25px]">
        {/* 제목 */}
        <h3 className="absolute top-[39px] left-1/2 transform -translate-x-1/2 text-[#111111] text-2xl font-semibold leading-[130%] tracking-[-0.03em] text-center">
          대화한 사람과 친구할까요?
        </h3>

        {/* 프로필 카드 */}
        <div className="absolute top-[100px] left-1/2 transform -translate-x-1/2 w-[328px] h-[217px] bg-[#F3F3F3] border border-[#EBE7E4] rounded-[12px]">
          {/* 프로필 이미지 */}
          <div className="absolute left-[30px] top-[19px] w-[139px] h-[178.58px] rounded-[12px] overflow-hidden bg-gray-300">
            {partnerInfo.profileImage ? (
              <img
                src={partnerInfo.profileImage}
                alt={partnerInfo.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-500">
                <span className="text-6xl">👤</span>
              </div>
            )}
          </div>

          {/* 정보 영역 */}
          <div className="absolute left-[197px] top-[37px]">
            {/* 이름 */}
            <h4 className="text-[#111111] text-[28px] font-semibold leading-[130%] tracking-[-0.03em] mb-[20px]">
              {partnerInfo.name}
            </h4>

            {/* 나이 */}
            <div className="flex items-center gap-3 mb-[10px]">
              <span className="text-[#918D89] text-sm font-semibold leading-[140%] tracking-[-0.03em]">
                나이
              </span>
              <span className="text-[#4F4E4A] text-base font-semibold leading-[135%] tracking-[-0.03em]">
                {partnerInfo.age}
              </span>
            </div>

            {/* 성별 */}
            <div className="flex items-center gap-3 mb-[10px]">
              <span className="text-[#918D89] text-sm font-semibold leading-[140%] tracking-[-0.03em]">
                성별
              </span>
              <span className="text-[#4F4E4A] text-base font-semibold leading-[135%] tracking-[-0.03em]">
                {partnerInfo.gender}
              </span>
            </div>

            {/* 지역 */}
            <div className="flex items-center gap-3">
              <span className="text-[#918D89] text-sm font-semibold leading-[140%] tracking-[-0.03em]">
                지역
              </span>
              <span className="text-[#4F4E4A] text-base font-semibold leading-[135%] tracking-[-0.03em]">
                {partnerInfo.location}
              </span>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="absolute bottom-[32px] left-4 right-4 flex items-center gap-2">
          {/* 아니요 버튼 */}
          <button
            onClick={onNextCall}
            className="flex items-center justify-center px-2 py-2 w-[108px] h-[52px] bg-[#4F4E4A] rounded-lg transition-all hover:bg-[#3A3935]"
          >
            <span className="text-white text-xl font-semibold leading-[135%] tracking-[-0.03em]">
              아니요
            </span>
          </button>

          {/* 친구할래요 버튼 */}
          <button
            onClick={onAddFriend}
            className="flex-1 flex items-center justify-center px-2 py-2 h-[52px] bg-[#FF6E00] rounded-lg transition-all hover:bg-[#E66300]"
          >
            <span className="text-white text-xl font-semibold leading-[135%] tracking-[-0.03em]">
              친구할래요
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
