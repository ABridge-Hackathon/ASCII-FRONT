"use client";

interface VerificationErrorModalProps {
  onResend: () => void;
}

export default function VerificationErrorModal({
  onResend,
}: VerificationErrorModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-[298px] min-h-[173px] bg-white rounded-[10px] flex flex-col items-center justify-between py-[42px] px-3">
        <h2 className="text-lg sm:text-xl font-semibold leading-[135%] tracking-[-0.03em] text-[#3A3935] text-center">
          인증번호가 맞지 않아요
        </h2>

        <button
          onClick={onResend}
          className="w-full max-w-[274px] h-12 bg-[#4F4E4A] rounded-lg flex items-center justify-center mt-4"
        >
          <span className="text-base sm:text-lg font-semibold leading-[135%] tracking-[-0.03em] text-white">
            다시 보내기
          </span>
        </button>
      </div>
    </div>
  );
}
