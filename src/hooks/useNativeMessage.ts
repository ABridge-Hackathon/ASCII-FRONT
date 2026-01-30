"use client";

import { useEffect } from "react";
import { setRefreshTokenFromNative } from "@/lib/auth";

export const useNativeMessage = () => {
  useEffect(() => {
    console.log("🔵 [Next.js] Native 메시지 리스너 등록됨");

    const handleMessage = (event: MessageEvent) => {
      console.log("📨 [Next.js] 메시지 받음:", event.data);

      try {
        const message = JSON.parse(event.data);
        console.log("✅ [Next.js] 파싱된 메시지:", message);

        switch (message.type) {
          case "REFRESH_TOKEN":
            if (message.token) {
              setRefreshTokenFromNative(message.token);
              console.log(
                "🔑 [Next.js] Refresh Token 받음:",
                message.token.substring(0, 20) + "...",
              );
            } else {
              console.log("⚠️ [Next.js] Refresh Token이 비어있음");
            }
            break;

          default:
            console.log("❓ [Next.js] 알 수 없는 메시지 타입:", message.type);
            break;
        }
      } catch (error) {
        console.log("⚠️ [Next.js] JSON 파싱 실패 (일반 메시지):", event.data);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("message", handleMessage);
      document.addEventListener("message", handleMessage as any);

      console.log("🔵 [Next.js] 리스너 등록 완료");

      // React Native 환경 체크
      if (window.ReactNativeWebView) {
        console.log("📱 [Next.js] React Native WebView 환경 감지됨");
        console.log("📤 [Next.js] Native에 Refresh Token 요청 전송");

        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "GET_REFRESH_TOKEN",
          }),
        );
      } else {
        console.log("🌐 [Next.js] 일반 브라우저 환경 (WebView 아님)");
      }
    }

    return () => {
      console.log("🔴 [Next.js] 리스너 제거됨");
      if (typeof window !== "undefined") {
        window.removeEventListener("message", handleMessage);
        document.removeEventListener("message", handleMessage as any);
      }
    };
  }, []);
};
