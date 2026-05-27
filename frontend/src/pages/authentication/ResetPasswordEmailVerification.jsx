import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { validateResetPasswordEmailData } from "../../util/validation";
import FormError from "../../components/FormError";
import { usePost } from "../../hooks/usePost";
import { postUri } from "../../../http";
import FeedbackMessage from "../../components/FeedbackMessage";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { RiAccountCircleFill } from "react-icons/ri";

const ResetPasswordEmailVerification = () => {
  const [userEmail, setUserEmail] = useState({
    schoolEmail: "",
  });
  const navigate = useNavigate();

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setUserEmail((prevState) => {
      return { ...prevState, [inputIdentifier]: enteredValue };
    });

    setErrorMsg((prevErrors) => ({
      ...prevErrors,
      [inputIdentifier]: "",
    }));
  };

  const disableButton = userEmail.schoolEmail === "";

  const {
    isLoading,
    setIsLoading,
    postResponse,
    setPostResponse,
    errorMsg,
    setErrorMsg,
    postData,
  } = usePost(postUri);

  const signinHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const errors = validateResetPasswordEmailData(userEmail);

    setErrorMsg(errors);

    if (Object.values(errors).some((error) => error !== "")) {
      setIsLoading(false);
      return;
    }

    postData(
      import.meta.env.VITE_RESET_PASSWORD_EMAIL_VERIFICATION_URI,
      userEmail
    );
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

        navigate("/reset-password/otp", {
          state: {
            userId: postResponse.data?.data?.userId,
            phoneNumber: postResponse.data?.data?.phoneNumber,
          },
        });
      }, 3000);

      return () => clearTimeout(timeOutId);
    }
  }, [postResponse?.data?.message]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={signinHandler}>
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
                    Email Verification
                    <span>
                      <RiAccountCircleFill className="text-[#2394db] text-[2rem]" />
                    </span>
                  </h1>
                  <p className="text-sm text-gray-600">
                    Enter the email address associated with your account and
                    we'll send you an OTP to reset your password.
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
                  <div className="grid gap-1">
                    <Input
                      label="Email"
                      name="schoolEmail"
                      placeholder="Enter your email"
                      type="email"
                      hasError={!!errorMsg.schoolEmail}
                      onChange={(e) =>
                        inputChangeHandler("schoolEmail", e.target.value)
                      }
                    />
                    <FormError message={errorMsg.schoolEmail} />
                  </div>

                  <Button
                    label="Continue"
                    bgColor="#2394db"
                    disableButton={disableButton}
                    isLoading={isLoading}
                  />
                  <div className="flex justify-center items-center">
                    <h1
                      onClick={() => navigate("/signin")}
                      className="text-[#2394db] lg:cursor-pointer lg:hover:text-[#1c7cb7]"
                    >
                      Return to sign in
                    </h1>
                  </div>
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

export default ResetPasswordEmailVerification;
