import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "영상통화 중",
  description: "영상통화를 진행하고 있습니다",
};

export default function CallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen overflow-hidden bg-[#111111]">
      {children}
    </div>
  );
}
