"use client";

import { authAPI } from "@/lib/api";
import "./globals.css";
import { useNativeMessage } from "@/hooks/useNativeMessage";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useNativeMessage();

  // useEffect(() => {
  //   const fetchToken = async () => {
  //     try {
  //       const result = await authAPI.getDevJWT();
  //       if (result.data != null) {
  //         console.log(result.data.accessToken);
  //         console.log(result.data.isRegistered);
  //       }
  //     } catch (error) {
  //       console.error("JWT fetch error:", error);
  //     }
  //   };

  //   fetchToken();
  // }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
