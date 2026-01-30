// app/test/page.tsx
"use client";

import { useState } from "react";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "@/utils/auth";

export default function TestPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev]);
    console.log(message);
  };

  const testSendToNative = () => {
    if (window.ReactNativeWebView) {
      addLog("📤 Native에 테스트 메시지 전송");
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "TEST_MESSAGE",
          data: "Hello from Next.js!",
        }),
      );
    } else {
      addLog("❌ ReactNativeWebView를 찾을 수 없음 (일반 브라우저)");
    }
  };

  const testSaveToken = () => {
    const testToken = "test_refresh_token_" + Date.now();
    addLog("💾 테스트 토큰 저장 시도: " + testToken);

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "SAVE_REFRESH_TOKEN",
          token: testToken,
        }),
      );
      addLog("✅ Native로 저장 요청 전송됨");
    } else {
      addLog("❌ ReactNativeWebView를 찾을 수 없음");
    }
  };

  const testRequestToken = () => {
    addLog("🔍 Native에 토큰 요청");

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "GET_REFRESH_TOKEN",
        }),
      );
      addLog("✅ 요청 전송됨, 메시지 대기 중...");
    } else {
      addLog("❌ ReactNativeWebView를 찾을 수 없음");
    }
  };

  const testDeleteToken = () => {
    addLog("🗑️ Native에 토큰 삭제 요청");

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "DELETE_REFRESH_TOKEN",
        }),
      );
      addLog("✅ 삭제 요청 전송됨");
    } else {
      addLog("❌ ReactNativeWebView를 찾을 수 없음");
    }
  };

  const checkCurrentTokens = () => {
    const access = getAccessToken();
    const refresh = getRefreshToken();

    addLog(
      "🔑 Access Token: " + (access ? access.substring(0, 30) + "..." : "없음"),
    );
    addLog(
      "🔑 Refresh Token: " +
        (refresh ? refresh.substring(0, 30) + "..." : "없음"),
    );
  };

  const checkEnvironment = () => {
    addLog("🌐 환경 체크:");
    addLog(
      "- ReactNativeWebView: " +
        (window.ReactNativeWebView ? "✅ 존재" : "❌ 없음"),
    );
    addLog("- User Agent: " + navigator.userAgent.substring(0, 50) + "...");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Native ↔ Next.js 통신 테스트
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">테스트 버튼</h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={checkEnvironment}
              className="bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600"
            >
              🌐 환경 체크
            </button>

            <button
              onClick={testSendToNative}
              className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600"
            >
              📤 Native로 테스트 메시지
            </button>

            <button
              onClick={testSaveToken}
              className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600"
            >
              💾 토큰 저장 테스트
            </button>

            <button
              onClick={testRequestToken}
              className="bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-600"
            >
              🔍 토큰 요청 테스트
            </button>

            <button
              onClick={testDeleteToken}
              className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600"
            >
              🗑️ 토큰 삭제 테스트
            </button>

            <button
              onClick={checkCurrentTokens}
              className="bg-indigo-500 text-white px-4 py-3 rounded-lg hover:bg-indigo-600"
            >
              🔑 현재 토큰 확인
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">로그</h2>
            <button
              onClick={() => setLogs([])}
              className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          </div>

          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">로그가 여기에 표시됩니다...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
