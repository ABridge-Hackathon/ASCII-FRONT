"use client";

import { useState, useRef, useEffect } from "react";

interface VerificationCodeInputProps {
  phoneNumber: string;
  onNext: (code: string) => void;
  onBack: () => void;
  onError: () => void;
  onResend: () => void;
  disabled?: boolean;
}

export default function VerificationCodeInput({
  phoneNumber,
  onNext,
  onBack,
  onError,
  onResend,
  disabled = false,
}: VerificationCodeInputProps) {
  const [code, setCode] = useState<string[]>(["", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(180); // 기본 3분
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    // 5개가 모두 입력되면 자동으로 검증
    if (code.every((digit) => digit !== "") && !isVerifying && !disabled) {
      verifyCode();
    }
  }, [code]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // 다음 입력 필드로 자동 포커스
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 5) {
      return;
    }

    setIsVerifying(true);
    try {
      // 부모 컴포넌트에서 실제 검증 처리
      onNext(fullCode);
    } catch (error) {
      onError();
      setCode(["", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    if (disabled) return;

    setCode(["", "", "", "", ""]);
    setTimeLeft(180);
    inputRefs.current[0]?.focus();
    onResend();
  };

  return (
    <div className="relative w-full max-w-[360px] h-screen bg-white">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 h-10 gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-roboto text-[#111111]">9:30</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4"></div>
        </div>
      </div>

      {/* Navbar */}
      <div className="flex justify-between items-center px-1 h-14 bg-white">
        <button
          onClick={onBack}
          disabled={isVerifying || disabled}
          className="w-12 h-12 flex items-center justify-center disabled:opacity-50"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="#4F4E4A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pt-5">
        <h1 className="text-[28px] font-semibold leading-[130%] tracking-[-0.03em] text-[#262931] mb-8">
          {phoneNumber}에 전송된
          <br />
          인증번호를 적어주세요
        </h1>

        {/* Code Input */}
        <div className="flex gap-1.5 mb-6">
          {code.map((digit, index) => (
            <div
              key={index}
              className="flex-1 h-[78px] bg-[#F3F3F3] rounded-lg flex items-center justify-center"
            >
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isVerifying || disabled}
                className="w-full h-full bg-transparent text-center text-[32px] font-bold leading-[130%] tracking-[-0.03em] text-[#3A3935] outline-none disabled:opacity-50"
              />
            </div>
          ))}
        </div>

        {/* Resend Button */}
        <button
          onClick={handleResend}
          disabled={disabled || isVerifying || timeLeft <= 0}
          className="w-full h-12 border border-[#F3EFEC] rounded-lg flex items-center justify-center mb-6 disabled:opacity-50"
        >
          <span className="text-lg font-medium leading-[140%] tracking-[-0.03em] text-[#7B7874]">
            인증번호 다시 보내기
          </span>
        </button>
      </div>

      {/* Bottom Buttons */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 flex gap-2">
        <button className="w-[122px] h-[52px] bg-[#F3F3F3] rounded-lg flex items-center justify-center">
          <span className="text-xl font-semibold leading-[135%] tracking-[-0.03em] text-[#3A3935]">
            도와주세요
          </span>
        </button>
        <button
          onClick={verifyCode}
          disabled={
            isVerifying ||
            disabled ||
            code.some((digit) => digit === "") ||
            timeLeft <= 0
          }
          className="flex-1 h-[52px] bg-[#FF6E00] rounded-lg flex items-center justify-center disabled:opacity-50"
        >
          <span className="text-xl font-semibold leading-[135%] tracking-[-0.03em] text-white">
            {isVerifying ? "확인 중..." : `완료 (${formatTime(timeLeft)})`}
          </span>
        </button>
      </div>
    </div>
  );
}
