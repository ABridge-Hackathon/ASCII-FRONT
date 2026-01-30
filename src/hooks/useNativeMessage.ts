/**
 * React Native WebView 메시지 리스너 훅
 * - Native에서 보낸 메시지 수신
 * - Refresh Token 자동 요청
 */

"use client";

import { useEffect } from "react";
import { setRefreshTokenFromNative } from "@/utils/auth";

export const useNativeMessage = () => {
  useEffect(() => {
    console.log("🔵 Native 메시지 리스너 등록");

    const handleMessage = (event: MessageEvent) => {
      console.log("📨 Native 메시지 받음:", event.data);

      try {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case "REFRESH_TOKEN":
            if (message.token) {
              setRefreshTokenFromNative(message.token);
              console.log(
                "✅ Refresh Token 받음:",
                message.token.substring(0, 20) + "...",
              );
            } else {
              console.warn("⚠️ Refresh Token이 비어있음");
            }
            break;

          default:
            console.log("❓ 알 수 없는 메시지 타입:", message.type);
            break;
        }
      } catch (error) {
        console.warn("⚠️ JSON 파싱 실패 (일반 메시지):", event.data);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("message", handleMessage);
      document.addEventListener("message", handleMessage as any);

      // React Native 환경 체크
      if (window.ReactNativeWebView) {
        console.log("📱 React Native WebView 환경 감지됨");
        console.log("📤 Native에 Refresh Token 요청");

        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "GET_REFRESH_TOKEN",
          }),
        );
      } else {
        console.log("🌐 일반 브라우저 환경");
      }
    }

    return () => {
      console.log("🔴 Native 리스너 제거");
      if (typeof window !== "undefined") {
        window.removeEventListener("message", handleMessage);
        document.removeEventListener("message", handleMessage as any);
      }
    };
  }, []);
};
