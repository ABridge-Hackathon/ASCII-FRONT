"use client";

interface AgeRestrictionProps {
  onExit: () => void;
}

export default function AgeRestriction({ onExit }: AgeRestrictionProps) {
  return (
    <div className="relative w-[360px] h-[800px] bg-white mx-auto">
      {/* Status Bar
      <div className="absolute top-0 left-0 right-0 h-10 flex justify-between items-center px-4">
        <div className="text-sm text-[#111111]">9:30</div>
        <div className="flex gap-1">
          <div className="w-4 h-4" />
          <div className="w-4 h-4" />
          <div className="w-4 h-4" />
        </div>
      </div> */}

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
      <h1 className="absolute left-4 top-[127px] w-[315px] font-semibold text-[28px] leading-[130%] tracking-[-0.03em] text-[#262931]">
        잠깐, 50세 이하는
        <br />
        가입할 수 없어요
      </h1>

      {/* Description */}
      <p className="absolute left-4 top-[212px] w-[253px] font-medium text-lg leading-[140%] tracking-[-0.03em] text-[#918D89]">
        관심 가져주셔서 감사하지만,
        <br />
        함보까는 어르신 분들만의 공간이에요
      </p>

      {/* Illustration */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[304px] w-[291px] h-[291px]">
        {/* Character with magnifying glass - simplified version */}
        <div className="relative w-full h-full">
          {/* Face/Body */}
          <div
            className="absolute w-[233px] h-[232px] left-[13px] top-[15px] bg-[#FF7F1E] rounded-lg"
            style={{ transform: "rotate(-8.5deg)" }}
          />

          {/* Eyes */}
          <div
            className="absolute w-[10px] h-[17px] left-[155px] top-[68px] bg-[#3A3935] rounded-full"
            style={{ transform: "rotate(-0.46deg)" }}
          />
          <div
            className="absolute w-[10px] h-[17px] left-[122px] top-[67px] bg-[#3A3935] rounded-full"
            style={{ transform: "rotate(-0.46deg)" }}
          />

          {/* Smile - curved line */}
          <div
            className="absolute w-[49px] h-[4px] left-[118px] top-[97px] border-[5px] border-[#3A3935] rounded-b-full"
            style={{
              transform: "rotate(0.8deg)",
              background: "linear-gradient(180deg, #FF7F1E 0%, #E27624 100%)",
            }}
          />

          {/* Eyebrows */}
          <div
            className="absolute w-[11px] h-[1px] left-[161px] top-[59px] border-t-[3px] border-[rgba(111,65,36,0.5)]"
            style={{ transform: "rotate(16.78deg)" }}
          />
          <div
            className="absolute w-[11px] h-[1px] left-[118px] top-[58px] border-t-[3px] border-[rgba(111,65,36,0.5)]"
            style={{ transform: "rotate(-16.78deg)" }}
          />

          {/* Magnifying Glass */}
          <div
            className="absolute w-[90px] h-[109px] left-[131px] top-[185px]"
            style={{ transform: "rotate(151.72deg)" }}
          >
            {/* Handle */}
            <div
              className="absolute w-[12px] h-[37px] left-[72px] top-[-7px] bg-[#6F4124] rounded"
              style={{ transform: "rotate(-174.92deg)" }}
            />

            {/* Glass circle */}
            <div
              className="absolute w-[65px] h-[65px] left-[39px] top-[31px] border-[6px] border-[#AAAAAA] rounded-full"
              style={{
                transform: "rotate(-174.92deg)",
                background: "rgba(255, 255, 255, 0.3)",
              }}
            />

            {/* Magnified area */}
            <div
              className="absolute w-[12px] h-[10px] left-[49px] top-[53px] border-[4px] border-white rounded"
              style={{ transform: "rotate(-30.07deg)" }}
            />
          </div>

          {/* Hand holding magnifying glass */}
          <div
            className="absolute w-[73px] h-[57px] left-[175px] top-[120px] bg-[#FCD7AA] rounded"
            style={{ transform: "rotate(-62.45deg)" }}
          />
          <div
            className="absolute w-[57px] h-[40px] left-[189px] top-[142px] bg-[#D9D9D9] rounded-full"
            style={{ transform: "rotate(-62.45deg)" }}
          />
        </div>
      </div>

      {/* Exit Button */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-8">
        <button
          onClick={onExit}
          className="w-full h-[52px] bg-[#3A3935] rounded-lg flex items-center justify-center"
        >
          <span className="font-semibold text-xl text-white tracking-[-0.03em]">
            나가기
          </span>
        </button>
      </div>
    </div>
  );
}
