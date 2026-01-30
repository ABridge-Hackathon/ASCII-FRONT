"use client";

import { useState, useEffect, useRef } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

interface Message {
  sender: string;
  content: string;
  time: string;
}

interface ConnectionStats {
  retries: number;
  lastConnected: string | null;
  lastDisconnected: string | null;
}

export default function WebSocketTest() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [serverUrl, setServerUrl] = useState("ws://localhost:8000/ws/test/");
  const [stats, setStats] = useState<ConnectionStats>({
    retries: 0,
    lastConnected: null,
    lastDisconnected: null,
  });

  const ws = useRef<ReconnectingWebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (sender: string, content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        sender,
        content,
        time: new Date().toLocaleTimeString("ko-KR"),
      },
    ]);
  };

  const connect = () => {
    try {
      console.log("WebSocket 연결 시도:", serverUrl);

      ws.current = new ReconnectingWebSocket(serverUrl, [], {
        maxRetries: 10,
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000,
        reconnectionDelayGrowFactor: 1.5,
        connectionTimeout: 4000,
        debug: true,
      });

      ws.current.addEventListener("open", () => {
        console.log("✅ WebSocket 연결됨");
        setConnected(true);
        setStats((prev) => ({
          ...prev,
          lastConnected: new Date().toLocaleTimeString("ko-KR"),
          retries: 0,
        }));
        addMessage("시스템", "✅ 서버에 연결되었습니다.");
      });

      ws.current.addEventListener("message", (event) => {
        console.log("📩 메시지 수신:", event.data);
        try {
          const data = JSON.parse(event.data);
          addMessage("서버", JSON.stringify(data, null, 2));
        } catch (e) {
          addMessage("서버", event.data);
        }
      });

      ws.current.addEventListener("error", (error) => {
        console.error("❌ WebSocket 에러:", error);
        addMessage("에러", "연결 오류가 발생했습니다.");
        setStats((prev) => ({ ...prev, retries: prev.retries + 1 }));
      });

      ws.current.addEventListener("close", (event) => {
        console.log("🔌 WebSocket 연결 종료:", event.code, event.reason);
        setConnected(false);
        setStats((prev) => ({
          ...prev,
          lastDisconnected: new Date().toLocaleTimeString("ko-KR"),
        }));
        addMessage("시스템", `🔌 연결이 종료되었습니다. (코드: ${event.code})`);

        if (!event.wasClean) {
          addMessage("시스템", "⏳ 재연결을 시도합니다...");
        }
      });
    } catch (error) {
      console.error("연결 에러:", error);
      addMessage("에러", (error as Error).message);
    }
  };

  const disconnect = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
      addMessage("시스템", "사용자가 연결을 종료했습니다.");
    }
  };

  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = {
        type: "test",
        content: inputMessage,
        timestamp: new Date().toISOString(),
      };
      ws.current.send(JSON.stringify(message));
      addMessage("나", inputMessage);
      setInputMessage("");
    } else {
      alert("서버에 연결되어 있지 않습니다.");
    }
  };

  const sendPing = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const ping = { type: "ping", timestamp: Date.now() };
      ws.current.send(JSON.stringify(ping));
      addMessage("나", "🏓 PING 전송");
    }
  };

  const sendCustomMessage = (type: string, data?: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = {
        type,
        ...data,
        timestamp: new Date().toISOString(),
      };
      ws.current.send(JSON.stringify(message));
      addMessage("나", `📤 ${type} 메시지 전송`);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const getReadyStateText = () => {
    if (!ws.current) return "연결 안됨";

    switch (ws.current.readyState) {
      case WebSocket.CONNECTING:
        return "연결 중...";
      case WebSocket.OPEN:
        return "연결됨";
      case WebSocket.CLOSING:
        return "연결 종료 중...";
      case WebSocket.CLOSED:
        return "연결 종료됨";
      default:
        return "알 수 없음";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          🌐 WebSocket 연결 테스트
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 연결 설정 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 상태 표시 */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold mb-3 text-lg">연결 상태</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                  />
                  <span className="font-semibold">{getReadyStateText()}</span>
                </div>

                {stats.lastConnected && (
                  <p className="text-sm text-gray-600">
                    마지막 연결: {stats.lastConnected}
                  </p>
                )}

                {stats.lastDisconnected && (
                  <p className="text-sm text-gray-600">
                    마지막 종료: {stats.lastDisconnected}
                  </p>
                )}

                {stats.retries > 0 && (
                  <p className="text-sm text-orange-600">
                    재시도 횟수: {stats.retries}
                  </p>
                )}
              </div>
            </div>

            {/* URL 입력 */}
            <div className="bg-white rounded-lg shadow p-4">
              <label className="block font-bold mb-2">서버 URL</label>
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                disabled={connected}
                className="w-full p-2 border rounded text-sm disabled:bg-gray-100"
                placeholder="ws://localhost:8000/ws/test/"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Django Channels 엔드포인트를 입력하세요
              </p>
            </div>

            {/* 연결 버튼 */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold mb-3">연결 관리</h3>
              <div className="space-y-2">
                {!connected ? (
                  <button
                    onClick={connect}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    🔌 연결하기
                  </button>
                ) : (
                  <button
                    onClick={disconnect}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    🔌 연결 해제
                  </button>
                )}
              </div>
            </div>

            {/* 테스트 메시지 */}
            {connected && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold mb-3">빠른 테스트</h3>
                <div className="space-y-2">
                  <button
                    onClick={sendPing}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded text-sm"
                  >
                    🏓 PING
                  </button>
                  <button
                    onClick={() => sendCustomMessage("match-request")}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-sm"
                  >
                    🔍 매칭 요청
                  </button>
                  <button
                    onClick={() =>
                      sendCustomMessage("test", { data: "test123" })
                    }
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded text-sm"
                  >
                    📝 테스트 메시지
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽: 메시지 로그 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 메시지 로그 */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">메시지 로그</h3>
                <button
                  onClick={clearMessages}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  🗑️ 지우기
                </button>
              </div>

              <div className="border rounded p-3 h-96 overflow-y-auto bg-gray-50 font-mono text-sm">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    메시지가 없습니다
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className="mb-3 pb-3 border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">
                          [{msg.time}]
                        </span>
                        <span
                          className={`font-semibold text-sm ${
                            msg.sender === "시스템"
                              ? "text-blue-600"
                              : msg.sender === "서버"
                                ? "text-green-600"
                                : msg.sender === "나"
                                  ? "text-purple-600"
                                  : "text-red-600"
                          }`}
                        >
                          {msg.sender}:
                        </span>
                      </div>
                      <div className="text-sm whitespace-pre-wrap break-words pl-4">
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="mt-3 text-xs text-gray-500">
                총 {messages.length}개 메시지
              </div>
            </div>

            {/* 메시지 입력 */}
            {connected && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold mb-3">메시지 전송</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 p-2 border rounded"
                    placeholder="메시지 입력... (Enter로 전송)"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim()}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded"
                  >
                    전송
                  </button>
                </div>
              </div>
            )}

            {/* 사용 가이드 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold mb-2 text-blue-800">💡 사용 가이드</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• ReconnectingWebSocket을 사용하여 자동 재연결</li>
                <li>• 연결이 끊어지면 자동으로 재시도합니다</li>
                <li>• Django Channels 엔드포인트를 입력하세요</li>
                <li>• JSON 형식으로 메시지를 주고받습니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
