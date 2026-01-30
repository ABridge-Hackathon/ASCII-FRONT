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

    // 필수 항목이 모두 체크되었는지 확인
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
    <div className="relative w-[360px] h-[800px] bg-white mx-auto">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-10 flex justify-between items-center px-4">
        <div className="text-sm text-[#171D1B]">9:30</div>
        <div className="flex gap-1">
          <div className="w-4 h-4" /> {/* Wifi icon */}
          <div className="w-4 h-4" /> {/* Signal icon */}
          <div className="w-4 h-4" /> {/* Battery icon */}
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="absolute top-10 left-0 right-0 h-14 bg-white flex justify-between items-center px-1">
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
      <h1 className="absolute left-4 top-[139px] font-semibold text-2xl leading-[130%] tracking-[-0.03em] text-[#262931]">
        환영해요!
        <br />
        약관 동의를 받을게요
      </h1>

      {/* Agreements Section */}
      <div className="absolute left-4 top-[358px] w-[328px] flex flex-col gap-6">
        {/* All Agree */}
        <div className="flex justify-between items-center py-4 border-b border-[#F3EFEC]">
          <span className="font-semibold text-xl tracking-[-0.03em] text-[#3A3935]">
            전체동의
          </span>
          <button
            onClick={handleAllAgree}
            className="w-6 h-6 rounded-[4.8px] relative"
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
        <div className="flex flex-col gap-5">
          {/* Service Terms */}
          <div className="flex justify-between items-center">
            <div className="flex items-start gap-4">
              <span className="font-semibold text-lg text-[#FF6E00]">필수</span>
              <div className="flex items-start gap-2">
                <span className="font-medium text-lg text-[#3A3935]">
                  서비스 이용약관 동의
                </span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
              className="w-6 h-6 rounded-[4.8px] relative"
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
          <div className="flex justify-between items-end">
            <div className="flex items-end gap-4">
              <span className="font-semibold text-lg text-[#FF6E00]">필수</span>
              <div className="flex items-end gap-2">
                <span className="font-medium text-lg text-[#3A3935]">
                  개인정보 수집 및 이용동의
                </span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
              className="w-6 h-6 rounded-[4.8px] relative"
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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-lg text-[#FF6E00]">필수</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-lg text-[#3A3935]">
                  위치정보 서비스 이용동의
                </span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
              className="w-6 h-6 rounded-[4.8px] relative"
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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-lg text-[#FF6E00]">필수</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-lg text-[#3A3935]">
                  카메라 접근권한 허용
                </span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
              className="w-6 h-6 rounded-[4.8px] relative"
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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-lg text-[#918D89]">선택</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-lg text-[#3A3935]">
                  마케팅 정보 동의
                </span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
              className="w-6 h-6 rounded-[4.8px] relative"
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
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-8">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full h-[52px] rounded-lg flex items-center justify-center ${
            canProceed ? "bg-[#FF6E00]" : "bg-gray-300"
          }`}
        >
          <span className="font-semibold text-xl text-white tracking-[-0.03em]">
            다음
          </span>
        </button>
      </div>
    </div>
  );
}
