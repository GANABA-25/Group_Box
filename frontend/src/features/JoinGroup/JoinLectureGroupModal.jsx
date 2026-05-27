import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../store/AuthContext";
import { usePost } from "../../hooks/usePost";
import { postUri } from "../../../http";

import FeedbackMessage from "../../components/FeedbackMessage";
import ModalCmp from "../../components/ModalCmp";
import Input from "../../components/Input";
import Button from "../../components/Button";

import { GroupContext } from "../../store/GroupContext";

const JoinLectureGroupModal = ({ open, onClose, groupCode }) => {
  const { joinLecturerGroup } = useContext(GroupContext);

  const [joinGroupData, setJoinGroupData] = useState({
    LectureGroupCode: "",
    studentsGroupCode: groupCode,
  });

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setJoinGroupData((prevState) => {
      return { ...prevState, [inputIdentifier]: enteredValue };
    });
  };

  const { isLoading, postResponse, errorMsg, postData } = usePost(postUri);

  const joinGroupHandler = (e) => {
    e.preventDefault();

    postData(import.meta.env.VITE_JOIN_LECTURER_GROUP_URI, joinGroupData);
  };

  useEffect(() => {
    if (postResponse?.data.message) {
      joinLecturerGroup(postResponse.data.lectureGroup);
      const timeOutId = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timeOutId);
    }
  }, [postResponse]);

  return (
    <ModalCmp open={open} onClose={onClose}>
      <div className="flex justify-center items-center gap-6">
        <div className="w-[100%]">
          <img
            className="w-[30rem] h-[30rem]"
            src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1754047759/GroupBox/Team_q8ntmj.png"
            alt="Illustration"
          />
        </div>

        <form
          onSubmit={joinGroupHandler}
          className="grid gap-4 border border-gray-300 p-6 rounded-sm shadow-sm w-[85%]"
        >
          <h1 className="text-center font-Montserrat-Bold">
            Join Lectures Group
          </h1>
          <p className="text-center">
            Welcome to the GroupBox platform! Join Group to lectures Group to
            send Assignment and resieve notification
          </p>
          {errorMsg?.message && (
            <FeedbackMessage errorMessage={errorMsg.message} />
          )}

          {postResponse?.data.message && (
            <FeedbackMessage successMsg={postResponse.data.message} />
          )}
          <div className="grid gap-4">
            <Input
              label="Enter Group Token"
              name="LectureGroupCode"
              placeholder="Enter Lecturer Group Code"
              onChange={(e) =>
                inputChangeHandler("LectureGroupCode", e.target.value)
              }
            />

            <div className="flex justify-center items-center gap-4">
              <button
                onClick={onClose}
                className="font-Montserrat-Regular border border-[#2394db] rounded-md p-2 px-4 lg:cursor-pointer lg:hover:text-white lg:hover:bg-[#1c6ba0]"
              >
                Cancel
              </button>

              <Button
                label="Join Group"
                bgColor="#2394db"
                isLoading={isLoading}
              />
            </div>
          </div>
        </form>
      </div>
    </ModalCmp>
  );
};

export default JoinLectureGroupModal;
