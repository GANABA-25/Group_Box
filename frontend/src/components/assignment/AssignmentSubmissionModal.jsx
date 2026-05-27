import { useState, useEffect } from "react";
import { usePost } from "../../hooks/usePost";
import { useFetch } from "../../hooks/useFetch";
import { getUri } from "../../../http";
import { postUri } from "../../../http";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import { toast } from "react-toastify";

import FeedbackMessage from "../FeedbackMessage";
import FormError from "../FormError";

import ModalCmp from "../ModalCmp";
import Input from "../Input";
import Button from "../Button";

import { BsFillCloudUploadFill } from "react-icons/bs";
import { TbUpload } from "react-icons/tb";
import { ImCancelCircle } from "react-icons/im";

const AssignmentSubmissionModal = ({ data, open, onClose, groupCode }) => {
  const { token, userData } = useContext(AuthContext);
  const [assignmentId, setAssignmentId] = useState("");
  const {
    isLoading,
    setIsLoading,
    postData,
    errorMsg,
    setErrorMsg,
    postResponse,
    setPostResponse,
  } = usePost(postUri);

  const {
    isLoading: fetchIsLoading,
    fetchedData,
    errorMsg: fetchErrorMsg,
    fetchData,
  } = useFetch(getUri);

  const inputChangeHandler = (enteredValue) => {
    setAssignmentId(enteredValue);
    setErrorMsg((prevErrors) => ({ ...prevErrors, assignmentId: "" }));
  };

  const submitGroupWorkHandler = () => {
    const errors = {
      assignmentId: !assignmentId.trim()
        ? "AssignmentId is required"
        : assignmentId.length < 24
        ? "AssignmentId must be at least 24 characters long"
        : "",
    };

    setErrorMsg(errors);

    if (errors.assignmentId) return;

    fetchData(
      `${
        import.meta.env.VITE_CHECK_GROUP_EVALUATION_STATUS_URI
      }?assignmentId=${assignmentId}&groupCode=${data.groupCode}`
    );
    setIsLoading(true);
  };

  useEffect(() => {
    if (fetchedData?.allCompleted === false) {
      setIsLoading(false);
      toast.error(
        `Peer evaluation incomplete. ${fetchedData.completedCount}/${fetchedData.totalMembers} members have evaluated.`,
        { style: { fontFamily: "font-Montserrat-Regular" } }
      );
    }

    if (fetchedData?.allCompleted) {
      postData(
        import.meta.env.VITE_SUBMIT_GROUP_WORK_URI,
        {
          documentId: data.documentId,
          groupCode: data.groupCode,
          schoolEmail: userData.schoolEmail,
          assignmentId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  }, [fetchedData, fetchErrorMsg]);

  useEffect(() => {
    if (postResponse?.data?.message) {
      toast.success(postResponse.data.message, {
        style: {
          fontFamily: "font-Montserrat-Regular",
        },
      });

      setAssignmentId("");
      const timeOutId = setTimeout(() => {
        onClose();
      }, 3100);

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
    <ModalCmp open={open} onClose={onClose}>
      <div className="flex justify-between items-center my-4 text-xl">
        <div className="flex items-center gap-2">
          <div className="bg-blue-50 p-2 rounded-md">
            <TbUpload className="text-[#2394db]" />
          </div>
          <h1 className="font-Montserrat-Bold">Submit Assignments</h1>
        </div>

        <ImCancelCircle
          onClick={onClose}
          className="text-red-500 lg:hover:text-red-600 cursor-pointer text-lg"
        />
      </div>

      <div className="grid gap-4 border border-gray-300 p-4 rounded-md">
        <Input
          label="Assignment ID"
          name="assignmentId"
          type="text"
          value={assignmentId}
          hasError={!!errorMsg.assignmentId}
          onChange={(e) => inputChangeHandler(e.target.value)}
          placeholder="Paste assignment ID here"
        />
        <FormError message={errorMsg.assignmentId} />
        <p className="text-xs text-gray-400">
          Make sure the assignment ID is correct before submitting
        </p>

        <Button
          onClick={submitGroupWorkHandler}
          label=" Submit Work"
          bgColor="#2394db"
          icon2={<BsFillCloudUploadFill />}
          isLoading={isLoading}
        />
      </div>
    </ModalCmp>
  );
};

export default AssignmentSubmissionModal;
