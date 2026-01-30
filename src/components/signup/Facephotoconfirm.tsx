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
    <div className="relative w-full max-w-[500px] min-h-screen bg-white mx-auto">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-1 h-14 bg-white">
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
      <h1 className="px-4 mt-[52px] font-semibold text-2xl sm:text-[28px] leading-[130%] tracking-[-0.03em] text-[#262931]">
        이 사진으로 할까요?
      </h1>

      {/* Photo Preview */}
      <div className="mt-[50px] px-4">
        <div className="w-full aspect-square max-w-[324px] mx-auto bg-gray-200 rounded-[10px] overflow-hidden">
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
      </div>

      {/* Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto px-4 pb-8 flex flex-col gap-2 bg-white">
        {/* 확인 버튼 */}
        <button
          onClick={onConfirm}
          disabled={disabled}
          className="w-full h-[52px] bg-[#FF6E00] rounded-lg flex items-center justify-center disabled:opacity-50"
        >
          <span className="font-semibold text-lg sm:text-xl text-white tracking-[-0.03em]">
            {disabled ? "처리 중..." : "네, 이 사진이 좋아요"}
          </span>
        </button>

        {/* 다시 촬영 버튼 */}
        <button
          onClick={onRetry}
          disabled={disabled}
          className="w-full h-[52px] bg-[#F3F3F3] rounded-lg flex items-center justify-center disabled:opacity-50"
        >
          <span className="font-semibold text-lg sm:text-xl text-[#3A3935] tracking-[-0.03em]">
            다시 촬영하기
          </span>
        </button>
      </div>
    </div>
  );
}
