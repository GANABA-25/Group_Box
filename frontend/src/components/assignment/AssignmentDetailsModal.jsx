import { parseISO, format } from "date-fns";
import ModalCmp from "../ModalCmp";

import {
  HiCalendarDateRange,
  HiOutlineBookOpen,
  HiUserGroup,
} from "react-icons/hi2";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { GrNotes } from "react-icons/gr";
import { PiMedal } from "react-icons/pi";

import AssignmentsDueStatusBadge from "./AssignmentsDueStatusBadge";

const AssignmentDetailsModal = ({ open, onClose, assignmentData }) => {
  if (!assignmentData) return null; // nothing selected yet

  const formattedStartDate = assignmentData.startDate
    ? format(parseISO(assignmentData.startDate), "MMMM dd, yyyy hh:mm a")
    : "No start date";

  const formattedDueDate = assignmentData.dueDate
    ? format(parseISO(assignmentData.dueDate), "MMMM dd, yyyy hh:mm a")
    : "No due date";

  return (
    <ModalCmp open={open} onClose={onClose}>
      <div className="max-[767px]:w-[20rem] md:w-[40rem] lg:w-[45rem] max-[767px]:max-h-[70vh] flex flex-col">
        <header
          className="h-32 bg-gradient-primary bg-cover bg-center relative font-Montserrat-Regular"
          style={{
            backgroundImage: `url(https://res.cloudinary.com/dmdnq9vh8/image/upload/v1757663557/GroupBox/book_lover_mkck_zbo2ks.svg)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#135ba8]/80 to-[#135ba8]/50" />
          <div className="max-[767px]:px-3 relative h-full flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <HiOutlineBookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="max-[767px]:text-sm font-Montserrat-Bold text-white md:text-2xl">
                  Assignment Details
                </h1>
                <p className="text-white/90 text-xs">
                  Complete assignment information
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AssignmentsDueStatusBadge dueDate={assignmentData.dueDate} />
            </div>
          </div>
        </header>

        <section className="border border-gray-200 p-4 grid gap-4 md:gap-8 lg:gap-4 overflow-y-auto flex-1">
          <div className="flex max-[767px]:flex-col max-[767px]:gap-4 justify-between items-center">
            <div className="flex items-center gap-2 font-Montserrat-Bold border border-gray-300 p-2 w-60 md:w-90 lg:w-60 rounded-full shadow-sm">
              <HiUserGroup className="text-[#2394db] md:text-xl lg:text-sm" />
              <h1 className="text-sm text-gray-500 md:text-xl lg:text-sm">
                {assignmentData.lecturerGroupName}
              </h1>
            </div>
            <div className="flex max-[767px]:flex-col items-center gap-2">
              <h1 className=" font-Montserrat-Bold">Assignment ID :</h1>
              <p>{assignmentData._id}</p>
            </div>
          </div>

          <div className="grid gap-2 pb-4 md:pb-6 lg:pb-4 border-b-2 border-gray-400">
            <h1 className="font-Montserrat-Bold capitalize text-sm md:text-xl lg:text-sm">
              Project title: {assignmentData.title}
            </h1>

            <p className="text-xs text-gray-500 md:text-sm lg:text-xs">
              {assignmentData.description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm md:text-xl lg:text-sm">
            <GrNotes className="text-[#2394db]" />
            <h1>Additional Instructions</h1>
          </div>

          <div className="border border-gray-200 bg-gray-100 p-3 rounded-xl">
            <p className="text-xs md:text-sm lg:text-xs">
              {assignmentData.additionalInstructions}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm border-b-2 border-gray-400 pb-4 md:pb-6 lg:pb-4">
            <div className="grid gap-2 w-full">
              <div className="flex items-center gap-2 text-sm">
                <HiCalendarDateRange className="text-green-500 md:text-xl lg:text-sm" />
                <h1 className="uppercase text-xs md:text-xl lg:text-xs">
                  Start Date
                </h1>
              </div>
              <div className="font-Montserrat-Bold bg-green-50 p-2 text-sm md:text-md lg:text-sm rounded-xl border border-gray-200">
                <p>{formattedStartDate}</p>
              </div>
            </div>

            <div className="grid gap-2 w-full">
              <div className="flex items-center gap-2 text-sm">
                <IoMdTime className="text-red-500 md:text-xl lg:text-sm" />
                <h1 className="uppercase text-xs md:text-xl lg:text-xs">
                  Due Date
                </h1>
              </div>
              <div className="font-Montserrat-Bold bg-red-50 p-2 text-sm md:text-md lg:text-sm rounded-xl border border-gray-200">
                <p>{formattedDueDate}</p>
              </div>
            </div>
          </div>

          <div className="grid md:flex items-center gap-4">
            <div className="grid gap-2 w-full">
              <div className="flex items-center gap-2 text-sm md:text-xl lg:text-sm">
                <PiMedal className="text-[#2394db]" />
                <h1>Total Points </h1>
              </div>
              <div className="flex items-center gap-2 border border-gray-200 p-2 rounded-xl text-sm md:text-xl lg:text-sm">
                <p className=" font-Montserrat-Bold text-[#2394db]">
                  {assignmentData.totalPoints}
                </p>
                <p>Points</p>
              </div>
            </div>

            <div className="grid gap-2 w-full">
              <div className="flex items-center gap-2 text-sm md:text-xl lg:text-sm">
                <GrNotes className="text-[#2394db]" />
                <h1>Allowed Documents</h1>
              </div>

              <div className="grid max-[767px]:grid-cols-2 grid-cols-3 gap-2">
                {assignmentData.allowedDoc.map((docs) => (
                  <div className="border border-gray-200 p-2 text-center rounded-xl text-sm md:text-xl lg:text-sm">
                    <h1>{docs}</h1>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </ModalCmp>
  );
};

export default AssignmentDetailsModal;
