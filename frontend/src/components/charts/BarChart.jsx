import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useContext } from "react";
import { GroupContext } from "../../store/GroupContext";

const BarChartComp = () => {
  const { markedAssignments } = useContext(GroupContext);

  const data = Array.isArray(markedAssignments) ? markedAssignments : [];

  const assignmentTitles = data.map((a) => a.assignment.title);
  const totalScores = data.map((a) => a.totalGroupScore);
  const contentQuality = data.map((a) => a.contentQuality);
  const teamwork = data.map((a) => a.teamwork);
  const presentation = data.map((a) => a.overallPresentation);
  const bonusPoints = data.map((a) => a.bonusPoints);

  if (data?.length === 0) {
    return (
      <div className="flex justify-center items-center">
        <div className="flex flex-col gap-2">
          <img
            className="w-90"
            src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1764839767/GroupBox/undraw_visual-data_1eya_s3xoxc.svg"
            alt=""
          />
          <p className="text-center">No data found to display </p>
        </div>
      </div>
    );
  }

  return (
    <BarChart
      xAxis={[{ data: assignmentTitles }]}
      series={[
        { label: "Total Score", data: totalScores },
        { label: "Quality", data: contentQuality },
        { label: "Teamwork", data: teamwork },
        { label: "Presentation", data: presentation },
        { label: "Bonus", data: bonusPoints },
      ]}
      height={300}
      className="bg-gray-200 shadow-md"
    />
  );
};

export default BarChartComp;
