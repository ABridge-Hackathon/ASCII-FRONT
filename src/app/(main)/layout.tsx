import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "랜덤 영상통화",
  description: "새로운 사람들과 랜덤 영상통화를 즐겨보세요",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-[#111111]">
      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* 하단 네비게이션 바 */}
      <nav className="h-20 bg-[#1a1a1a] border-t border-gray-800 flex items-center justify-around px-4">
        <a
          href="/call"
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
          </svg>
          <span className="text-xs">전화하기</span>
        </a>

        <a
          href="/test"
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
              fill="currentColor"
            />
          </svg>
          <span className="text-xs">친구</span>
        </a>

        <a
          href="/profile"
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              fill="currentColor"
            />
          </svg>
          <span className="text-xs">마이</span>
        </a>
      </nav>
    </div>
  );
}
