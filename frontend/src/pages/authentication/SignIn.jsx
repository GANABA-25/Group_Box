import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import { validateSignInData } from "../../util/validation";
import FormError from "../../components/FormError";
import { usePost } from "../../hooks/usePost";
import { postUri } from "../../../http";
import { toast } from "react-toastify";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { RiAccountCircleFill } from "react-icons/ri";

const SignIn = () => {
  const [viewPassword, setViewPassword] = useState(false);
  const { authenticate } = useContext(AuthContext);
  const [signInData, setSignInData] = useState({
    schoolEmail: "",
    password: "",
  });
  const navigate = useNavigate();

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setSignInData((prevState) => {
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

  const disableButton =
    signInData.schoolEmail === "" || signInData.password === "";

  const {
    isLoading,
    postResponse,
    setPostResponse,
    errorMsg,
    setErrorMsg,
    postData,
  } = usePost(postUri);

  const signinHandler = (e) => {
    e.preventDefault();

    const errors = validateSignInData(signInData);

    setErrorMsg(errors);

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    postData(import.meta.env.VITE_SIGNIN_URI, signInData);
  };

  useEffect(() => {
    if (postResponse?.data?.message) {
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

      authenticate(postResponse.data);
      navigate("/dashboard");
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
      <form onSubmit={signinHandler}>
        <div className="flex justify-center items-center gap-8 flex-wrap">
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
                    Sign in
                    <span>
                      <RiAccountCircleFill className="text-[#2394db] text-[2rem]" />
                    </span>
                  </h1>
                  <p className="text-sm text-gray-600">
                    Sign in to access your GroupBox Account
                  </p>
                </div>

                <div className="grid gap-4 text-left">
                  <div className="grid gap-1">
                    <Input
                      label="School Email"
                      name="schoolEmail"
                      value={signInData.schoolEmail}
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
                      label="Password"
                      name="password"
                      value={signInData.password}
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
                  <div className="flex justify-between items-center text-sm text-gray-700">
                    <span className="flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" className="accent-[#2394db]" />
                      Remember me
                    </span>
                    <span
                      onClick={() => navigate("/reset-password/email")}
                      className="text-[#2394db] font-Montserrat-Bold lg:cursor-pointer lg:hover:underline underline-offset-2 lg:hover:text-[#1c7cb7]"
                    >
                      Forgot Password?
                    </span>
                  </div>

                  <Button
                    label="Sign in"
                    bgColor="#2394db"
                    disableButton={disableButton}
                    isLoading={isLoading}
                  />
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

export default SignIn;
