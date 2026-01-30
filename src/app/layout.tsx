"use client";

import "./globals.css";
import { useNativeMessage } from "@/hooks/useNativeMessage";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useNativeMessage();

  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
