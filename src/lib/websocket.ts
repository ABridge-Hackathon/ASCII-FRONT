import { getAccessToken } from "@/utils/auth";

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number = 5000;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    const token = getAccessToken();

    if (!token) {
      throw new Error("No access token available");
    }

    // WebSocket 연결 시 토큰 전달 (쿼리 파라미터)
    this.ws = new WebSocket(`${this.url}?token=${token}`);

    this.ws.onopen = () => {
      console.log("WebSocket connected");

      // 또는 연결 후 인증 메시지 전송 방식
      // this.send({ type: 'auth', token });

      // 재연결 타이머 정리
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
      this.attemptReconnect();
    };
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not connected");
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private attemptReconnect() {
    if (this.reconnectTimer) return;

    this.reconnectTimer = setTimeout(() => {
      console.log("Attempting to reconnect...");
      try {
        this.connect();
      } catch (error) {
        console.error("Reconnection failed:", error);
      }
    }, this.reconnectInterval);
  }

  private handleMessage(data: any) {
    // 메시지 타입별 처리 로직
    switch (data.type) {
      case "message":
        console.log("Received message:", data.content);
        break;
      case "notification":
        console.log("Received notification:", data.content);
        break;
      default:
        console.log("Received data:", data);
    }
  }
}

// 사용 예제
// const wsClient = new WebSocketClient('ws://localhost:8000/ws/chat');
// wsClient.connect();
// wsClient.send({ type: 'message', content: 'Hello' });
