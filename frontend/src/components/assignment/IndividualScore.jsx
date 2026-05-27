import { useContext, useState, useEffect } from "react";
import { GroupContext } from "../../store/GroupContext";

import Input from "../Input";
import FormError from "../FormError";
import { calculateGrade } from "../../util/calculateGrade";

import { TiStarFullOutline } from "react-icons/ti";

const IndividualScore = ({ members, errorMsg, setErrorMsg }) => {
  const { setIndividualScores } = useContext(GroupContext);
  const [totalScores, setTotalScores] = useState({});
  const [gradeResults, setGradeResults] = useState({});
  const [individualGrades, setIndividualGrades] = useState({});

  const inputChangeHandler = (memberId, inputIdentifier, enteredValue) => {
    setIndividualGrades((prevState) => ({
      ...prevState,
      [memberId]: {
        ...prevState[memberId],
        [inputIdentifier]: enteredValue,
      },
    }));

    setErrorMsg((prevErrors) => ({
      ...prevErrors,
      individualScores: {
        ...prevErrors.individualScores,
        [memberId]: {
          ...prevErrors.individualScores?.[memberId],
          [inputIdentifier]: "",
        },
      },
    }));
  };

  useEffect(() => {
    const newTotals = {};
    const newGrades = {};
    const formattedScores = {};

    Object.entries(individualGrades).forEach(([memberId, grade]) => {
      const total =
        Number(grade.contributionScore || 0) +
        Number(grade.qualityScore || 0) +
        Number(grade.collaborationScore || 0) +
        Number(grade.bonusPoints || 0);

      newTotals[memberId] = total;
      newGrades[memberId] = calculateGrade(total);

      formattedScores[memberId] = {
        ...grade,
        totalIndividualScore: total,
      };
    });

    setTotalScores(newTotals);
    setGradeResults(newGrades);
    setIndividualScores(formattedScores);
  }, [individualGrades, setIndividualScores]);

  return (
    <>
      {members.map((member) => {
        const grade = individualGrades?.[member.userId] || {};
        const err = errorMsg?.individualScores?.[member.userId] || {};
        const total = totalScores?.[member.userId] || 0;
        const gradeInfo = gradeResults?.[member.userId] || {};
        const totalGrade = gradeInfo?.grade || "N/A";

        return (
          <div
            key={member.userId}
            className="grid gap-4 border border-gray-200 rounded-md p-4"
          >
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <img
                  className="w-10 h-10"
                  src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1755801165/GroupBox/account_zthiqy.png"
                  alt="Group Member"
                />
                <div className="grid gap-1">
                  <h1 className="font-Montserrat-Bold text-xl">
                    {member.fullName}
                  </h1>
                  <p className="text-xs text-gray-500">{member.schoolEmail}</p>
                </div>
              </div>

              <div className="grid gap-1 font-Montserrat-Bold">
                <h1>{total} / 100</h1>
                <div
                  className={`text-center text-xs rounded-full p-1 text-white ${
                    gradeInfo.color || "bg-gray-400 text-white"
                  }`}
                >
                  <p>{totalGrade}</p>
                </div>
              </div>
            </div>

            <div className="grid max-[767px]:grid-cols-1 grid-cols-3 gap-8">
              <div className="grid gap-3">
                <p className="flex items-center gap-2 text-sm font-Montserrat-Bold">
                  Contribution (0–40)
                </p>
                <div className="grid gap-1">
                  <Input
                    type="number"
                    value={grade.contributionScore || ""}
                    hasError={!!err.contributionScore}
                    onChange={(e) =>
                      inputChangeHandler(
                        member.userId,
                        "contributionScore",
                        e.target.value
                      )
                    }
                  />
                  <FormError message={err.contributionScore} />
                </div>
              </div>

              <div className="grid gap-3">
                <p className="flex items-center gap-2 text-sm font-Montserrat-Bold">
                  Quality (0–40)
                </p>
                <div className="grid gap-1">
                  <Input
                    type="number"
                    value={grade.qualityScore || ""}
                    hasError={!!err.qualityScore}
                    onChange={(e) =>
                      inputChangeHandler(
                        member.userId,
                        "qualityScore",
                        e.target.value
                      )
                    }
                  />
                  <FormError message={err.qualityScore} />
                </div>
              </div>

              <div className="grid gap-3">
                <p className="flex items-center gap-2 text-sm font-Montserrat-Bold">
                  Collaboration (0–20)
                </p>
                <div className="grid gap-1">
                  <Input
                    type="number"
                    value={grade.collaborationScore || ""}
                    hasError={!!err.collaborationScore}
                    onChange={(e) =>
                      inputChangeHandler(
                        member.userId,
                        "collaborationScore",
                        e.target.value
                      )
                    }
                  />
                  <FormError message={err.collaborationScore} />
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <p className="flex items-center gap-2 text-sm font-Montserrat-Bold">
                <TiStarFullOutline className="text-lg text-yellow-500" />
                Overall Bonus Points (0–10)
              </p>
              <div className="w-30 grid gap-1">
                <Input
                  type="number"
                  value={grade.bonusPoints || ""}
                  hasError={!!err.bonusPoints}
                  onChange={(e) =>
                    inputChangeHandler(
                      member.userId,
                      "bonusPoints",
                      e.target.value
                    )
                  }
                />
                <FormError message={err.bonusPoints} />
              </div>
            </div>

            <div className="grid gap-4">
              <label className="font-Montserrat-Bold">
                Individual Feedback & Recommendations
              </label>
              <div className="grid gap-1">
                <textarea
                  placeholder="Provide feedback on this student’s contribution and performance..."
                  value={grade.individualFeedback || ""}
                  onChange={(e) =>
                    inputChangeHandler(
                      member.userId,
                      "individualFeedback",
                      e.target.value
                    )
                  }
                  className={`w-full bg-grayDark rounded-sm border border-gray-300 p-2 md:p-4 lg:p-2 focus:outline-none focus:ring-2 focus:ring-[#2394db] focus:ring-opacity-30 ${
                    err.individualFeedback
                      ? "focus:ring-1 focus:ring-red-600 border-2 border-red-600"
                      : "border-gray-300"
                  }`}
                />
                <FormError message={err.individualFeedback} />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default IndividualScore;
