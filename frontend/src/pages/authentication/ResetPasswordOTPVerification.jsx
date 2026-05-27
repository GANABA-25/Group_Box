import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePost } from "../../hooks/usePost";
import FeedbackMessage from "../../components/FeedbackMessage";
import { postUri } from "../../../http";

import Button from "../../components/Button";

import { RiAccountCircleFill } from "react-icons/ri";

const ResetPasswordOTPVerification = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const phoneNumber = location.state?.phoneNumber;
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const disableButton = otp.join("").length !== 6;

  const inputChangeHandler = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      setOtpErrorMsg("");

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else if (!value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const {
    isLoading,
    setIsLoading,
    postResponse,
    setPostResponse,
    errorMsg,
    postData,
  } = usePost(postUri);

  const OtpSubmitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setOtpErrorMsg("");

    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setOtpErrorMsg("Please enter a complete 6-digit OTP");
      setIsLoading(false);
      return;
    }

    postData(import.meta.env.VITE_RESET_PASSWORD_OTP_VERIFICATION_URI, {
      otp: otpString,
      phoneNumber: phoneNumber,
      userId: userId,
    });
  };

  useEffect(() => {
    if (postResponse?.data?.message) {
      const timeOutId = setTimeout(() => {
        setPostResponse((prev) => {
          if (!prev?.data?.message) return prev;
          return {
            ...prev,
            data: {
              ...prev.data,
              message: "",
            },
          };
        });

        navigate("/reset-password/new", {
          state: { resetPasswordToken: postResponse.data?.resetPasswordToken },
        });
      }, 3000);

      return () => clearTimeout(timeOutId);
    }
  }, [postResponse?.data?.message]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={OtpSubmitHandler}>
        <div className="flex justify-center items-center flex-wrap">
          <div className="hidden lg:grid gap-6">
            <div className="flex items-center gap-2 ml-16">
              <img
                src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749588045/GroupBox/GroupBox_Logo_vi2zzr.png"
                alt="GroupBox_Logo"
                className="w-[2rem] h-[2rem] shadow-xl"
              />
              <h1 className="text-lg font-Montserrat-ExtraBold">
                <span className="text-[#2394db]">GroupBox</span> AIT
              </h1>
            </div>
            <img
              className="w-[40rem] h-[40rem]"
              src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749796835/GroupBox/ResetPassword_ixrzg8.svg"
              alt="Illustration"
            />
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-2 lg:hidden">
              <img
                src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749588045/GroupBox/GroupBox_Logo_vi2zzr.png"
                alt="GroupBox_Logo"
                className="w-[2rem] h-[2rem] shadow-xl"
              />
              <h1 className="text-lg font-Montserrat-ExtraBold">
                <span className="text-[#2394db]">GroupBox</span> AIT
              </h1>
            </div>
            <div className="rounded-xl border border-gray-200 shadow-md">
              <div className="max-[767px]:w-[23rem] max-[767px]:p-5 p-10 grid gap-6 text-center md:w-[45rem] lg:w-[34rem]">
                <div>
                  <h1 className="text-3xl font-Montserrat-ExtraBold mb-2 flex justify-center items-center gap-2">
                    Enter OTP
                    <span>
                      <RiAccountCircleFill className="text-[#2394db] text-[2rem]" />
                    </span>
                  </h1>
                  <p className="text-sm text-gray-600">
                    Enter the 6-digit code sent to your mobile number
                  </p>
                </div>

                <div className="grid gap-4 text-left">
                  <div className="flex justify-center items-center">
                    {errorMsg?.message && (
                      <FeedbackMessage errorMessage={errorMsg.message} />
                    )}

                    {postResponse?.data.message && (
                      <FeedbackMessage successMsg={postResponse.data.message} />
                    )}
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {otp.map((digit, index) => (
                      <div key={index} className="relative">
                        <input
                          ref={(ref) => (inputRefs.current[index] = ref)}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) =>
                            inputChangeHandler(index, e.target.value)
                          }
                          className={`w-full bg-grayDark rounded-sm border border-gray-300 p-2 md:p-4 lg:p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-30 ${
                            otpErrorMsg
                              ? "focus:ring-1 focus:ring-red-600 border-2 border-red-600"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  {otpErrorMsg && (
                    <p className="text-red-600 text-sm">{otpErrorMsg}</p>
                  )}
                  <Button
                    label="Continue"
                    bgColor="#2394db"
                    disableButton={disableButton}
                    isLoading={isLoading}
                  />

                  <h1
                    onClick={() => navigate("/signin")}
                    className="text-center text-[#2394db] lg:cursor-pointer lg:hover:text-[#1c7cb7]"
                  >
                    Return to sign in
                  </h1>
                </div>
              </div>
              <div className="text-sm text-center flex justify-center items-center gap-2 bg-blue-50 p-4">
                Don't have an account
                <span
                  onClick={() => navigate("/signup")}
                  className="font-semibold lg:cursor-pointer lg:hover:underline underline-offset-2 lg:hover:text-[#1c7cb7] text-[#2394db]"
                >
                  Create account
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordOTPVerification;
