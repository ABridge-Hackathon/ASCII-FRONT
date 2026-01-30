"use client";

import { useState } from "react";
import TermsAgreement from "@/components/signup/Termsagreement";
import IDPreparation from "@/components/signup/Idpreparation";
import IDCapture from "@/components/signup/Idcapture";
import VerificationLoading from "@/components/signup/Verificationloading";
import OCRConfirmation from "@/components/signup/Ocrconfirmation";
import AgeRestriction from "@/components/signup/Agerestriction";
import PhoneInput from "@/components/signup/Phoneinput";
import VerificationCodeInput from "@/components/signup/Verificationcodeinput";
import VerificationErrorModal from "@/components/signup/Verificationerrormodal";
import FacePhotoGuide from "@/components/signup/Facephotoguide";
import FacePhotoCapture from "@/components/signup/Facephotocapture";
import FacePhotoConfirm from "@/components/signup/Facephotoconfirm";
import FinalLoading from "@/components/signup/Finalloading";
import SignUpComplete from "@/components/signup/Signupcomplete";
import {
  IDCardInfo,
  sendVerificationCode,
  verifyIDCard,
  verifyPhoneCode,
  registerUser,
} from "@/lib/api";
import { useRouter } from "next/navigation";

type SignUpStep =
  | "terms"
  | "preparation"
  | "capture"
  | "loading"
  | "confirmation"
  | "age-restriction"
  | "phone-input"
  | "verification-code"
  | "face-guide"
  | "face-capture"
  | "face-confirm"
  | "final-loading"
  | "complete";

