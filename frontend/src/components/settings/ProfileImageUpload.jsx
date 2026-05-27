import { useRef, useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthContext";

import { usePost } from "../../hooks/usePost";
import { postUri } from "../../../http";

import FeedbackMessage from "../FeedbackMessage";
import ModalCmp from "../ModalCmp";
import Button from "../Button";

import { FaCamera } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { IoCheckmark, IoCloseOutline } from "react-icons/io5";

const ProfileImageUpload = ({ open, onClose }) => {
  const { userData, updateProfilePicture } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [imagePreView, setImagePreView] = useState("");

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const imageUrl = URL.createObjectURL(selectedFile);
      setImagePreView(imageUrl);
    }
  };

  const disableButton = !file;

  const {
    isLoading,
    postResponse,
    setPostResponse,
    errorMsg,
    setErrorMsg,
    postData,
  } = usePost(postUri);

  const updatedProfileHandler = () => {
    if (!file) return alert("Please select an image first");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("schoolEmail", userData?.schoolEmail);

    postData(import.meta.env.VITE_UPDATE_PROFILE_PICTURE_URI, formData);
  };

  useEffect(() => {
    if (postResponse?.data?.url) {
      updateProfilePicture(postResponse.data.url);
      const timeOutId = setTimeout(() => {
        setPostResponse(null);

        onClose();
      }, 3000);

      return () => clearTimeout(timeOutId);
    }

    if (errorMsg) {
      const timeOutId = setTimeout(() => {
        setErrorMsg(null);
      }, 3000);

      return () => clearTimeout(timeOutId);
    }
  }, [postResponse, errorMsg]);

  return (
    <ModalCmp open={open} onClose={onClose}>
      <div className="grid gap-6">
        <div className="flex justify-center items-center">
          {errorMsg || postResponse ? (
            <div className="flex justify-center items-center mt-1">
              {errorMsg?.message && (
                <FeedbackMessage errorMessage={errorMsg.message} />
              )}

              {postResponse?.data.message && (
                <FeedbackMessage successMsg={postResponse.data.message} />
              )}
            </div>
          ) : (
            <h1 className="text-center flex-1 font-Montserrat-Bold">
              Update Profile Picture
            </h1>
          )}

          {errorMsg || postResponse ? (
            <></>
          ) : (
            <IoCloseOutline
              onClick={onClose}
              className="cursor-pointer text-xl"
            />
          )}
        </div>

        <div className="relative flex justify-center items-center">
          {imagePreView ? (
            <img
              src={imagePreView}
              alt="preView Profile"
              className="max-[767px]:w-30 max-[767px]:h-30 rounded-full md:w-40 md:h-40 lg:w-30 lg:h-30"
            />
          ) : (
            <img
              src={userData.profilePicture}
              alt="profile"
              className="max-[767px]:w-30 max-[767px]:h-30 rounded-full md:w-40 md:h-40 lg:w-30 lg:h-30"
            />
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onClick={handleIconClick}
            className="absolute max-[767px]:top-24 max-[767px]:right-25 md:top-32 md:right-30 lg:top-22 lg:right-39 bg-[#2394db] p-2 rounded-full cursor-pointer "
          >
            <FaCamera className="md:text-2xl lg:text-xl text-white" />
          </div>
        </div>

        <div
          onClick={handleIconClick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) {
              setFile(droppedFile);
              const imageUrl = URL.createObjectURL(droppedFile);
              setImagePreView(imageUrl);
            }
          }}
          className="border border-dotted border-gray-400 p-12 md:px-32 lg:px-24 grid gap-2 lg:hover:border-[#2394db] cursor-pointer rounded-md"
        >
          <div className="flex justify-center items-center">
            <FiUpload className="text-4xl text-gray-400" />
          </div>
          <h1 className="text-sm text-gray-500">
            <span className="text-[#2394db]">Click to upload</span> or drag and
            drop <br /> PNG, JPG, GIF up to 10MB
          </h1>
        </div>
        <div className="flex justify-center items-center gap-10">
          <button
            onClick={onClose}
            className="border border-gray-400 p-2 px-12 rounded-md lg:hover:bg-[#2394db] lg:hover:text-white"
          >
            Cancel
          </button>
          <Button
            isLoading={isLoading}
            bgColor="#2394db"
            label="Upload"
            onClick={updatedProfileHandler}
            icon={<IoCheckmark />}
            disableButton={disableButton}
          />
        </div>
      </div>
    </ModalCmp>
  );
};

export default ProfileImageUpload;
