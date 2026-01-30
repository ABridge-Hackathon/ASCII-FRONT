"use client";

interface AgeRestrictionProps {
  onExit: () => void;
}

export default function AgeRestriction({ onExit }: AgeRestrictionProps) {
  return (
    <div className="relative w-full max-w-[500px] min-h-screen bg-white mx-auto">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-1 h-14 bg-white mt-10">
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
      <h1 className="mt-[63px] px-4 max-w-[315px] font-semibold text-2xl sm:text-[28px] leading-[130%] tracking-[-0.03em] text-[#262931]">
        잠깐, 50세 이하는
        <br />
        가입할 수 없어요
      </h1>

      {/* Description */}
      <p className="mt-[25px] px-4 max-w-[253px] font-medium text-base sm:text-lg leading-[140%] tracking-[-0.03em] text-[#918D89]">
        관심 가져주셔서 감사하지만,
        <br />
        함보까는 어르신 분들만의 공간이에요
      </p>

      {/* Illustration */}
      <div className="mt-[92px] mx-auto w-full max-w-[291px] aspect-square px-4">
        <div className="relative w-full h-full">
          {/* Face/Body */}
          <div
            className="absolute w-[80%] h-[80%] left-[4.5%] top-[5.2%] bg-[#FF7F1E] rounded-lg"
            style={{ transform: "rotate(-8.5deg)" }}
          />

          {/* Eyes */}
          <div
            className="absolute w-[3.4%] h-[5.8%] left-[53.3%] top-[23.4%] bg-[#3A3935] rounded-full"
            style={{ transform: "rotate(-0.46deg)" }}
          />
          <div
            className="absolute w-[3.4%] h-[5.8%] left-[41.9%] top-[23%] bg-[#3A3935] rounded-full"
            style={{ transform: "rotate(-0.46deg)" }}
          />

          {/* Smile */}
          <div
            className="absolute w-[16.8%] h-[1.4%] left-[40.5%] top-[33.3%] border-[5px] border-[#3A3935] rounded-b-full"
            style={{
              transform: "rotate(0.8deg)",
              background: "linear-gradient(180deg, #FF7F1E 0%, #E27624 100%)",
            }}
          />

          {/* Eyebrows */}
          <div
            className="absolute w-[3.8%] h-[0.3%] left-[55.3%] top-[20.3%] border-t-[3px] border-[rgba(111,65,36,0.5)]"
            style={{ transform: "rotate(16.78deg)" }}
          />
          <div
            className="absolute w-[3.8%] h-[0.3%] left-[40.5%] top-[19.9%] border-t-[3px] border-[rgba(111,65,36,0.5)]"
            style={{ transform: "rotate(-16.78deg)" }}
          />

          {/* Magnifying Glass */}
          <div
            className="absolute w-[30.9%] h-[37.5%] left-[45%] top-[63.6%]"
            style={{ transform: "rotate(151.72deg)" }}
          >
            {/* Handle */}
            <div
              className="absolute w-[13.3%] h-[33.9%] left-[80%] top-[-6.4%] bg-[#6F4124] rounded"
              style={{ transform: "rotate(-174.92deg)" }}
            />

            {/* Glass circle */}
            <div
              className="absolute w-[72.2%] h-[59.6%] left-[43.3%] top-[28.4%] border-[6px] border-[#AAAAAA] rounded-full"
              style={{
                transform: "rotate(-174.92deg)",
                background: "rgba(255, 255, 255, 0.3)",
              }}
            />

            {/* Magnified area */}
            <div
              className="absolute w-[13.3%] h-[9.2%] left-[54.4%] top-[48.6%] border-[4px] border-white rounded"
              style={{ transform: "rotate(-30.07deg)" }}
            />
          </div>

          {/* Hand holding magnifying glass */}
          <div
            className="absolute w-[25.1%] h-[19.6%] left-[60.1%] top-[41.2%] bg-[#FCD7AA] rounded"
            style={{ transform: "rotate(-62.45deg)" }}
          />
          <div
            className="absolute w-[19.6%] h-[13.7%] left-[64.9%] top-[48.8%] bg-[#D9D9D9] rounded-full"
            style={{ transform: "rotate(-62.45deg)" }}
          />
        </div>
      </div>

      {/* Exit Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto px-4 pb-8 bg-white">
        <button
          onClick={onExit}
          className="w-full h-[52px] bg-[#3A3935] rounded-lg flex items-center justify-center"
        >
          <span className="font-semibold text-lg sm:text-xl text-white tracking-[-0.03em]">
            나가기
          </span>
        </button>
      </div>
    </div>
  );
}
