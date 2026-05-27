import { useEffect, useState, useContext } from "react";

import { GroupContext } from "../../store/GroupContext";
import { calculateGrade } from "../../util/calculateGrade";
import Input from "../../components/Input";
import FormError from "../FormError";

import { HiUserGroup } from "react-icons/hi";
import { BsFillClipboard2CheckFill, BsShieldFillCheck } from "react-icons/bs";
import { TiStarFullOutline } from "react-icons/ti";
import { MdGroups } from "react-icons/md";
import { IoBook } from "react-icons/io5";

const GroupScore = ({ errorMsg, setErrorMsg }) => {
  const { groupScore, setGroupScore } = useContext(GroupContext);
  const [totalScore, setTotalScore] = useState(0);
  const [gradeResult, setGradeResult] = useState({ grade: "N/A", color: "" });
  const [groupGrade, setGroupGrade] = useState({
    contentQuality: groupScore?.contentQuality || "",
    organizationStructure: groupScore?.organizationStructure || "",
    teamwork: groupScore?.teamwork || "",
    overallPresentation: groupScore?.overallPresentation || "",
    bonusPoints: groupScore?.bonusPoints || "",
    feedback: groupScore?.feedback || "",
  });

  useEffect(() => {
    setGroupScore(groupGrade);
  }, [groupGrade]);

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setGroupGrade((prevState) => {
      return { ...prevState, [inputIdentifier]: enteredValue };
    });

    setErrorMsg((prev) => ({
      ...prev,
      [inputIdentifier]: "",
    }));
  };

  useEffect(() => {
    const total =
      Number(groupGrade.contentQuality) +
      Number(groupGrade.organizationStructure) +
      Number(groupGrade.teamwork) +
      Number(groupGrade.overallPresentation) +
      Number(groupGrade.bonusPoints);

    setTotalScore(total);
    setGroupScore({
      ...groupGrade,
      totalScore: total,
    });
    const gradeInfo = calculateGrade(total);
    setGradeResult(gradeInfo);
  }, [groupGrade]);

  return (
    <div className="grid gap-4 border border-gray-200 p-4 rounded-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-[#eaf2f7] p-4 rounded-full">
            <HiUserGroup className="text-[#0369a0] text-lg" />
          </div>
          <div className="grid gap-1">
            <h1 className="font-Montserrat-Bold text-xl">Group Assessment</h1>
            <p className="text-sm">Team Alpha</p>
          </div>
        </div>

        <div className="grid gap-1 font-Montserrat-Bold">
          <h1>{totalScore} /100</h1>
          <div
            className={`text-center text-xs rounded-full p-1 ${
              gradeResult.color || "bg-gray-400 text-white"
            }`}
          >
            <p className="text-white">{gradeResult.grade}</p>
          </div>
        </div>
      </div>

      <div className="grid max-[767px]:grid-cols-1 grid-cols-2 gap-8">
        <div className="grid gap-3">
          <p className="flex items-center gap-2 text-sm font-Montserrat-Bold">
            <IoBook className="text-lg text-[#0369a0]" /> Content & Quality
            (0-30)
          </p>
          <div className="grid gap-1">
            <Input
              type="number"
              value={groupGrade.contentQuality}
              hasError={!!errorMsg.contentQuality}
              max={30}
              onChange={(e) =>
                inputChangeHandler("contentQuality", e.target.value)
              }
            />
            <FormError message={errorMsg.contentQuality} />
          </div>
          <p className="text-sm text-gray-500">
            Accuracy, depth of research, relevance to topic
          </p>
        </div>

        <div className="grid gap-3">
          <p className="flex items-center gap-2 text-sm font-Montserrat-Bold">
            <BsFillClipboard2CheckFill className="text-lg text-[#0369a0]" />{" "}
            Organization & Structure (0-25)
          </p>
          <div className="grid gap-1">
            <Input
              type="number"
              value={groupGrade.organizationStructure}
              hasError={!!errorMsg.organizationStructure}
              max={25}
              onChange={(e) =>
                inputChangeHandler("organizationStructure", e.target.value)
              }
            />
            <FormError message={errorMsg.organizationStructure} />
          </div>
          <p className="text-sm text-gray-500">
            Logical flow, clear structure, formatting
          </p>
        </div>

        <div className="grid gap-3">
          <p className="flex items-center gap-2 text-sm font-Montserrat-Bold">
            <MdGroups className="text-lg text-[#0369a0]" /> Teamwork &
            Collaboration (0-25)
          </p>
          <div className="grid gap-1">
            <Input
              type="number"
              value={groupGrade.teamwork}
              hasError={!!errorMsg.teamwork}
              max={25}
              onChange={(e) => inputChangeHandler("teamwork", e.target.value)}
            />
            <FormError message={errorMsg.teamwork} />
          </div>
          <p className="text-sm text-gray-500">
            Equal participation, coordination, group dynamics
          </p>
        </div>

        <div className="grid gap-3">
          <p className="flex items-center gap-2 text-sm font-Montserrat-Bold">
            <BsShieldFillCheck className="text-lg text-[#0369a0]" /> Overall
            Presentation (0-20)
          </p>
          <div className="grid gap-1">
            <Input
              type="number"
              value={groupGrade.overallPresentation}
              hasError={!!errorMsg.overallPresentation}
              max={20}
              onChange={(e) =>
                inputChangeHandler("overallPresentation", e.target.value)
              }
            />
            <FormError message={errorMsg.overallPresentation} />
          </div>
          <p className="text-sm text-gray-500">
            Visual appeal, professionalism, completeness
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <p className="flex items-center gap-2 text-sm font-Montserrat-Bold">
          <TiStarFullOutline className="text-lg text-yellow-500" /> Overall
          Bonus Points (0-10)
        </p>

        <div className="w-30">
          <Input
            type="number"
            value={groupGrade.bonusPoints}
            hasError={!!errorMsg.bonusPoints}
            max={10}
            onChange={(e) => inputChangeHandler("bonusPoints", e.target.value)}
          />
        </div>
        <FormError message={errorMsg.bonusPoints} />
        <p className="text-sm text-gray-500">
          Exceptional creativity, innovation, or going beyond requirements
        </p>
      </div>

      <div className="grid gap-4">
        <label className="font-Montserrat-Bold">
          Group Feedback & Recommendations
        </label>
        <div className="grid gap-1">
          <textarea
            value={groupGrade.feedback}
            onChange={(e) => inputChangeHandler("feedback", e.target.value)}
            placeholder="Provide overall feedback on the group's performance, strengths, areas for improvement, and recommendations for future collaborative work..."
            className={`w-full bg-grayDark rounded-sm border border-gray-300 p-2 md:p-4 lg:p-2 focus:outline-none focus:ring-2 focus:ring-[#2394db] focus:ring-opacity-30 ${
              errorMsg.feedback
                ? "focus:ring-1 focus:ring-red-600 border-2 border-red-600"
                : "border-gray-300"
            }`}
          />
          <FormError message={errorMsg.feedback} />
        </div>
      </div>
    </div>
  );
};

export default GroupScore;
