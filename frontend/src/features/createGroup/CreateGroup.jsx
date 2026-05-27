import { useState, useEffect, useContext } from "react";
import { GroupContext } from "../../store/GroupContext";
import { AuthContext } from "../../store/AuthContext";
import { toast } from "react-toastify";
import FormError from "../../components/FormError";
import { createGroupValidator } from "../../util/validation";

import { usePost } from "../../hooks/usePost";
import { postUri } from "../../../http";

import Input from "../../components/Input";
import Button from "../../components/Button";

import ModalCmp from "../../components/ModalCmp";

const CreateGroup = ({ open, onClose }) => {
  const { createGroup } = useContext(GroupContext);
  const { userData, updateUserStats } = useContext(AuthContext);
  const [newGroup, setNewGroup] = useState({
    groupName: "",
    description: "",
    schoolEmail: userData?.schoolEmail,
  });

  const { isLoading, postResponse, errorMsg, setErrorMsg, postData } =
    usePost(postUri);

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setNewGroup((prevState) => {
      return { ...prevState, [inputIdentifier]: enteredValue };
    });

    setErrorMsg((prevErrors) => ({
      ...prevErrors,
      [inputIdentifier]: "",
    }));
  };

  const createGroupHandler = (e) => {
    e.preventDefault();

    const errors = createGroupValidator(newGroup);

    setErrorMsg(errors);

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    postData(import.meta.env.VITE_CREATE_GROUP_URI, newGroup);
  };

  useEffect(() => {
    if (postResponse) {
      toast.success(postResponse.data.message, {
        style: {
          fontFamily: "font-Montserrat-Regular",
        },
      });

      if (postResponse.data.stats) {
        updateUserStats(postResponse.data.stats);
      }
      createGroup(postResponse.data);

      const timeOutId = setTimeout(() => {
        onClose();
      }, 3100);

      return () => clearTimeout(timeOutId);
    }

    if (errorMsg?.message) {
      toast.error(errorMsg.message, {
        style: {
          fontFamily: "font-Montserrat-Regular",
        },
      });
    }
  }, [postResponse, errorMsg]);

  return (
    <ModalCmp open={open} onClose={onClose}>
      <div className="flex justify-center items-center gap-6">
        <div className="w-100%]">
          <img
            className="w-[40rem] h-[30rem]"
            src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1754047759/GroupBox/Team_q8ntmj.png"
            alt="Illustration"
          />
        </div>
        <div className="grid gap-4 border border-gray-300 p-6 rounded-sm shadow-sm w-[85%]">
          <form onSubmit={createGroupHandler} className="grid gap-3">
            <h1 className=" text-center font-Montserrat-Bold">
              Create a Group
            </h1>
            <p className="text-center text-gray-600">
              Start a new group, invite members, and collaborate effectively as
              a team.
            </p>

            <div className="grid gap-1">
              <Input
                label="Group Name"
                name="groupName"
                value={newGroup.groupName}
                placeholder="Place enter Group Name"
                hasError={!!errorMsg.groupName}
                onChange={(e) =>
                  inputChangeHandler("groupName", e.target.value)
                }
              />
              <FormError message={errorMsg.groupName} />
            </div>

            <div className="grid gap-1">
              <Input
                label="Description"
                name="description"
                value={newGroup.description}
                placeholder="Place enter Group Description"
                hasError={!!errorMsg.description}
                onChange={(e) =>
                  inputChangeHandler("description", e.target.value)
                }
              />
              <FormError message={errorMsg.description} />
            </div>
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={onClose}
                className="font-Montserrat-Regular border border-[#2394db] rounded-md p-2 px-4 lg:cursor-pointer lg:hover:text-white lg:hover:bg-[#1c6ba0]"
              >
                Cancel
              </button>

              <Button
                buttonType="submit"
                label="Create Group"
                bgColor="#2394db"
                isLoading={isLoading}
              />
            </div>
          </form>
        </div>
      </div>
    </ModalCmp>
  );
};

export default CreateGroup;
