import { useLocation } from "react-router-dom";
import { parseISO, format } from "date-fns";
import { calculateGrade } from "../../util/calculateGrade";

import Header from "../../components/Header";
import GroupXpPoints from "../../components/assignment/GroupXpPoints";
import StudentXpPoints from "../../components/assignment/StudentXpPoints";

import { MdAssignment } from "react-icons/md";
import { MdAssignmentTurnedIn } from "react-icons/md";
import { TiGroup } from "react-icons/ti";
import { FiCheckCircle } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LuClock } from "react-icons/lu";
import { PiFileText } from "react-icons/pi";
import { LuAward } from "react-icons/lu";
import { IoStarOutline } from "react-icons/io5";
import { GrTrophy } from "react-icons/gr";

const MarkedAssignmentsDetails = () => {
  const location = useLocation();
  const { markedAssignment } = location.state || {};

  const assignments = Array.isArray(markedAssignment)
    ? markedAssignment
    : [markedAssignment];

  return (
    <div className="min-h-screen overflow-auto font-Montserrat-Regular lg:ml-[17%] lg:w-[83%] lg:pr-2 pb-2">
      <Header
        title="Marked Assignments Details"
        icon1={<MdAssignmentTurnedIn />}
        icon2={<MdAssignment />}
      />

      {assignments.map((assignmentScore) => {
        const { grade, color } = calculateGrade(
          assignmentScore.totalGroupScore
        );
        return (
          <section
            key={assignmentScore._id}
            className="max-[767px]:mt-32 max-[767px]:px-2 flex flex-col gap-4 md:px-4 md:mt-34 lg:mt-24 lg:px-0 "
          >
            <section className="border border-gray-200 shadow-md rounded-md">
              <div className="max-[767px]:flex-col gap-2 flex justify-between md:items-center bg-gradient-to-r from-[#e9f6fe] to-[#fdfeff] p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="hidden bg-blue-100 p-2 rounded-md text-blue-500 lg:block">
                    <LuAward className="text-xl" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="max-[767px]:text-sm font-bold uppercase md:text-xl">
                      {assignmentScore.assignment.title}
                    </h1>

                    <p>{assignmentScore.assignment.lecturerGroupName}</p>
                    <div className="flex items-center gap-2">
                      <TiGroup className="text-blue-500" />
                      <h1 className="font-bold">
                        {assignmentScore.group.groupName}
                      </h1>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-center gap-3">
                  <div
                    className={`${color} flex items-center justify-center gap-2 bg-green-500 px-4 py-2 rounded-full text-white font-bold text-lg`}
                  >
                    <h1>Grade :</h1>
                    <span>{grade}</span>
                  </div>

                  <div className="flex items-center md:justify-center gap-2 bg-[#e3f5eb] px-4 py-2 md:px-2 lg:px-4 text-green-600 rounded-full">
                    <FiCheckCircle className="text-xl" />
                    <span className="font-medium ">Evaluated & Marked</span>
                  </div>
                </div>
              </div>

              <div className="md:grid grid-cols-2">
                <div className="flex items-center gap-2 border border-gray-200 p-6">
                  <div className="bg-blue-100 p-2 rounded-md text-blue-500">
                    <FaRegCalendarAlt />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-xs">Assignment Due Date</h1>
                    <h1 className="font-bold">
                      {format(
                        parseISO(assignmentScore.assignment.dueDate),
                        "EEE, MMM d, yyyy"
                      )}
                    </h1>
                    <p className="text-xs">
                      {format(
                        parseISO(assignmentScore.assignment.dueDate),
                        "h:mm a"
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 border border-gray-200 p-6">
                  <div className="bg-blue-100 p-2 rounded-md text-blue-500">
                    <LuClock />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-xs">Submission Date</h1>
                    <h1 className="font-bold">
                      {format(
                        parseISO(assignmentScore.submittedAt),
                        "EEE, MMM d, yyyy"
                      )}
                    </h1>
                    <p className="text-xs">
                      {format(parseISO(assignmentScore.submittedAt), "h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid max-[767px]:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4 border border-blue-200 p-6 rounded-md shadow-md">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-md text-blue-500">
                      <TiGroup />
                    </div>
                    <h1 className="font-bold text-xl">Group Performance</h1>
                  </div>

                  <div className="flex flex-col gap-2 text-center border border-blue-200 rounded-md p-4 shadow-md">
                    <p>Total Group Score</p>
                    <h1 className="font-bold">
                      <span className="text-[#2394db] text-2xl">
                        {assignmentScore.totalGroupScore}
                      </span>{" "}
                      / 100
                    </h1>
                    <p className="text-xs text-gray-500">
                      Outstanding Team Performance
                    </p>
                  </div>

                  <div className="flex flex-col max-[767px]:py-4 gap-8 border-t border-gray-200 md:p-4">
                    <h1 className="text-xl font-bold">Score Breakdown</h1>

                    <div className="flex max-[767px]:flex-col gap-2 items-center justify-between bg-[#f9f9f9] px-4 py-2 rounded-lg">
                      <h1 className="text-gray-800 font-medium">
                        Content & Quality
                      </h1>
                      <p className="text-[#2394db] font-semibold">
                        {assignmentScore.contentQuality} /{" "}
                        <span className="text-gray-600">30 points</span>
                      </p>
                    </div>

                    <div className="flex max-[767px]:flex-col gap-2 items-center justify-between bg-[#f9f9f9] px-4 py-2 rounded-lg">
                      <h1 className="text-gray-800 font-medium">
                        Organization & Structure
                      </h1>
                      <p className="text-[#2394db] font-semibold">
                        {assignmentScore.organizationStructure} /{" "}
                        <span className="text-gray-600">25 points</span>
                      </p>
                    </div>

                    <div className="flex max-[767px]:flex-col gap-2 items-center justify-between bg-[#f9f9f9] px-4 py-2 rounded-lg">
                      <h1 className="text-gray-800 font-medium">
                        Teamwork & Collaboration
                      </h1>
                      <p className="text-[#2394db] font-semibold">
                        {assignmentScore.teamwork} /{" "}
                        <span className="text-gray-600">25 points</span>
                      </p>
                    </div>

                    <div className="flex max-[767px]:flex-col gap-2 items-center justify-between bg-[#f9f9f9] px-4 py-2 rounded-lg">
                      <h1 className="text-gray-800 font-medium">
                        Overall Presentation
                      </h1>
                      <p className="text-[#2394db] font-semibold">
                        {assignmentScore.overallPresentation} /{" "}
                        <span className="text-gray-600">20 points</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-green-100 p-4 rounded-md font-bold">
                  <div className="flex items-center gap-2">
                    <IoStarOutline className="text-xl text-green-500" />
                    <h1>Bonus Points</h1>
                  </div>

                  <h1 className="text-green-500">
                    +{assignmentScore.bonusPoints} points
                  </h1>
                </div>

                <div className="flex flex-col gap-4 border border-gray-200 p-6 rounded-md shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-md text-blue-500">
                      <PiFileText />
                    </div>
                    <h1 className="max-[767px]:text-sm text-xl font-bold">
                      Instructor Feedback
                    </h1>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-md text-sm">
                    <p>{assignmentScore.feedback}</p>
                  </div>
                </div>
              </div>

              {assignmentScore.individualScore.map((individualScore) => (
                <div
                  key={individualScore._id}
                  className="flex flex-col gap-4 border border-blue-200 p-6 rounded-md shadow-md"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 p-2 rounded-md text-blue-500">
                        <TiGroup />
                      </div>
                      <h1 className="font-bold text-xl">
                        Your Individual Score
                      </h1>
                    </div>

                    <div className="flex flex-col gap-2 text-center border border-blue-200 rounded-md p-4 shadow-md">
                      <p>Your Total Score</p>
                      <h1 className="font-bold">
                        <span className="text-[#2394db] text-2xl">
                          {individualScore.totalIndividualScore}
                        </span>{" "}
                        / 100
                      </h1>
                      <p className="text-xs text-gray-500">
                        Excellent Individual Contribution
                      </p>
                    </div>

                    <div className="flex max-[767px]:py-4 flex-col gap-8 border-t border-gray-200 md:p-4">
                      <h1 className="text-xl font-bold">Score Breakdown</h1>

                      <div className="flex max-[767px]:flex-col gap-2 items-center justify-between bg-[#f9f9f9] px-4 py-2 rounded-lg">
                        <h1 className="text-gray-800 font-medium">
                          Contribution Score
                        </h1>
                        <p className="text-[#2394db] font-semibold">
                          {individualScore.contributionScore} /{" "}
                          <span className="text-gray-600">40 points</span>
                        </p>
                      </div>

                      <div className="flex max-[767px]:flex-col gap-2 items-center justify-between bg-[#f9f9f9] px-4 py-2 rounded-lg">
                        <h1 className="text-gray-800 font-medium">
                          Quality of Work
                        </h1>
                        <p className="text-[#2394db] font-semibold">
                          {individualScore.qualityScore} /{" "}
                          <span className="text-gray-600">40 points</span>
                        </p>
                      </div>

                      <div className="flex max-[767px]:flex-col gap-2 items-center justify-between bg-[#f9f9f9] px-4 py-2 rounded-lg">
                        <h1 className="text-gray-800 font-medium">
                          Collaboration Score
                        </h1>
                        <p className="text-[#2394db] font-semibold">
                          {individualScore.collaborationScore} /{" "}
                          <span className="text-gray-600">20 points</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-green-100 p-4 rounded-md font-bold">
                    <div className="flex items-center gap-2">
                      <IoStarOutline className="text-xl text-green-500" />
                      <h1>Bonus Points</h1>
                    </div>

                    <h1 className="text-green-500">
                      +{individualScore.bonusPoints} points
                    </h1>
                  </div>

                  <div className="flex flex-col gap-4 border border-gray-200 p-6 rounded-md shadow-md">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 p-2 rounded-md text-blue-500">
                        <PiFileText />
                      </div>
                      <h1 className="max-[767px]:text-sm text-xl font-bold">
                        Instructor Feedback
                      </h1>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-md text-sm">
                      <p>{individualScore.feedback}</p>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <div className="flex flex-col gap-4 border border-gray-200 p-6 rounded-md shadow-md">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-md text-blue-500">
                  <GrTrophy />
                </div>
                <h1 className="text-xl font-bold">XP & Points Earned</h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GroupXpPoints assignmentScore={assignmentScore} />
                <StudentXpPoints assignmentScore={assignmentScore} />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default MarkedAssignmentsDetails;
