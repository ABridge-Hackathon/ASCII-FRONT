"use client";

import "./globals.css";
import Link from "next/link";
import { useNativeMessage } from "@/hooks/useNativeMessage";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useNativeMessage();

  return (
    <html lang="ko">
      <body>
        {/* <nav className="bg-blue-600 text-white p-4">
          <div className="max-w-6xl mx-auto flex gap-4">
            <Link href="/" className="hover:underline">
              📹 카메라 테스트
            </Link>
            <Link href="/websocket" className="hover:underline">
              🌐 WebSocket 테스트
            </Link>
            <Link href="/call" className="hover:underline font-bold">
              🎥 영상통화
            </Link>
          </div>
        </nav> */}
        {children}
      </body>
    </html>
  );
}
