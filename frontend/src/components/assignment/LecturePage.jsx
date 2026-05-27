import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../store/AuthContext";
import { GroupContext } from "../../store/GroupContext";
import { toast } from "react-toastify";

import SubmittedAssignmentsComp from "./SubmittedAssignmentsComp";
import { validateAssignmentData } from "../../util/validation";
import FormError from "../FormError";
import Button from "../../components/Button";
import Button_2 from "../../components/Button_2";
import Input from "../../components/Input";

import { usePost } from "../../hooks/usePost";
import { postUri } from "../../../http";

import { MdOutlineDateRange } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { LuWaypoints } from "react-icons/lu";
import { MdGroups } from "react-icons/md";
import { TbUpload } from "react-icons/tb";
import { LuSave } from "react-icons/lu";
import { IoIosSend } from "react-icons/io";
import { MdCreateNewFolder } from "react-icons/md";
import { GrNotes } from "react-icons/gr";

import { FaFileWord, FaRegImage } from "react-icons/fa";
import { ImVideoCamera } from "react-icons/im";
import { BsFilePdfFill } from "react-icons/bs";
import { AiFillFilePpt } from "react-icons/ai";

const documentsToAdd = [
  { id: 1, title: "DOCX", icon: <FaFileWord /> },
  { id: 2, title: "Videos", icon: <ImVideoCamera /> },
  { id: 3, title: "PDF", icon: <BsFilePdfFill /> },
  { id: 4, title: "PPTX", icon: <AiFillFilePpt /> },
  { id: 5, title: "Image", icon: <FaRegImage /> },
];

