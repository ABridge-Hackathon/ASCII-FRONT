"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CallStartPage() {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleCallStart = () => {
    router.push("/call");
  };

  return (
    <div className="relative w-full h-full">
      {/* 상단 배너 */}
      <div className="absolute w-[328px] h-[112px] left-1/2 -translate-x-1/2 top-[46px] rounded-[10px] overflow-hidden">
        <div
          className="absolute w-[348px] h-[121px] left-1/2 -translate-x-1/2 top-[-2px]"
          style={{
            background: "url(/banner-image.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* 메인 텍스트 */}
      <h1 className="absolute w-[132px] h-[72px] left-1/2 -translate-x-1/2 top-[209px] font-[NanumSquare_Neo_OTF] font-extrabold text-[25.949px] leading-[140%] text-center tracking-[-0.03em] text-[#111111]">
        내 근처 친구 함 보까?
      </h1>

      {/* 애니메이션 원들 */}
      <div className="absolute w-[282px] h-[282px] left-1/2 -translate-x-1/2 top-[321px]">
        {/* 가장 바깥 원 - 회색 */}
        <div
          className={`absolute w-full h-full rounded-full bg-[#EBE7E4] transition-all duration-1000 ${
            isAnimating ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        />

        {/* 중간 원 - 노란색 */}
        <div
          className={`absolute w-[229.18px] h-[229.18px] left-[27.35px] top-[26.41px] rounded-full bg-[#FFE14F] transition-all duration-1000 delay-150 ${
            isAnimating ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        />

        {/* 메인 버튼 - 클릭 가능한 주황색 원 */}
        <button
          onClick={handleCallStart}
          className={`absolute w-[176.37px] h-[176.37px] left-[53.76px] top-[52.82px] rounded-full bg-[#FF6E00] flex items-center justify-center transition-all duration-1000 delay-300 hover:scale-105 active:scale-95 ${
            isAnimating ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          {/* 전화 아이콘 */}
          <svg
            width="85"
            height="77"
            viewBox="0 0 85 77"
            fill="none"
            className="relative"
          >
            <path
              d="M71.3 61.82C71.3 63.15 70.95 64.52 70.2 65.86C69.45 67.2 68.5 68.45 67.25 69.6C65.15 71.65 62.85 73.1 60.3 73.97C57.8 74.84 55.1 75.28 52.2 75.28C47.65 75.28 42.8 74.27 37.7 72.23C32.6 70.19 27.5 67.37 22.45 63.77C17.35 60.12 12.55 56.02 8.05 51.47C3.6 46.87 -0.5 42.07 -4.15 37.07C-7.75 32.12 -10.57 27.32 -12.61 22.67C-14.65 18.02 -15.68 13.62 -15.68 9.47C-15.68 6.62 -15.19 3.92 -14.22 1.42C-13.25 -1.13 -11.74 -3.48 -9.69 -5.58C-6.99 -8.38 -4.04 -9.78 -0.89 -9.78C0.26 -9.78 1.41 -9.48 2.46 -8.88C3.56 -8.28 4.51 -7.43 5.21 -6.38L12.1 4.37C12.8 5.37 13.3 6.27 13.65 7.12C14 8.02 14.2 8.87 14.2 9.62C14.2 10.62 13.9 11.62 13.3 12.57C12.75 13.52 11.95 14.52 10.95 15.52L7.8 18.77C7.35 19.22 7.15 19.77 7.15 20.47C7.15 20.82 7.2 21.12 7.3 21.47C7.45 21.82 7.6 22.07 7.7 22.32C8.4 23.62 9.6 25.32 11.3 27.42C13.05 29.52 14.95 31.67 17.05 33.82C19.2 36.02 21.3 38.07 23.45 39.92C25.55 41.72 27.25 42.87 28.6 43.57C28.8 43.67 29.05 43.82 29.35 43.97C29.7 44.12 30.05 44.17 30.45 44.17C31.2 44.17 31.75 43.92 32.2 43.47L35.3 40.42C36.35 39.37 37.35 38.57 38.3 38.07C39.25 37.47 40.2 37.17 41.25 37.17C42 37.17 42.8 37.32 43.7 37.67C44.6 38.02 45.5 38.52 46.5 39.17L57.45 46.17C58.5 46.82 59.35 47.62 59.95 48.62C60.5 49.62 60.8 50.62 60.8 51.72L71.3 61.82Z"
              fill="white"
              transform="translate(21, 12)"
            />
          </svg>
        </button>
      </div>

      {/* 하단 설명 툴팁 */}
      <div className="absolute w-[226px] h-[88px] left-[68px] top-[617px]">
        {/* 말풍선 꼬리 */}
        <div
          className="absolute w-10 h-10 left-[92px] top-0 bg-white"
          style={{
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            borderRadius: "3px",
          }}
        />

        {/* 말풍선 본체 */}
        <div className="absolute w-[226px] h-[66px] left-0 top-[22px] bg-white rounded-[10px] flex items-center justify-center px-6">
          <p className="text-lg font-semibold leading-[135%] text-center tracking-[-0.03em] text-[#3A3935]">
            누르면 근처 친구와
            <br />
            얼굴보며 대화할 수 있어요
          </p>
        </div>
      </div>
    </div>
  );
}
