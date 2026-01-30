/**
 * WebSocket 연결 테스트 페이지
 * /test/ws-debug 에 배치
 */

"use client";

import { useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { WS_BASE_URL, WS_RECONNECT_CONFIG } from "@/utils/config";
import { getAccessToken } from "@/utils/auth";

export default function WebSocketDebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState("test123");
  const [useToken, setUseToken] = useState(false);
  const [useReconnecting, setUseReconnecting] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev]);
    console.log(message);
  };

  // 테스트 1: 기본 WebSocket (토큰 없음)
  const testBasicWebSocket = () => {
    addLog("🔵 테스트 1: 기본 WebSocket (토큰 없음)");
    const wsUrl = `${WS_BASE_URL}/ws/signaling/${sessionId}/`;
    addLog(`URL: ${wsUrl}`);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      addLog("✅ WebSocket 연결 성공!");
    };

    ws.onerror = (error) => {
      addLog(`❌ WebSocket 에러: ${error}`);
    };

    ws.onclose = (event) => {
      addLog(
        `📌 WebSocket 종료 (code: ${event.code}, reason: ${event.reason})`,
      );
    };

    ws.onmessage = (event) => {
      addLog(`📩 메시지: ${event.data}`);
    };

    // 5초 후 종료
    setTimeout(() => {
      ws.close();
      addLog("🔴 WebSocket 수동 종료");
    }, 5000);
  };

  // 테스트 2: 기본 WebSocket (토큰 포함)
  const testWebSocketWithToken = () => {
    addLog("🔵 테스트 2: 기본 WebSocket (토큰 포함)");
    const token = getAccessToken();
    const wsUrl = `${WS_BASE_URL}/ws/signaling/${sessionId}/?token=${token}`;
    addLog(`URL: ${wsUrl}`);
    addLog(`Token: ${token?.substring(0, 20)}...`);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      addLog("✅ WebSocket 연결 성공!");
    };

    ws.onerror = (error) => {
      addLog(`❌ WebSocket 에러: ${error}`);
    };

    ws.onclose = (event) => {
      addLog(
        `📌 WebSocket 종료 (code: ${event.code}, reason: ${event.reason})`,
      );
    };

    ws.onmessage = (event) => {
      addLog(`📩 메시지: ${event.data}`);
    };

    // 5초 후 종료
    setTimeout(() => {
      ws.close();
      addLog("🔴 WebSocket 수동 종료");
    }, 5000);
  };

  // 테스트 3: ReconnectingWebSocket (토큰 포함)
  const testReconnectingWebSocket = () => {
    addLog("🔵 테스트 3: ReconnectingWebSocket (토큰 포함)");
    const token = getAccessToken();
    const wsUrl = `${WS_BASE_URL}/ws/signaling/${sessionId}/?token=${token}`;
    addLog(`URL: ${wsUrl}`);
    addLog(`Token: ${token?.substring(0, 20)}...`);
    addLog(`Config: ${JSON.stringify(WS_RECONNECT_CONFIG)}`);

    const ws = new ReconnectingWebSocket(wsUrl, [], WS_RECONNECT_CONFIG);

    ws.onopen = () => {
      addLog("✅ ReconnectingWebSocket 연결 성공!");
    };

    ws.onerror = (error) => {
      addLog(`❌ ReconnectingWebSocket 에러: ${error}`);
    };

    ws.onclose = (event) => {
      addLog(`📌 ReconnectingWebSocket 종료 (code: ${event.code})`);
    };

    ws.onmessage = (event) => {
      addLog(`📩 메시지: ${event.data}`);
    };

    // 5초 후 종료
    setTimeout(() => {
      ws.close();
      addLog("🔴 ReconnectingWebSocket 수동 종료");
    }, 5000);
  };

  // 테스트 4: 개발자 도구와 동일한 방식
  const testDevToolsMethod = () => {
    addLog("🔵 테스트 4: 개발자 도구 방식 (토큰 없음)");
    const wsUrl = `ws://15.165.159.68:8000/ws/signaling/${sessionId}/`;
    addLog(`URL: ${wsUrl}`);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      addLog("✅ WS OPEN");
    };

    ws.onerror = (error) => {
      addLog(`❌ WS ERROR: ${error}`);
    };

    ws.onclose = (event) => {
      addLog(`📌 WS CLOSE (code: ${event.code})`);
    };

    ws.onmessage = (event) => {
      addLog(`📩 MESSAGE: ${event.data}`);
    };

    // 5초 후 종료
    setTimeout(() => {
      ws.close();
      addLog("🔴 WS CLOSED");
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">WebSocket 연결 디버깅</h1>

        {/* 설정 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">설정</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Session ID</label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="test123"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-semibold">WS_BASE_URL</p>
              <p className="text-gray-600">{WS_BASE_URL}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-semibold">Access Token</p>
              <p className="text-gray-600 truncate">
                {getAccessToken()?.substring(0, 30)}...
              </p>
            </div>
          </div>
        </div>

        {/* 테스트 버튼 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">테스트 실행</h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={testBasicWebSocket}
              className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600"
            >
              1️⃣ 기본 WebSocket (토큰 없음)
            </button>

            <button
              onClick={testWebSocketWithToken}
              className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600"
            >
              2️⃣ 기본 WebSocket (토큰 포함)
            </button>

            <button
              onClick={testReconnectingWebSocket}
              className="bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600"
            >
              3️⃣ ReconnectingWebSocket (코드 방식)
            </button>

            <button
              onClick={testDevToolsMethod}
              className="bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600"
            >
              4️⃣ 개발자 도구 방식
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded">
            <p className="font-semibold mb-1">💡 테스트 순서 추천:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>4번(개발자 도구 방식) 먼저 실행 → 성공하면 서버는 정상</li>
              <li>1번(기본, 토큰 없음) 실행 → 실패하면 토큰 필요한 서버</li>
              <li>2번(기본, 토큰 포함) 실행 → 실패하면 토큰 문제</li>
              <li>
                3번(코드 방식) 실행 → 실패하면 ReconnectingWebSocket 또는 Config
                문제
              </li>
            </ol>
          </div>
        </div>

        {/* 로그 */}
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

        {/* 안내 */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
          <p className="font-semibold text-yellow-800 mb-2">🔍 디버깅 팁</p>
          <ul className="list-disc list-inside text-yellow-700 space-y-1">
            <li>각 테스트는 5초 후 자동으로 연결을 종료합니다</li>
            <li>콘솔(F12)에서도 동일한 로그를 확인할 수 있습니다</li>
            <li>
              WebSocket 연결 실패 시 code를 확인하세요 (1006=비정상 종료,
              1002=프로토콜 에러 등)
            </li>
            <li>토큰이 필요한지 확인하려면 1번과 2번을 비교하세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
