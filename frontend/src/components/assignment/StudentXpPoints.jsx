import XpCard from "../XpCard";

import { PiStudentBold } from "react-icons/pi";
import { FiZap, FiTarget } from "react-icons/fi";
import { GiFastArrow } from "react-icons/gi";
import { GrDocumentPerformance } from "react-icons/gr";
import { IoStarOutline } from "react-icons/io5";

const StudentXpPoints = ({ assignmentScore }) => {
  const breakdown = assignmentScore.individualXPBreakdown[0].xpBreakdown || {};

  return (
    <div className="flex flex-col gap-4 border border-gray-200 p-4 rounded-md">
      <div className="flex max-[767px]:flex-col max-[767px]:gap-4 justify-between items-center bg-gradient-to-r from-indigo-50 to-indigo-100 p-5 rounded-xl shadow-sm border border-indigo-200">
        <div className="flex max-[767px]:flex-col max-[767px]:text-center items-center gap-3">
          <div className="bg-indigo-500 text-white p-3 rounded-full shadow-md">
            <PiStudentBold className="text-2xl" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-800">
              Your XP Points Earned
            </h1>
            <p className="text-sm text-gray-500">
              Overview of performance and contributions
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <h1 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">
            Total XP
          </h1>
          <h1 className="bg-green-500 px-4 py-2 text-center rounded-full shadow-md text-white text-sm font-semibold">
            {breakdown.totalXP?.toFixed(1) || 0} XP
          </h1>
        </div>
      </div>
      {/* <div className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-indigo-100 p-5 rounded-xl shadow-sm border border-indigo-200">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 text-white p-3 rounded-full shadow-md">
            <PiStudentBold className="text-2xl" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-800">
              Your XP Points Earned
            </h1>
            <p className="text-sm text-gray-500">
              Overview of performance and contributions
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <h1 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">
            Total XP
          </h1>
          <h1 className="bg-green-500 px-4 py-2 text-center rounded-full shadow-md text-white text-sm font-semibold">
            {breakdown.totalXP?.toFixed(1) || 0} XP
          </h1>
        </div>
      </div> */}

      <div className="grid md:grid-cols-2 gap-4">
        <XpCard
          icon={<FiZap className="text-2xl text-green-500" />}
          title="On-Time Submission"
          subtitle="Submitted on or before deadline"
          value={breakdown.submittingAssignmentOnTimeXP}
          color="green"
        />

        <XpCard
          icon={<GiFastArrow className="text-2xl text-blue-500" />}
          title="Early Submission"
          subtitle="Submitted the assignment at least 7 days before due date."
          value={breakdown.submittingAssignmentBeforeDueDateXP}
          color="blue"
        />

        <XpCard
          icon={<FiTarget className="text-2xl text-orange-500" />}
          title="High Score"
          subtitle="Scored above threshold"
          value={breakdown.scoreThresholdXP}
          color="orange"
        />

        <XpCard
          icon={<IoStarOutline className="text-2xl text-yellow-500" />}
          title="Bonus Points"
          subtitle="Extra XP for outstanding work"
          value={breakdown.bonusXP}
          color="yellow"
        />

        <XpCard
          icon={<GrDocumentPerformance className="text-2xl text-purple-500" />}
          title="Document Quality"
          subtitle="XP based on document length & effort"
          value={breakdown.charsXP}
          color="purple"
        />

        <XpCard
          icon={<GrDocumentPerformance className="text-2xl text-purple-500" />}
          title="Group Participation"
          subtitle="XP based on document length & effort"
          value={breakdown.participationXP}
          color="green"
        />
      </div>
    </div>
  );
};

export default StudentXpPoints;
