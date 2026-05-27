import { parseISO, format } from "date-fns";
import Button_2 from "../Button_2";
import { useNavigate } from "react-router-dom";

import { MdOutlinePersonOutline } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoTimeOutline } from "react-icons/io5";
import { RiGroupLine } from "react-icons/ri";
import { FaRegFileAlt } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";

const SubmittedAssignmentsComp = ({ assignmentData }) => {
  const navigate = useNavigate();
  const handleViewRichText = () => {
    navigate("/ViewAssignmentText", {
      state: {
        assignmentData,
      },
    });
  };

  const formattedSubmittedAt = assignmentData.submittedAt
    ? format(parseISO(assignmentData.submittedAt), "MMM d, yyyy • h:mm a")
    : "Not submitted";

  return (
    <section>
      <div className="border border-gray-200 grid gap-4 p-4 rounded-md shadow-sm font-Montserrat-Regular">
        <section className="max-[767px]:grid gap-4">
          <h1 className="font-Montserrat-Bold">
            {assignmentData.group.groupName}
          </h1>
          <div className="max-[767px]:grid gap-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm">
              <MdOutlinePersonOutline />
              <h1 className="">Leader: John Doe (ST001)</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="max-[767px]:p-1 flex items-center gap-2 bg-green-100 rounded-md p-2">
                <IoMdCheckmarkCircleOutline />
                <h1>Submitted</h1>
              </div>
              <div className="flex items-center gap-2">
                <IoTimeOutline />
                <h1>{formattedSubmittedAt}</h1>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-2 font-Montserrat-Bold">
          <RiGroupLine />
          <h1>
            Group Members{" "}
            <span className="text-green-500">
              {assignmentData.group.memberCount}
            </span>
          </h1>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {assignmentData.document.contributions.map((member) => (
            <div
              key={member.user}
              className="flex justify-between items-center gap-2 bg-gray-100 p-2 rounded-md text-sm"
            >
              <div className="flex items-center gap-2">
                <h1>{member.userName}</h1>
                <div className="border border-gray-200 p-1 rounded-md">
                  <p>leader</p>
                </div>
              </div>

              <div>
                <h1 className="text-green-600">{member.percentage} %</h1>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-gray-200 p-4">
          <h1 className="font-Montserrat-Bold">Submitted Text</h1>
          <div className="text-sm mt-2">
            The group has submitted a written response for this assignment.
            Click below to view the full content.
          </div>
        </section>

        <section className="grid gap-4">
          <div className="flex items-center gap-2 font-Montserrat-Bold">
            <FaRegFileAlt />
            <h1>Submitted Files {assignmentData.document.files.length}</h1>
          </div>

          <div className="grid max-[767px]:grid-cols-1 grid-cols-2 gap-4">
            {assignmentData.document.files.map((file, index) => (
              <div
                key={index}
                className="flex justify-between items-center gap-2 bg-gray-100 p-2 rounded-md text-sm"
              >
                <div className="flex items-center gap-2">
                  <FaRegFileAlt />
                  <div>
                    <h1 className="truncate max-w-[120px]">{file.name}</h1>
                    <p>{file.size} KB</p>
                  </div>
                </div>
                <a
                  href={`${file.url.replace(
                    "/upload/",
                    `/upload/fl_attachment:${encodeURIComponent(file.name)}/`
                  )}`}
                  download={file.name}
                  className="bg-green-200 p-2 rounded-full lg:hover:bg-green-300 lg:hover:text-white cursor-pointer"
                >
                  <LuDownload />
                </a>
              </div>
            ))}
          </div>
        </section>

        <Button_2 onClick={handleViewRichText} label="FULL ASSIGNMENT" />
      </div>
    </section>
  );
};

export default SubmittedAssignmentsComp;
