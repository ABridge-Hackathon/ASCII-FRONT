"use client";

interface FacePhotoConfirmProps {
  photoUrl?: string;
  onConfirm: () => void;
  onRetry: () => void;
  onBack: () => void;
  disabled?: boolean;
}

export default function FacePhotoConfirm({
  photoUrl,
  onConfirm,
  onRetry,
  onBack,
  disabled = false,
}: FacePhotoConfirmProps) {
  return (
    <div className="relative w-[360px] h-[800px] bg-white mx-auto">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-10 flex justify-between items-center px-4">
        <div className="text-sm text-[#111111]">9:30</div>
        <div className="flex gap-1">
          <div className="w-4 h-4" />
          <div className="w-4 h-4" />
          <div className="w-4 h-4" />
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="absolute top-10 left-0 right-0 h-14 bg-white flex justify-between items-center px-1">
        <button
          onClick={onBack}
          disabled={disabled}
          className="w-12 h-12 flex items-center justify-center disabled:opacity-50"
        >
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
      <h1 className="absolute left-4 top-[116px] font-semibold text-[28px] leading-[130%] tracking-[-0.03em] text-[#262931]">
        이 사진으로 할까요?
      </h1>

      {/* Photo Preview */}
      <div className="absolute left-4 top-[202px] w-[324px] h-[327px] bg-gray-200 rounded-[10px] overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="촬영한 얼굴 사진"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">사진 미리보기</span>
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 flex flex-col gap-2">
        {/* 확인 버튼 */}
        <button
          onClick={onConfirm}
          disabled={disabled}
          className="w-full h-[52px] bg-[#FF6E00] rounded-lg flex items-center justify-center disabled:opacity-50"
        >
          <span className="font-semibold text-xl text-white tracking-[-0.03em]">
            {disabled ? "처리 중..." : "네, 이 사진이 좋아요"}
          </span>
        </button>

        {/* 다시 촬영 버튼 */}
        <button
          onClick={onRetry}
          disabled={disabled}
          className="w-full h-[52px] bg-[#F3F3F3] rounded-lg flex items-center justify-center disabled:opacity-50"
        >
          <span className="font-semibold text-xl text-[#3A3935] tracking-[-0.03em]">
            다시 촬영하기
          </span>
        </button>
      </div>
    </div>
  );
}
