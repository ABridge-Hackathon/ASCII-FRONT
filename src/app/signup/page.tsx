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
  //   registerUser,
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
        if (idCardInfo && checkAge(idCardInfo.birth_date)) {
          setCurrentStep("phone-input");
        } else {
          setCurrentStep("age-restriction");
        }
        break;
      case "loading":
        setCurrentStep("confirmation");
        break;
      case "phone-input":
        setCurrentStep("verification-code");
        break;
      case "verification-code":
        setCurrentStep("face-guide");
        break;
      case "face-guide":
        setCurrentStep("face-capture");
        break;
      case "final-loading":
        setCurrentStep("complete");
        break;
      case "complete":
        router.push("/");
        break;
    }
  };

  const handleCaptureNext = async (imageBlob: Blob) => {
    setIsProcessing(true);
    setError(null);
    setCurrentStep("loading");

    try {
      const result = await verifyIDCard(imageBlob);

      if (result.success) {
        const idInfo: IDCardInfo = {
          name: result.name,
          gender: result.gender,
          birth_date: result.birth_date,
          address: result.address,
          success: true,
          onboarding_token: "",
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

    // try {
    //   const result = await registerUser(idCardInfo, phoneNumber, facePhotoBlob);
    //   if (result.success) {
    //     console.log("✅ 회원가입 완료");
    //     setCurrentStep("complete");
    //   } else {
    //     setError(result.message || "회원가입에 실패했습니다.");
    //     setCurrentStep("face-confirm");
    //   }
    // } catch (err: any) {
    //   console.error("회원가입 오류:", err);
    //   setError(err.message || "회원가입 중 오류가 발생했습니다.");
    //   setCurrentStep("face-confirm");
    // } finally {
    //   setIsProcessing(false);
    // }
  };

  const handleRetry = () => {
    setIdCardInfo(null);
    setError(null);
    setCurrentStep("capture");
  };

  const handleFaceRetry = () => {
    if (facePhoto) {
      URL.revokeObjectURL(facePhoto);
    }
    setFacePhoto(null);
    setFacePhotoBlob(null);
    setError(null);
    setCurrentStep("face-capture");
  };

  const handleExit = () => {
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

  const checkAge = (birthDate: string): boolean => {
    try {
      const [year, month, day] = birthDate.split("-").map(Number);

      const today = new Date();
      const birthDateObj = new Date(year, month - 1, day);
      const age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDiff = today.getMonth() - birthDateObj.getMonth();

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

  const renderError = () => {
    if (!error) return null;

    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg z-50 max-w-[90%] sm:max-w-md">
        <p className="text-sm font-medium text-center">{error}</p>
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
