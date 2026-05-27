import { parseISO, format, isBefore, isAfter } from "date-fns";
import { useState } from "react";
import Lottie from "lottie-react";

import loadingAnimation from "../../lottie/formLoadingAnimation.json";

import { HiCalendarDateRange } from "react-icons/hi2";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaBookOpen } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

import AssignmentDetailsModal from "./AssignmentDetailsModal";
import AssignmentsDueStatusBadge from "./AssignmentsDueStatusBadge";
import Button_2 from "../Button_2";

const AssignmentCard = ({
  assignments,
  showAssignments,
  groupId,
  isLoadingFetchAssignments,
  isLoading,
}) => {
  const [viewAssignmentsDetails, setViewAssignmentDetailsOpen] =
    useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const viewAssignmentsDetailsHandler = (assignment) => {
    setSelectedAssignment(assignment);
    setViewAssignmentDetailsOpen(true);
  };
  const closeAssignmentsDetailsHandler = () =>
    setViewAssignmentDetailsOpen(false);

  const today = new Date();

  const filteredAssignments = assignments.filter((assignment) => {
    if (groupId && groupId !== "allGroups") {
      const isInGroup = assignment.studentGroups?.includes(groupId);
      if (!isInGroup) return false;
    }

    const dueDate = assignment.dueDate ? parseISO(assignment.dueDate) : null;
    if (!dueDate) return false;

    switch (showAssignments) {
      case "Due soon":
        return isAfter(dueDate, today);
      case "Overdue":
        return isBefore(dueDate, today);
      case "completed":
        return assignment.isCompleted;
      default:
        return true;
    }
  });

  return (
    <>
      {filteredAssignments.map((assignment) => {
        const formattedStartDate = assignment.startDate
          ? format(parseISO(assignment.startDate), "MMMM dd, yyyy hh:mm a")
          : "No start date";

        const formattedDueDate = assignment.dueDate
          ? format(parseISO(assignment.dueDate), "MMMM dd, yyyy hh:mm a")
          : "No due date";

        return (
          <div
            key={assignment._id}
            className="grid gap-4 border border-gray-200 rounded-md p-2 lg:hover:shadow-md hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-1 hover:scale-[1]"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <h1 className="text-sm text-gray-500">
                  {assignment.lecturerGroupName}
                </h1>
              </div>

              <AssignmentsDueStatusBadge dueDate={assignment.dueDate} />
            </div>

            <h1 className="font-Montserrat-Bold capitalize">
              {assignment.title}
            </h1>
            <p className="text-sm text-gray-500">{assignment.description}</p>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <HiCalendarDateRange />
                <div className="font-Montserrat-Bold">
                  <h1 className="uppercase">Start</h1>
                  <p className="text-sm">{formattedStartDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <IoMdTime />
                <div className="font-Montserrat-Bold">
                  <h1 className="uppercase">Due</h1>
                  <p className="text-sm">{formattedDueDate}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-2 text-sm text-gray-500">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h1>{assignment.totalPoints} Points</h1>
                  <div className="flex items-center gap-1">
                    <IoDocumentTextOutline />
                    <h1>{assignment.allowedDoc.length}</h1>
                  </div>
                </div>

                <button className="p-2 bg-gradient-to-r from-[#2394db] to-[#1c6ba0] lg:hover:from-[#1c6ba0] lg:hover:to-[#2394db] rounded-lg text-white font-medium transition-all duration-300 shadow-sm lg:hover:shadow-xl active:scale-95 cursor-pointer">
                  {isLoading ? (
                    <div className="flex justify-center ">
                      <Lottie
                        className="w-[4.5rem] lg:w-[4.5rem]"
                        animationData={loadingAnimation}
                        loop={true}
                      />
                    </div>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>

              <div className="flex max-[767px]:flex-col items-center gap-2">
                <h1 className="font-Montserrat-Bold">Assignment ID :</h1>
                <p>{assignment._id}</p>
              </div>
            </div>

            <Button_2
              onClick={() => viewAssignmentsDetailsHandler(assignment)}
              label="View Assignment Details"
              icon={<FaBookOpen />}
            />
          </div>
        );
      })}

      <AssignmentDetailsModal
        assignmentData={selectedAssignment}
        open={viewAssignmentsDetails}
        onClose={closeAssignmentsDetailsHandler}
      />
    </>
  );
};

export default AssignmentCard;