const LecturePage = () => {
  const { token, userData } = useContext(AuthContext);
  const { groupData } = useContext(GroupContext);
  const [selectedDocs, setSelectedDocs] = useState([]);

  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    additionalInstructions: "",
    startDate: "",
    startTime: "",
    dueDate: "",
    dueTime: "",
    totalPoints: "",
    group: "",
    allowedDoc: [],
    schoolEmail: userData?.schoolEmail,
  });

  const selectedDocHandler = (docType) => {
    const title = typeof docType === "string" ? docType : docType.title;
    setSelectedDocs((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  useEffect(() => {
    setAssignmentData((prev) => ({
      ...prev,
      allowedDoc: selectedDocs,
    }));
  }, [selectedDocs]);

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setAssignmentData((prevState) => {
      return { ...prevState, [inputIdentifier]: enteredValue };
    });

    setErrorMsg((prevErrors) => ({
      ...prevErrors,
      [inputIdentifier]: "",
    }));
  };

  const isSmallScreen = window.innerWidth < 640;

  const { isLoading, postResponse, errorMsg, setErrorMsg, postData } =
    usePost(postUri);

  const postAssignmentHandler = () => {
    const errors = validateAssignmentData(assignmentData);

    setErrorMsg(errors);

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    postData(import.meta.env.VITE_POST_GROUP_ASSIGNMENT_URI, assignmentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  useEffect(() => {
    if (postResponse?.data?.message) {
      toast.success(postResponse?.data?.message);
    }

    if (errorMsg) {
      toast.success(errorMsg.message);
    }
  }, [postResponse, errorMsg]);

  return (
    <div className="max-[767px]:mt-28 px-4 md:mt-36 lg:mt-24 lg:px-0">
      {userData.role === "lecturer" && (
        <>
          <div>
            <section className="grid gap-4">
              <div className="flex items-center gap-2 text-xl font-Montserrat-Bold">
                <GrNotes className="text-[#2394db]" />
                <h1>Assignment Details</h1>
              </div>
              <section className="grid gap-4 border border-gray-200 p-4 rounded-md shadow-md">
                <Input
                  label="Assignment title"
                  name="title"
                  value={assignmentData.title}
                  placeholder="Enter assignments title.."
                  type="text"
                  hasError={!!errorMsg.title}
                  onChange={(e) => inputChangeHandler("title", e.target.value)}
                />
                <FormError message={errorMsg.title} />

                <div className="grid items-center gap-4 lg:flex">
                  <div className="grid gap-2 w-full">
                    <h1 className="text-sm">Description</h1>
                    <textarea
                      rows={isSmallScreen ? 3 : 4}
                      name="description"
                      value={assignmentData.description}
                      className={`border border-[#2394db] focus:outline-none focus:ring-2 focus:ring-[#1c6ba0] p-3 w-full rounded-md text-sm resize-none ${
                        !!errorMsg.description
                          ? "focus:ring-1 focus:ring-red-600 border-2 border-red-600"
                          : ""
                      }`}
                      placeholder="Describe what the Group needs to do..."
                      onChange={(e) =>
                        inputChangeHandler("description", e.target.value)
                      }
                    />
                    <FormError message={errorMsg.description} />
                  </div>

                  <div className="grid gap-2 w-full">
                    <h1 className="text-sm">Additional Instructions</h1>
                    <textarea
                      rows={isSmallScreen ? 3 : 4}
                      name="additionalInstructions"
                      value={assignmentData.additionalInstructions}
                      className={`border border-[#2394db] focus:outline-none focus:ring-2 focus:ring-[#1c6ba0] p-3 w-full rounded-md text-sm resize-none ${
                        !!errorMsg.additionalInstructions
                          ? "focus:ring-1 focus:ring-red-600 border-2 border-red-600"
                          : ""
                      }`}
                      placeholder="Add detailed instructions, rubric, or special requirements..."
                      required
                      onChange={(e) =>
                        inputChangeHandler(
                          "additionalInstructions",
                          e.target.value
                        )
                      }
                    />
                    <FormError message={errorMsg.additionalInstructions} />
                  </div>
                </div>
              </section>

              <section className="grid gap-4 border border-gray-200 p-4 rounded-md shadow-md">
                <div className="flex items-center gap-2 font-Montserrat-Bold">
                  <MdOutlineDateRange className="text-[#2394db] text-xl" />
                  <h1>Schedule</h1>
                </div>

                <div className="grid gap-4 justify-between items-center md:grid-cols-2 lg:flex">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <IoMdTime />
                      <h1>Start Date and Time</h1>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="grid gap-2">
                        <Input
                          label="Date"
                          name="startDate"
                          value={assignmentData.startDate}
                          type="date"
                          hasError={!!errorMsg.startDate}
                          onChange={(e) =>
                            inputChangeHandler("startDate", e.target.value)
                          }
                        />
                        <FormError message={errorMsg.startDate} />
                      </div>
                      <div className="grid gap-2">
                        <Input
                          label="Time"
                          name="startTime"
                          value={assignmentData.startTime}
                          type="time"
                          hasError={!!errorMsg.startTime}
                          onChange={(e) =>
                            inputChangeHandler("startTime", e.target.value)
                          }
                        />
                        <FormError message={errorMsg.startTime} />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <IoMdTime className="text-red-600" />
                      <h1>Due Date & Time</h1>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="grid gap-2">
                        <Input
                          label="Date"
                          name="dueDate"
                          value={assignmentData.dueDate}
                          type="date"
                          hasError={!!errorMsg.dueDate}
                          onChange={(e) =>
                            inputChangeHandler("dueDate", e.target.value)
                          }
                        />
                        <FormError message={errorMsg.dueDate} />
                      </div>
                      <div className="grid gap-2">
                        <Input
                          label="Time"
                          name="dueTime"
                          value={assignmentData.dueTime}
                          type="time"
                          hasError={!!errorMsg.dueTime}
                          onChange={(e) =>
                            inputChangeHandler("dueTime", e.target.value)
                          }
                        />
                        <FormError message={errorMsg.dueTime} />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <LuWaypoints className="text-[#2394db]" />
                      <h1>Points</h1>
                    </div>

                    <Input
                      label="Total Points"
                      name="totalPoints"
                      value={assignmentData.totalPoints}
                      type="number"
                      placeholder="Total points"
                      hasError={!!errorMsg.totalPoints}
                      onChange={(e) =>
                        inputChangeHandler("totalPoints", e.target.value)
                      }
                    />
                    <FormError message={errorMsg.totalPoints} />
                  </div>
                </div>
              </section>

              <section className="grid gap-4 border border-gray-200 p-4 rounded-md shadow-md">
                <div className="flex items-center gap-2 font-Montserrat-Bold">
                  <MdGroups className="text-[#2394db] text-xl" />
                  <h1>Assign to Groups</h1>
                </div>

                <h1 className="text-sm">Select Groups</h1>

                <div
                  className={`grid max-[767px]:grid-cols-1 lg:grid-cols-2 gap-4 ${
                    !!errorMsg.group ? "border-red-600" : ""
                  }`}
                >
                  {groupData.map((group) => {
                    const isChecked = assignmentData.group === group._id;

                    return (
                      <label
                        key={group._id}
                        className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 lg:hover:shadow-md ${
                          isChecked
                            ? "border-2 border-[#2394db]"
                            : "border-gray-200"
                        } ${!!errorMsg.group ? "border-red-600" : ""}`}
                      >
                        <input
                          type="radio"
                          className="h-5 w-5 accent-[#2394db] focus:ring-[#2394db]"
                          checked={isChecked}
                          name="group"
                          onChange={() => {
                            setAssignmentData((prev) => ({
                              ...prev,
                              group: group._id,
                            }));

                            setErrorMsg((prev) => ({
                              ...prev,
                              group: "",
                            }));
                          }}
                        />

                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {group.groupName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {group.studentGroupCount} Group
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <FormError message={errorMsg.group} />
              </section>

              <section className="grid gap-4 border border-gray-200 p-4 rounded-md shadow-md">
                <div className="flex items-center gap-2 font-Montserrat-Bold">
                  <TbUpload className="text-[#2394db] text-xl" />
                  <h1>Student Submissions</h1>
                </div>

                <div className="text-sm">
                  <h1>Allowed File Types</h1>
                  <p className="text-xs text-gray-500">
                    Select which file types students can upload
                  </p>
                </div>

                <div className="grid max-[767px]:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documentsToAdd.map((docType) => {
                    const isSelected = selectedDocs.includes(docType.title);
                    return (
                      <div
                        key={docType.id}
                        className={`flex items-center gap-2 border  p-4 rounded-md lg:hover:shadow-md lg:hover:border-[#2394db] cursor-pointer ${
                          isSelected
                            ? " border-2 border-[#2394db] text-[#2394db]"
                            : "border-gray-200"
                        } ${!!errorMsg.allowedDoc ? "border-red-600" : ""}`}
                        onClick={() => {
                          selectedDocHandler(docType);

                          setErrorMsg((prev) => ({
                            ...prev,
                            allowedDoc: "",
                          }));
                        }}
                      >
                        <span
                          className={`text-gray-500 ${
                            isSelected ? "text-[#2394db]" : ""
                          }`}
                        >
                          {docType.icon}
                        </span>
                        <h1>{docType.title}</h1>
                      </div>
                    );
                  })}
                </div>
                <FormError message={errorMsg.allowedDoc} />
              </section>
            </section>

            <div className="flex justify-end gap-4 p-3 lg:p-0 lg:pr-3 mb-5 lg:mt-12">
              <button className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 font-medium hover:bg-gray-100 transition-all duration-300">
                Save Draft
                <span>
                  <LuSave className="text-[#2394db]" />
                </span>
              </button>

              <Button
                onClick={postAssignmentHandler}
                label="Post Assignment"
                bgColor="#2394db"
                icon={<IoIosSend />}
                isLoading={isLoading}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LecturePage;
