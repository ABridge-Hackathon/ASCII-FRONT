"use client";

// import "../global.css";
import { useNativeMessage } from "@/hooks/useNativeMessage";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useNativeMessage();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <html lang="ko">
      <body>
        <div className="relative w-[360px] h-[800px] mx-auto bg-gradient-to-b from-[#F3F3F3] to-[#F3F3F3]">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-[40px] flex justify-between items-center px-4 gap-1 z-10">
            {/* Time & Date */}
            <div className="flex items-center gap-2 w-[128px] h-[40px]">
              <span className="text-sm font-normal text-[#171D1B] tracking-[0.25px]">
                9:30
              </span>
            </div>

            {/* Status Icons */}
            <div className="flex justify-end items-center w-[46px] h-[52px]">
              {/* Wi-Fi */}
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-full h-full relative">
                  <div className="absolute left-[4.17%] right-[4.17%] top-[18.5%] bottom-[16.67%] bg-[#171D1B]" />
                </div>
              </div>
              {/* Signal */}
              <div className="w-4 h-4 flex items-center justify-center -mx-[2px]">
                <div className="w-full h-full relative">
                  <div className="absolute left-[8.33%] right-[8.33%] top-[8.33%] bottom-[8.33%] bg-[#171D1B]" />
                </div>
              </div>
              {/* Battery */}
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="absolute w-[8.5px] h-[14.17px] bg-[#171D1B]" />
              </div>
            </div>

            {/* Camera */}
            <div className="absolute left-1/2 top-2 -translate-x-1/2 w-6 h-6 bg-[#2E2E2E] rounded-full z-20" />
          </div>

          {/* Main Content */}
          <div className="relative h-[calc(100%-72px)]">{children}</div>

          {/* Bottom Navigation Bar */}
          <nav className="absolute bottom-0 left-0 right-0 w-[360px] h-[72px] bg-white border-t border-[#F3EFEC] flex justify-between items-center px-10 gap-[45px]">
            {/* 전화 걸기 */}
            <button
              onClick={() => router.push("/call-start")}
              className={`flex flex-col justify-center items-center gap-[2px] w-[90px] h-[72px] ${
                pathname === "/" ? "" : ""
              }`}
            >
              <div className="w-7 h-7 relative">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <path
                    d="M21.13 18.94C21.13 19.26 21.06 19.59 20.91 19.91C20.76 20.23 20.57 20.53 20.32 20.81C19.9 21.27 19.43 21.6 18.9 21.81C18.38 22.02 17.81 22.13 17.2 22.13C16.28 22.13 15.29 21.92 14.25 21.49C13.21 21.06 12.17 20.49 11.14 19.79C10.1 19.08 9.1 18.31 8.15 17.47C7.21 16.62 6.34 15.75 5.55 14.86C4.77 14.12 4.08 13.39 3.48 12.67C2.89 11.94 2.42 11.23 2.08 10.54C1.75 9.84 1.5 9.17 1.34 8.53C1.19 7.88 1.11 7.27 1.11 6.69C1.11 6.09 1.21 5.52 1.42 5C1.63 4.47 1.96 3.99 2.42 3.57C3 2.99 3.64 2.7 4.32 2.7C4.59 2.7 4.86 2.76 5.1 2.88C5.35 3 5.57 3.18 5.74 3.44L8.19 7.02C8.36 7.27 8.48 7.5 8.57 7.72C8.66 7.93 8.71 8.14 8.71 8.33C8.71 8.57 8.64 8.81 8.5 9.04C8.37 9.27 8.18 9.51 7.94 9.75L7.14 10.58C7.03 10.69 6.98 10.82 6.98 10.98C6.98 11.06 6.99 11.13 7.01 11.21C7.04 11.29 7.07 11.35 7.09 11.41C7.26 11.71 7.55 12.1 7.96 12.57C8.38 13.04 8.83 13.52 9.31 14C9.8 14.49 10.27 14.95 10.75 15.37C11.22 15.78 11.61 16.06 11.92 16.23C11.97 16.25 12.03 16.28 12.1 16.31C12.18 16.34 12.26 16.35 12.35 16.35C12.52 16.35 12.65 16.29 12.76 16.18L13.56 15.39C13.81 15.14 14.05 14.95 14.28 14.83C14.51 14.69 14.74 14.62 15 14.62C15.19 14.62 15.39 14.66 15.61 14.75C15.83 14.84 16.06 14.96 16.31 15.12L19.94 17.6C20.2 17.77 20.38 17.97 20.49 18.21C20.59 18.45 20.65 18.69 20.65 18.95L21.13 18.94Z"
                    fill={pathname === "/call-start" ? "#3A3935" : "#3A3935"}
                  />
                </svg>
              </div>
              <span
                className={`text-sm font-semibold text-center tracking-[-0.03em] ${
                  pathname === "/" ? "text-[#3A3935]" : "text-[#3A3935]"
                }`}
              >
                전화 걸기
              </span>
            </button>

            {/* 친구들 */}
            <button
              onClick={() => router.push("/friends")}
              className="flex flex-col justify-center items-center gap-[2px] w-[90px] h-[72px]"
            >
              <div className="w-7 h-7 relative">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle
                    cx="14"
                    cy="14"
                    r="10.5"
                    fill={pathname === "/friends" ? "#3A3935" : "#A7A39F"}
                  />
                  <circle
                    cx="10.85"
                    cy="11.55"
                    r="1.73"
                    fill="white"
                    stroke={pathname === "/friends" ? "#3A3935" : "#A7A39F"}
                    strokeWidth="1.16"
                  />
                  <circle
                    cx="17.15"
                    cy="11.55"
                    r="1.73"
                    fill="white"
                    stroke={pathname === "/friends" ? "#3A3935" : "#A7A39F"}
                    strokeWidth="1.16"
                  />
                  <path
                    d="M10 17.5C10 17.5 11.5 19 14 19C16.5 19 18 17.5 18 17.5"
                    stroke="white"
                    strokeWidth="1.16"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span
                className={`text-sm font-semibold text-center tracking-[-0.03em] ${
                  pathname === "/friends" ? "text-[#3A3935]" : "text-[#A7A39F]"
                }`}
              >
                친구들
              </span>
            </button>

            {/* 나 */}
            <button
              onClick={() => router.push("/mypage")}
              className="flex flex-col justify-center items-center gap-[2px] w-[90px] h-[72px]"
            >
              <div className="w-7 h-7 relative">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle
                    cx="14"
                    cy="8.5"
                    r="5.38"
                    fill={pathname === "/mypage" ? "#3A3935" : "#A7A39F"}
                  />
                  <path
                    d="M4.13 25.55C4.13 20.58 8.15 16.56 13.12 16.56H14.88C19.85 16.56 23.87 20.58 23.87 25.55"
                    fill={pathname === "/mypage" ? "#3A3935" : "#A7A39F"}
                  />
                </svg>
              </div>
              <span
                className={`text-sm font-semibold text-center tracking-[-0.03em] ${
                  pathname === "/mypage" ? "text-[#3A3935]" : "text-[#A7A39F]"
                }`}
              >
                나
              </span>
            </button>
          </nav>
        </div>
      </body>
    </html>
  );
}
