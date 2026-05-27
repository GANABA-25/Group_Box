import { useState, useContext, useEffect } from "react";
import { usePost } from "../../hooks/usePost";
import { postUri } from "../../../http";
import { AuthContext } from "../../store/AuthContext";
import { joinGroupValidator } from "../../util/validation";
import FormError from "../../components/FormError";
import { toast } from "react-toastify";

import FeedbackMessage from "../../components/FeedbackMessage";

import ModalCmp from "../../components/ModalCmp";
import Input from "../../components/Input";
import Button from "../../components/Button";

import { GroupContext } from "../../store/GroupContext";

const JoinGroupModal = ({ open, onClose }) => {
  const { userData, updateUserStats } = useContext(AuthContext);
  const { joinGroup } = useContext(GroupContext);

  const [joinGroupData, setJoinGroupData] = useState({
    groupCode: "",
    studentId: userData?.studentId,
  });

  const { isLoading, postResponse, errorMsg, setErrorMsg, postData } =
    usePost(postUri);

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setJoinGroupData((prevState) => {
      return { ...prevState, [inputIdentifier]: enteredValue };
    });

    setErrorMsg((prevErrors) => ({
      ...prevErrors,
      [inputIdentifier]: "",
    }));
  };

  const joinGroupHandler = (e) => {
    e.preventDefault();

    const errors = joinGroupValidator(joinGroupData);

    setErrorMsg(errors);

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    postData(import.meta.env.VITE_JOIN_GROUP_URI, joinGroupData);
  };

  useEffect(() => {
    if (postResponse?.data?.message) {
      joinGroup(postResponse.data);
      toast.success(postResponse.data.message, {
        style: {
          fontFamily: "font-Montserrat-Regular",
        },
      });

      if (postResponse.data.stats) {
        updateUserStats(postResponse.data.stats);
      }
      onClose();
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
    <ModalCmp open={open} onClose={onClose}>
      <div className="flex justify-center items-center gap-6">
        <div className="w-100%]">
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
          <h1 className="text-center font-Montserrat-Bold">Join Group</h1>
          <p className="text-center">
            Welcome to the GroupBox platform! Join an existing group by entering
            the group code below.
          </p>

          {postResponse?.data.message && (
            <FeedbackMessage successMsg={postResponse.data.message} />
          )}
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Input
                label="Enter Group Token"
                name="groupCode"
                value={joinGroupData.groupCode}
                placeholder="Enter Group Code"
                hasError={!!errorMsg.groupCode}
                onChange={(e) =>
                  inputChangeHandler("groupCode", e.target.value)
                }
              />
              <FormError message={errorMsg.groupCode} />
            </div>
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
            {/* <Button
              label="Join Group"
              bgColor="#2394db"
              isLoading={joinedGroupLoading}
            /> */}
          </div>
        </form>
      </div>
    </ModalCmp>
  );
};

export default JoinGroupModal;
