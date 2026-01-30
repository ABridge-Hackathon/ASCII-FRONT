"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      //   const userData = await authAPI.getCurrentUser();
      //   setUser(userData);
      setUser({ username: "테스트유저" });
    } catch (error) {
      // 인증되지 않은 경우 로그인 페이지로
      //   router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    router.push("/login");
  };

  const handleStartCall = () => {
    router.push("/call");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">랜덤 영상통화</h1>
              <p className="text-gray-600">
                환영합니다, {user?.username || "사용자"}님!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              로그아웃
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">영상통화 시작</h2>
          <p className="text-gray-600 mb-6">
            랜덤 매칭을 시작하려면 아래 버튼을 클릭하세요.
          </p>
          <button
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition text-lg font-semibold"
            onClick={handleStartCall}
          >
            랜덤 매칭 시작
          </button>
        </div>
      </div>
    </div>
  );
}
