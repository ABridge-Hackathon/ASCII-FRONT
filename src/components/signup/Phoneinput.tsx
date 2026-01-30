"use client";

import { useState } from "react";

interface PhoneInputProps {
  onNext: (phoneNumber: string) => void;
  onBack: () => void;
  disabled?: boolean;
}

export default function PhoneInput({
  onNext,
  onBack,
  disabled = false,
}: PhoneInputProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleNext = () => {
    const numbers = phoneNumber.replace(/[^\d]/g, "");
    if (numbers.length === 11 && !disabled) {
      onNext(phoneNumber);
    }
  };

  const isComplete = phoneNumber.replace(/[^\d]/g, "").length === 11;

  return (
    <div className="relative w-full max-w-[500px] min-h-screen bg-white mx-auto">
      {/* Navbar */}
      <div className="flex justify-between items-center px-1 h-14 bg-white">
        <button
          onClick={onBack}
          disabled={disabled}
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
        <h1 className="text-2xl sm:text-[28px] font-semibold leading-[130%] tracking-[-0.03em] text-[#262931] mb-4">
          전화번호를 적어주세요
        </h1>
        <p className="text-base sm:text-lg font-medium leading-[140%] tracking-[-0.03em] text-[#918D89] mb-12">
          본인확인을 위해 필요해요
        </p>

        {/* Phone Input */}
        <div className="border-b-2 border-[#FF6E00] pb-2 mb-6">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="휴대폰 번호"
            maxLength={13}
            disabled={disabled}
            className="w-full text-lg sm:text-xl font-medium leading-[135%] tracking-[-0.03em] text-[#3A3935] placeholder:text-[#C0BBB6] outline-none bg-transparent disabled:opacity-50"
          />
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto px-4 pb-8 bg-white">
        <button
          onClick={handleNext}
          disabled={!isComplete || disabled}
          className={`w-full h-[52px] rounded-lg flex items-center justify-center transition-colors ${
            isComplete && !disabled
              ? "bg-[#FF6E00] text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <span className="text-lg sm:text-xl font-semibold leading-[135%] tracking-[-0.03em]">
            {disabled ? "처리 중..." : "완료"}
          </span>
        </button>
      </div>
    </div>
  );
}
