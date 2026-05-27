import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateSignUpData } from "../../util/validation";
import FormError from "../../components/FormError";
import { usePost } from "../../hooks/usePost";
import { postUri } from "../../../http";
import { toast } from "react-toastify";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { RiAccountCircleFill } from "react-icons/ri";

const SignUp = () => {
  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
  const [createAccount, setCreateAccount] = useState({
    fullName: "",
    schoolEmail: "",
    studentId: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const { isLoading, postResponse, errorMsg, setErrorMsg, postData } =
    usePost(postUri);

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setCreateAccount((prevState) => {
      return { ...prevState, [inputIdentifier]: enteredValue };
    });

    setErrorMsg((prevErrors) => ({
      ...prevErrors,
      [inputIdentifier]: "",
    }));
  };

  const togglePasswordVisibility = () => {
    setViewPassword(!viewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setViewConfirmPassword(!viewConfirmPassword);
  };

  const disableButton =
    createAccount.fullName === "" ||
    createAccount.schoolEmail === "" ||
    createAccount.phoneNumber === "" ||
    createAccount.password === "" ||
    createAccount.confirmPassword === "";

  const CreateAccountHandler = async (e) => {
    e.preventDefault();

    const errors = validateSignUpData(createAccount);

    setErrorMsg(errors);

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    postData(import.meta.env.VITE_SIGNUP_URI, createAccount);
  };

  useEffect(() => {
    if (postResponse?.data?.message) {
      toast.success(postResponse.data.message, {
        style: {
          fontFamily: "font-Montserrat-Regular",
        },
      });
      const timeOutId = setTimeout(() => {
        navigate("/signin");
      }, 3500);

      return () => clearTimeout(timeOutId);
    }

    if (errorMsg) {
      toast.error(errorMsg.message, {
        style: {
          fontFamily: "font-Montserrat-Regular",
        },
      });
    }
  }, [postResponse?.data?.message, errorMsg]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={CreateAccountHandler}>
        <div className="flex justify-center items-center gap-12 p-8 flex-wrap">
          <div className="hidden lg:grid gap-6">
            <div className="flex items-center gap-2">
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
              className="h-[45rem]"
              src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749796836/GroupBox/Login_zflpdp.svg"
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
                    Create Account
                    <span>
                      <RiAccountCircleFill className="text-[#2394db] text-[1.3rem]" />
                    </span>
                  </h1>
                  <p className="text-sm text-gray-600">
                    Create a new account to access your GroupBox features
                  </p>
                </div>

                <div className="grid gap-4 text-left">
                  <div className="grid gap-1">
                    <Input
                      label="Full Name"
                      name="fullName"
                      value={createAccount.fullName}
                      placeholder="Enter your full name"
                      hasError={!!errorMsg.fullName}
                      onChange={(e) =>
                        inputChangeHandler("fullName", e.target.value)
                      }
                    />
                    <FormError message={errorMsg.fullName} />
                  </div>
                  <div className="grid gap-1">
                    <Input
                      label="School Email"
                      name="schoolEmail"
                      value={createAccount.schoolEmail}
                      placeholder="Enter your email"
                      type="email"
                      hasError={!!errorMsg.schoolEmail}
                      onChange={(e) =>
                        inputChangeHandler("schoolEmail", e.target.value)
                      }
                    />
                    <FormError message={errorMsg.schoolEmail} />
                  </div>
                  <div className="grid gap-1">
                    <Input
                      label="Student ID"
                      name="studentId"
                      forStudents="For students"
                      value={createAccount.studentId}
                      placeholder="Enter your student ID"
                      type="text"
                      hasError={!!errorMsg.studentId}
                      onChange={(e) =>
                        inputChangeHandler("studentId", e.target.value)
                      }
                    />
                    <FormError message={errorMsg.studentId} />
                  </div>
                  <div className="grid gap-1">
                    <Input
                      label="Phone Number"
                      name="phoneNumber"
                      value={createAccount.phoneNumber}
                      placeholder="Enter your phone number"
                      type="number"
                      hasError={!!errorMsg.phoneNumber}
                      onChange={(e) =>
                        inputChangeHandler("phoneNumber", e.target.value)
                      }
                    />
                    <FormError message={errorMsg.phoneNumber} />
                  </div>
                  <div className="grid gap-1">
                    <Input
                      label="Password"
                      name="password"
                      value={createAccount.password}
                      placeholder="Enter your password"
                      type={viewPassword ? "text" : "password"}
                      hasError={!!errorMsg.password}
                      showPassword={viewPassword}
                      onTogglePassword={togglePasswordVisibility}
                      onChange={(e) =>
                        inputChangeHandler("password", e.target.value)
                      }
                    />
                    <FormError message={errorMsg.password} />
                  </div>
                  <div className="grid gap-1">
                    <Input
                      label="Confirm Password"
                      name="confirmPassword"
                      value={createAccount.confirmPassword}
                      placeholder="Re-enter your password"
                      type={viewConfirmPassword ? "text" : "password"}
                      hasError={!!errorMsg.confirmPassword}
                      showPassword={viewConfirmPassword}
                      onTogglePassword={toggleConfirmPasswordVisibility}
                      onChange={(e) =>
                        inputChangeHandler("confirmPassword", e.target.value)
                      }
                    />
                    <FormError message={errorMsg.confirmPassword} />
                  </div>
                  <div className="flex justify-center items-center text-sm text-gray-700 font-Montserrat-Regular">
                    <h1 className="opacity-70 max-[767px]:text-sm lg:text-sm">
                      <span>
                        <input
                          type="checkbox"
                          className="max-[767px]:mr-2 md:mr-4 md:w-[1.3rem] md:h-[1.3rem] lg:w-[0.8rem] lg:h-[0.8rem] lg:mr-2"
                        />
                      </span>
                      Get emails from GroupBox about feature updates and
                      industry news, You can
                      <span className="text-blue-600 cursor-pointer hover:text-blue-800">
                        {" "}
                        unsubscribe{" "}
                      </span>{" "}
                      at any time.
                      <span className="text-blue-600 cursor-pointer hover:text-blue-800">
                        {" "}
                        Privacy Policy
                      </span>
                    </h1>
                  </div>

                  <Button
                    label="Create Account"
                    bgColor="#2394db"
                    disableButton={disableButton}
                    isLoading={isLoading}
                  />
                </div>
              </div>
              <div className="text-sm text-center flex justify-center items-center gap-2 bg-blue-50 p-4">
                Already have an account?
                <span
                  onClick={() => navigate("/signin")}
                  className="font-semibold lg:cursor-pointer lg:hover:underline underline-offset-2 lg:hover:text-[#1c7cb7] text-[#2394db]"
                >
                  Sign In
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
