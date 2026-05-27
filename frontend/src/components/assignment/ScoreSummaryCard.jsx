import ProgressBar from "../charts/ProgressBar";
import { useContext } from "react";
import { GroupContext } from "../../store/GroupContext";

const ScoreSummaryCard = ({ members = [] }) => {
  const { groupScore, individualScores } = useContext(GroupContext);

  const totalStudents = members.length;
  const studentsScored = Object.keys(individualScores).length;

  const percentage =
    totalStudents > 0 ? (studentsScored / totalStudents) * 100 : 0;

  return (
    <div className="grid max-[767px]:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <div className="border border-gray-200 p-4 grid gap-4 rounded-md">
        <div className="flex justify-between items-center">
          <h1 className=" font-Montserrat-Bold">Group Score</h1>
        </div>

        <div className=" flex justify-between items-center">
          <h1 className=" font-Montserrat-Bold">
            {groupScore.totalScore || 0}
          </h1>
          <h1 className=" text-gray-400">100</h1>
        </div>

        <div className=" grid gap-4">
          <ProgressBar value={groupScore.totalScore} />
          <h1>{Number(groupScore.totalScore).toFixed(2)}%</h1>
        </div>
      </div>

      <div className="border border-gray-200 p-4 grid gap-4 rounded-md">
        <div className="flex justify-between items-center">
          <h1 className=" font-Montserrat-Bold">Students Scored</h1>
        </div>

        <div className=" flex justify-between items-center">
          <h1 className=" font-Montserrat-Bold">{studentsScored}</h1>
          <h1 className=" text-gray-400">{totalStudents}</h1>
        </div>

        <div className=" grid gap-4">
          <ProgressBar value={percentage} />
          <h1>{percentage.toFixed(2)}%</h1>
        </div>
      </div>
    </div>
  );
};

export default ScoreSummaryCard;
