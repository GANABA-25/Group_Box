import { useState, useEffect, useContext } from "react";

import FeedbackMessage from "../FeedbackMessage";
import { AuthContext } from "../../store/AuthContext";
import { validateUpdatePersonalInformation } from "../../util/validation";
import { usePost } from "../../hooks/usePost";
import { postUri } from "../../../http";

import FormError from "../FormError";
import Button from "../Button";

import Input from "../Input";
import ModalCmp from "../ModalCmp";

import { MdSystemUpdateAlt } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";

const UpdatePersonalInformation = ({ open, onClose }) => {
  const { userData, authenticate } = useContext(AuthContext);
  const [viewPassword, setViewPassword] = useState(false);
  const [updateInformation, setUpdateInformation] = useState({
    fullName: "",
    userSchoolEmail: userData?.schoolEmail,
    schoolEmail: "",
    phoneNumber: "",
    password: "",
  });

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setUpdateInformation((prevState) => {
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
    updateInformation.fullName === "" ||
    updateInformation.schoolEmail === "" ||
    updateInformation.phoneNumber === "" ||
    updateInformation.password === "";

  const {
    isLoading,
    postResponse,
    setPostResponse,
    errorMsg,
    setErrorMsg,
    postData,
  } = usePost(postUri);

  const CreateAccountHandler = async (e) => {
    e.preventDefault();

    const errors = validateUpdatePersonalInformation(updateInformation);

    setErrorMsg(errors);

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    postData(
      import.meta.env.VITE_UPDATE_PERSONAL_INFORMATION_URI,
      updateInformation
    );
  };

  useEffect(() => {
    if (postResponse?.data?.message) {
      authenticate(postResponse.data);
      const timeOutId = setTimeout(() => {
        setPostResponse(null);
        onClose();
      }, 3000);

      return () => clearTimeout(timeOutId);
    }
  }, [postResponse?.data?.message]);
  return (
    <ModalCmp open={open} onClose={onClose}>
      <IoCloseOutline
        onClick={onClose}
        className="cursor-pointer max-[767px]:text-xl float-end text-red-600 md:text-3xl lg:text-xl"
      />
      <div className="max-[767px]:max-h-[80vh] max-[767px]:overflow-y-auto px-5 md:py-6 md:px-12 font-Montserrat-Regular">
        <div className="flex justify-center items-center gap-2 mb-2 md:mb-4">
          <img
            src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749588045/GroupBox/GroupBox_Logo_vi2zzr.png"
            alt="GroupBox_Logo"
            className="w-[2rem] h-[2rem] shadow-xl"
          />
          <h1 className="max-[767px]:text-lg font-Montserrat-ExtraBold text-black">
            <span className="text-[#2394db]">GroupBox</span> AIT
          </h1>
        </div>

        <h1 className="max-[767px]:text-xs text-center md:text-sm lg:text-xs">
          Keep your profile information up to date
          <br className="max-[767px]:hidden" /> for the best experience
        </h1>

        <form onSubmit={CreateAccountHandler}>
          <div className="grid gap-4 text-left max-[767px]:w-70 md:w-[30rem] lg:w-full">
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
                label="Full Name"
                name="fullName"
                value={updateInformation.fullName}
                placeholder="Enter your full name"
                hasError={!!errorMsg.fullName}
                onChange={(e) => inputChangeHandler("fullName", e.target.value)}
              />
              <FormError message={errorMsg.fullName} />
            </div>

            <div className="grid gap-1">
              <Input
                label="School Email"
                name="schoolEmail"
                value={updateInformation.schoolEmail}
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
                label="Phone Number"
                name="phoneNumber"
                value={updateInformation.phoneNumber}
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
                value={updateInformation.password}
                placeholder="Enter your password"
                type={viewPassword ? "text" : "password"}
                hasError={!!errorMsg.password}
                showPassword={viewPassword}
                onTogglePassword={togglePasswordVisibility}
                onChange={(e) => inputChangeHandler("password", e.target.value)}
              />
              <FormError message={errorMsg.password} />
            </div>
            <Button
              label="Update Information"
              bgColor="#2394db"
              disableButton={disableButton}
              isLoading={isLoading}
              icon2={<MdSystemUpdateAlt />}
            />
            <h1 className="text-center text-xs text-gray-400 md:text-sm lg:text-xs">
              Your information is secure and will only be used
              <br className="max-[767px]:hidden" /> to improve your experience
            </h1>
          </div>
        </form>
      </div>
    </ModalCmp>
  );
};

export default UpdatePersonalInformation;
