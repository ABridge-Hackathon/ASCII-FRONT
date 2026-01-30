"use client";

import { useState } from "react";

interface TermsAgreementProps {
  onNext: () => void;
}

export default function TermsAgreement({ onNext }: TermsAgreementProps) {
  const [agreements, setAgreements] = useState({
    all: false,
    service: false,
    privacy: false,
    location: false,
    camera: false,
    marketing: false,
  });

  const handleAllAgree = () => {
    const newValue = !agreements.all;
    setAgreements({
      all: newValue,
      service: newValue,
      privacy: newValue,
      location: newValue,
      camera: newValue,
      marketing: newValue,
    });
  };

  const handleIndividualAgree = (key: keyof typeof agreements) => {
    const newAgreements = {
      ...agreements,
      [key]: !agreements[key],
    };

    const allRequired =
      newAgreements.service &&
      newAgreements.privacy &&
      newAgreements.location &&
      newAgreements.camera;

    newAgreements.all = allRequired && newAgreements.marketing;

    setAgreements(newAgreements);
  };

  const canProceed =
    agreements.service &&
    agreements.privacy &&
    agreements.location &&
    agreements.camera;

  const handleNext = () => {
    if (canProceed) {
      onNext();
    }
  };

  return (
    <div className="relative w-full max-w-[500px] min-h-screen bg-white mx-auto">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-1 h-14 bg-white">
        <button className="w-12 h-12 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="#4F4E4A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="flex-1" />
        <div className="w-12 h-12" />
      </nav>

      {/* Title */}
      <h1 className="mt-[10px] px-4 font-semibold text-xl sm:text-2xl leading-[130%] tracking-[-0.03em] text-[#262931]">
        환영해요!
        <br />
        약관 동의를 받을게요
      </h1>

      {/* Agreements Section */}
      <div className="mt-[144px] px-4 pb-28">
        {/* All Agree */}
        <div className="flex justify-between items-center py-4 border-b border-[#F3EFEC]">
          <span className="font-semibold text-lg sm:text-xl tracking-[-0.03em] text-[#3A3935]">
            전체동의
          </span>
          <button
            onClick={handleAllAgree}
            className="w-6 h-6 rounded-[4.8px] relative flex-shrink-0"
          >
            <div
              className={`absolute w-[22px] h-[22px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded border-2 ${
                agreements.all
                  ? "bg-[#FF6E00] border-[#FF6E00]"
                  : "bg-white border-[#7B7874]"
              }`}
            >
              {agreements.all && (
                <svg
                  className="absolute inset-0"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 12L10 16L18 8"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* Individual Agreements */}
        <div className="flex flex-col gap-5 mt-6">
          {/* Service Terms */}
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-start gap-2 sm:gap-4 flex-1 min-w-0">
              <span className="font-semibold text-base sm:text-lg text-[#FF6E00] flex-shrink-0">
                필수
              </span>
              <div className="flex items-start gap-1 sm:gap-2 flex-1 min-w-0">
                <span className="font-medium text-base sm:text-lg text-[#3A3935] flex-1">
                  서비스 이용약관 동의
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#A7A39F"
                    strokeWidth="1.44"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={() => handleIndividualAgree("service")}
              className="w-6 h-6 rounded-[4.8px] relative flex-shrink-0"
            >
              <div
                className={`absolute w-[22px] h-[22px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded border-2 ${
                  agreements.service
                    ? "bg-[#FF6E00] border-[#FF6E00]"
                    : "bg-white border-[#7B7874]"
                }`}
              >
                {agreements.service && (
                  <svg
                    className="absolute inset-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M6 12L10 16L18 8"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>

          {/* Privacy */}
          <div className="flex justify-between items-end gap-2">
            <div className="flex items-end gap-2 sm:gap-4 flex-1 min-w-0">
              <span className="font-semibold text-base sm:text-lg text-[#FF6E00] flex-shrink-0">
                필수
              </span>
              <div className="flex items-end gap-1 sm:gap-2 flex-1 min-w-0">
                <span className="font-medium text-base sm:text-lg text-[#3A3935] flex-1">
                  개인정보 수집 및 이용동의
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#A7A39F"
                    strokeWidth="1.44"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={() => handleIndividualAgree("privacy")}
              className="w-6 h-6 rounded-[4.8px] relative flex-shrink-0"
            >
              <div
                className={`absolute w-[22px] h-[22px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded border-2 ${
                  agreements.privacy
                    ? "bg-[#FF6E00] border-[#FF6E00]"
                    : "bg-white border-[#7B7874]"
                }`}
              >
                {agreements.privacy && (
                  <svg
                    className="absolute inset-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M6 12L10 16L18 8"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>

          {/* Location */}
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <span className="font-semibold text-base sm:text-lg text-[#FF6E00] flex-shrink-0">
                필수
              </span>
              <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                <span className="font-medium text-base sm:text-lg text-[#3A3935] flex-1">
                  위치정보 서비스 이용동의
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#A7A39F"
                    strokeWidth="1.44"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={() => handleIndividualAgree("location")}
              className="w-6 h-6 rounded-[4.8px] relative flex-shrink-0"
            >
              <div
                className={`absolute w-[22px] h-[22px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded border-2 ${
                  agreements.location
                    ? "bg-[#FF6E00] border-[#FF6E00]"
                    : "bg-white border-[#7B7874]"
                }`}
              >
                {agreements.location && (
                  <svg
                    className="absolute inset-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M6 12L10 16L18 8"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>

          {/* Camera */}
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <span className="font-semibold text-base sm:text-lg text-[#FF6E00] flex-shrink-0">
                필수
              </span>
              <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                <span className="font-medium text-base sm:text-lg text-[#3A3935] flex-1">
                  카메라 접근권한 허용
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#A7A39F"
                    strokeWidth="1.44"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={() => handleIndividualAgree("camera")}
              className="w-6 h-6 rounded-[4.8px] relative flex-shrink-0"
            >
              <div
                className={`absolute w-[22px] h-[22px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded border-2 ${
                  agreements.camera
                    ? "bg-[#FF6E00] border-[#FF6E00]"
                    : "bg-white border-[#7B7874]"
                }`}
              >
                {agreements.camera && (
                  <svg
                    className="absolute inset-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M6 12L10 16L18 8"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>

          {/* Marketing */}
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <span className="font-semibold text-base sm:text-lg text-[#918D89] flex-shrink-0">
                선택
              </span>
              <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                <span className="font-medium text-base sm:text-lg text-[#3A3935] flex-1">
                  마케팅 정보 동의
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#A7A39F"
                    strokeWidth="1.44"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={() => handleIndividualAgree("marketing")}
              className="w-6 h-6 rounded-[4.8px] relative flex-shrink-0"
            >
              <div
                className={`absolute w-[22px] h-[22px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded border-2 ${
                  agreements.marketing
                    ? "bg-[#FF6E00] border-[#FF6E00]"
                    : "bg-white border-[#7B7874]"
                }`}
              >
                {agreements.marketing && (
                  <svg
                    className="absolute inset-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M6 12L10 16L18 8"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto px-4 pb-8 bg-white">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full h-[52px] rounded-lg flex items-center justify-center ${
            canProceed ? "bg-[#FF6E00]" : "bg-gray-300"
          }`}
        >
          <span className="font-semibold text-lg sm:text-xl text-white tracking-[-0.03em]">
            다음
          </span>
        </button>
      </div>
    </div>
  );
}