export default function SignUpPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<SignUpStep>("terms");
  const [idCardInfo, setIdCardInfo] = useState<IDCardInfo | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [facePhoto, setFacePhoto] = useState<string | null>(null);
  const [facePhotoBlob, setFacePhotoBlob] = useState<Blob | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNextStep = () => {
    switch (currentStep) {
      case "terms":
        setCurrentStep("preparation");
        break;
      case "preparation":
        setCurrentStep("capture");
        break;
      case "confirmation":
        // 나이 체크
        if (idCardInfo && checkAge(idCardInfo.birth_date)) {
          // 50세 이상 - 전화번호 입력으로
          setCurrentStep("phone-input");
        } else {
          // 50세 이하 - 차단 화면
          setCurrentStep("age-restriction");
        }
        break;
      case "loading":
        setCurrentStep("confirmation");
        break;
      case "phone-input":
        // 전화번호 입력 완료 후 인증번호 입력으로
        setCurrentStep("verification-code");
        break;
      case "verification-code":
        // 인증번호 확인 성공 후 얼굴 촬영으로
        setCurrentStep("face-guide");
        break;
      case "face-guide":
        setCurrentStep("face-capture");
        break;
      case "final-loading":
        setCurrentStep("complete");
        break;
      case "complete":
        // 메인 페이지로 이동
        router.push("/");
        break;
    }
  };

  const handleCaptureNext = async (imageBlob: Blob) => {
    setIsProcessing(true);
    setError(null);
    setCurrentStep("loading");

    try {
      // 신분증 OCR 처리
      const result = await verifyIDCard(imageBlob);

      if (result.success) {
        const idInfo: IDCardInfo = {
          name: result.name,
          gender: result.gender,
          birth_date: result.birth_date,
          address: result.address,
          success: true,
        };
        setIdCardInfo(idInfo);
        setCurrentStep("confirmation");
      } else {
        setError(result.message || "신분증 인식에 실패했습니다.");
        setCurrentStep("capture");
      }
    } catch (err: any) {
      console.error("신분증 인증 오류:", err);
      setError(err.message || "신분증 인증 중 오류가 발생했습니다.");
      setCurrentStep("capture");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePhoneInputNext = async (phone: string) => {
    setIsProcessing(true);
    setError(null);
    setPhoneNumber(phone);

    try {
      const result = await sendVerificationCode(phone);

      if (result.success) {
        console.log(
          `✅ 인증번호 발송 성공 (유효시간: ${result.data?.expiresInSec}초)`,
        );
        setCurrentStep("verification-code");
      } else {
        setError(result.error || "인증번호 발송에 실패했습니다.");
      }
    } catch (err: any) {
      console.error("인증번호 발송 오류:", err);
      setError(err.message || "인증번호 발송 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerificationSuccess = async (code: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await verifyPhoneCode(phoneNumber, code);

      if (result.success && result.data) {
        console.log("✅ 인증번호 검증 성공");
        console.log("Access Token:", result.data.accessToken);
        console.log("가입 여부:", result.data.isRegistered);

        setCurrentStep("face-guide");
      } else {
        handleVerificationError();
      }
    } catch (err: any) {
      console.error("인증번호 검증 오류:", err);
      handleVerificationError();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerificationError = () => {
    setShowErrorModal(true);
  };

  const handleResendCode = async () => {
    setShowErrorModal(false);
    setIsProcessing(true);
    setError(null);

    try {
      const result = await sendVerificationCode(phoneNumber);

      if (result.success) {
        console.log("✅ 인증번호 재발송 성공");
      } else {
        setError(result.error || "인증번호 재발송에 실패했습니다.");
      }
    } catch (err: any) {
      console.error("인증번호 재발송 오류:", err);
      setError(err.message || "인증번호 재발송 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFacePhotoCapture = (photoBlob: Blob) => {
    // Blob을 URL로 변환하여 미리보기에 사용
    const photoUrl = URL.createObjectURL(photoBlob);
    setFacePhoto(photoUrl);
    setFacePhotoBlob(photoBlob);
    setCurrentStep("face-confirm");
  };

  const handleFacePhotoConfirm = async () => {
    if (!idCardInfo || !facePhotoBlob) {
      setError("필요한 정보가 누락되었습니다.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStep("final-loading");

    try {
      // 회원가입 API 호출
      const result = await registerUser(idCardInfo, phoneNumber, facePhotoBlob);

      if (result.success) {
        console.log("✅ 회원가입 완료");
        setCurrentStep("complete");
      } else {
        setError(result.message || "회원가입에 실패했습니다.");
        setCurrentStep("face-confirm");
      }
    } catch (err: any) {
      console.error("회원가입 오류:", err);
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
      setCurrentStep("face-confirm");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    // 정보가 틀렸을 때 다시 촬영
    setIdCardInfo(null);
    setError(null);
    setCurrentStep("capture");
  };

  const handleFaceRetry = () => {
    // 얼굴 사진 다시 촬영
    if (facePhoto) {
      URL.revokeObjectURL(facePhoto);
    }
    setFacePhoto(null);
    setFacePhotoBlob(null);
    setError(null);
    setCurrentStep("face-capture");
  };

  const handleExit = () => {
    // 앱 종료 또는 첫 화면으로
    if (typeof window !== "undefined") {
      if (window.confirm("회원가입을 종료하시겠습니까?")) {
        router.push("/");
      }
    }
  };

  const handlePrevStep = () => {
    setError(null);

    switch (currentStep) {
      case "preparation":
        setCurrentStep("terms");
        break;
      case "capture":
        setCurrentStep("preparation");
        break;
      case "loading":
        setCurrentStep("capture");
        break;
      case "confirmation":
        setCurrentStep("capture");
        break;
      case "phone-input":
        setCurrentStep("confirmation");
        break;
      case "verification-code":
        setCurrentStep("phone-input");
        break;
      case "face-guide":
        setCurrentStep("verification-code");
        break;
      case "face-capture":
        setCurrentStep("face-guide");
        break;
      case "face-confirm":
        setCurrentStep("face-capture");
        break;
    }
  };

  // 생년월일로 나이 계산 (50세 이상인지 확인)
  const checkAge = (birthDate: string): boolean => {
    try {
      let year, month, day;

      if (birthDate.includes(".")) {
        // "1972.03.13" 형식
        const parts = birthDate.split(".");
        year = parseInt(parts[0]);
        month = parseInt(parts[1]);
        day = parseInt(parts[2]);
      } else if (birthDate.length === 6) {
        // "720313" 형식
        year = parseInt(birthDate.substring(0, 2));
        month = parseInt(birthDate.substring(2, 4));
        day = parseInt(birthDate.substring(4, 6));

        // 2000년 이전/이후 구분
        year += year >= 0 && year <= 24 ? 2000 : 1900;
      } else {
        return false;
      }

      const today = new Date();
      const birthDateObj = new Date(year, month - 1, day);
      const age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDiff = today.getMonth() - birthDateObj.getMonth();

      // 생일이 지났는지 확인
      const hasHadBirthdayThisYear =
        monthDiff > 0 ||
        (monthDiff === 0 && today.getDate() >= birthDateObj.getDate());
      const actualAge = hasHadBirthdayThisYear ? age : age - 1;

      return actualAge >= 50;
    } catch (error) {
      console.error("나이 계산 오류:", error);
      return false;
    }
  };

  // 에러 메시지 표시 (필요시)
  const renderError = () => {
    if (!error) return null;

    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md">
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {renderError()}

      {currentStep === "terms" && <TermsAgreement onNext={handleNextStep} />}

      {currentStep === "preparation" && (
        <IDPreparation onNext={handleNextStep} onBack={handlePrevStep} />
      )}

      {currentStep === "capture" && (
        <IDCapture onNext={handleCaptureNext} onBack={handlePrevStep} />
      )}

      {currentStep === "loading" && (
        <VerificationLoading
          onComplete={handleNextStep}
          onBack={handlePrevStep}
          idCardInfo={idCardInfo}
        />
      )}

      {currentStep === "confirmation" && (
        <OCRConfirmation
          idCardInfo={idCardInfo}
          onConfirm={handleNextStep}
          onRetry={handleRetry}
        />
      )}

      {currentStep === "age-restriction" && (
        <AgeRestriction onExit={handleExit} />
      )}

      {currentStep === "phone-input" && (
        <PhoneInput
          onNext={handlePhoneInputNext}
          onBack={handlePrevStep}
          disabled={isProcessing}
        />
      )}

      {currentStep === "verification-code" && (
        <>
          <VerificationCodeInput
            phoneNumber={phoneNumber}
            onNext={handleVerificationSuccess}
            onBack={handlePrevStep}
            onError={handleVerificationError}
            onResend={handleResendCode}
            disabled={isProcessing}
          />
          {showErrorModal && (
            <VerificationErrorModal onResend={handleResendCode} />
          )}
        </>
      )}

      {currentStep === "face-guide" && (
        <FacePhotoGuide onNext={handleNextStep} onClose={handleExit} />
      )}

      {currentStep === "face-capture" && (
        <FacePhotoCapture
          onCapture={handleFacePhotoCapture}
          onBack={handlePrevStep}
        />
      )}

      {currentStep === "face-confirm" && (
        <FacePhotoConfirm
          photoUrl={facePhoto || undefined}
          onConfirm={handleFacePhotoConfirm}
          onRetry={handleFaceRetry}
          onBack={handlePrevStep}
          disabled={isProcessing}
        />
      )}

      {currentStep === "final-loading" && (
        <FinalLoading onComplete={handleNextStep} />
      )}

      {currentStep === "complete" && (
        <SignUpComplete userName={idCardInfo?.name} onStart={handleNextStep} />
      )}
    </div>
  );
}
