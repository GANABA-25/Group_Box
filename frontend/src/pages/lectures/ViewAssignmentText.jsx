import { useEffect, useState } from "react";
import { parseISO, format, isBefore, isAfter } from "date-fns";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { toast } from "react-toastify";

import { validateGroupAssignmentScore } from "../../util/validation";
import { validateAllIndividualScores } from "../../util/validation";
import { AuthContext } from "../../store/AuthContext";
import { GroupContext } from "../../store/GroupContext";
import { usePost } from "../../hooks/usePost";
import { postUri } from "../../../http";

import Button from "../../components/Button";
import GroupMembersCard from "../../components/assignment/GroupMembersCard";
import TextEditor from "../../components/TextEditor";
import GroupScore from "../../components/assignment/GroupScore";
import IndividualScore from "../../components/assignment/IndividualScore";
import ScoreSummaryCard from "../../components/assignment/ScoreSummaryCard";

import { FaPencil, FaArrowTrendUp } from "react-icons/fa6";
import { RiTeamFill } from "react-icons/ri";
import { MdDateRange } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { FaRegFileAlt, FaSave } from "react-icons/fa";
import { TiGroup } from "react-icons/ti";
import { IoSchoolSharp, IoPerson } from "react-icons/io5";

const ViewAssignmentText = () => {
  const { token } = useContext(AuthContext);
  const { groupScore, individualScores } = useContext(GroupContext);
  const [switchScore, setSwitchScores] = useState("group");
  const location = useLocation();
  const assignmentData = location.state?.assignmentData;

  console.log(assignmentData);

  const formattedSubmittedAt = assignmentData.submittedAt
    ? format(parseISO(assignmentData.submittedAt), "MMM d, yyyy • h:mm a")
    : "Not submitted";

  const formattedDueDate = assignmentData.dueDate
    ? format(parseISO(assignmentData.dueDate), "MMM d, yyyy • h:mm a")
    : "No due date";

  let statusText = "Not submitted";
  let statusColor = "bg-gray-400";

  if (assignmentData.submittedAt && assignmentData.dueDate) {
    const submittedDate = parseISO(assignmentData.submittedAt);
    const due = parseISO(assignmentData.dueDate);

    if (
      isBefore(submittedDate, due) ||
      submittedDate.getTime() === due.getTime()
    ) {
      statusText = "On Time";
      statusColor = "bg-green-500";
    } else if (isAfter(submittedDate, due)) {
      statusText = "Late";
      statusColor = "bg-red-500";
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const { isLoading, postResponse, errorMsg, setErrorMsg, postData } =
    usePost(postUri);

  const saveScoreHandler = () => {
    const groupScoreErrors = validateGroupAssignmentScore(groupScore);
    const allScores = assignmentData.group.members.reduce((acc, member) => {
      acc[member.userId] = {
        contributionScore: "",
        qualityScore: "",
        collaborationScore: "",
        bonusPoints: "",
        individualFeedback: "",
        ...(individualScores[member.userId] || {}),
      };
      return acc;
    }, {});

    const individualScoreErrors = validateAllIndividualScores(allScores);

    setErrorMsg({
      ...groupScoreErrors,
      individualScores: individualScoreErrors,
    });

    if (Object.keys(groupScoreErrors).length > 0) return;
    if (Object.keys(individualScoreErrors).length > 0) return;

    const formattedScores = Object.entries(individualScores).map(
      ([studentId, score]) => ({
        studentId,
        ...score,
      })
    );

    postData(
      import.meta.env.VITE_POST_GROUP_ASSIGNMENTS_SCORE_URI,
      {
        groupScore,
        individualScores: formattedScores,
        assignmentId: assignmentData.assignment,
        submittedAssignmentId: assignmentData._id,
        groupCode: assignmentData.group.groupCode,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  useEffect(() => {
    if (postResponse?.data?.message) {
      console.log(postResponse?.data?.message);
      toast.success(postResponse?.data?.message);
    }

    if (errorMsg) {
      toast.error(errorMsg.message);
    }
  }, [postResponse?.data?.message, errorMsg]);

  return (
    <div className="min-h-screen flex flex-col font-Montserrat-Regular lg:ml-[17%] lg:w-[83%] pt-1 lg:pr-2">
      <header
        className="h-50 bg-gradient-primary bg-cover bg-center relative font-Montserrat-Regular lg:h-32"
        style={{
          backgroundImage: `url(https://res.cloudinary.com/dmdnq9vh8/image/upload/v1757663557/GroupBox/book_lover_mkck_zbo2ks.svg)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50" />
        <div className="max-[767px]:px-3 relative h-full max-[767px]:grid gap-4 md:flex items-center justify-between p-6 text-white">
          <div className="grid max-[767px]:gap-4 gap-2">
            <h1 className="font-Montserrat-Bold md:text-xl">
              {assignmentData.assignmentTitle}
            </h1>
            <div className="max-[767px]:grid gap-4 items-center lg:gap-2 text-xs md:text-[0.9rem] md:flex">
              <div className="flex items-center gap-2">
                <RiTeamFill />
                <h1>{assignmentData.group.groupName}</h1>
              </div>
              <div className="flex items-center gap-2">
                <MdDateRange />
                <h1>Due: {formattedDueDate}</h1>
              </div>
              <div className="flex items-center gap-2">
                <IoMdTime />
                <h1>Submitted: {formattedSubmittedAt}</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <h1 className={`${statusColor} p-1 px-2 rounded-md text-white`}>
              {statusText}
            </h1>
            <FaRegFileAlt />
          </div>
        </div>
      </header>

      <div className="grid gap-4 px-2 mt-4 mb-5 lg:px-0">
        <section>
          <TextEditor
            groupDocumentId={assignmentData.document._id}
            readOnly={true}
          />
        </section>
        <section className="grid gap-4">
          <section className="border border-gray-200 rounded-md p-4 grid gap-4 shadow-md">
            <header>
              <div className="flex items-center gap-2 font-Montserrat-Bold">
                <FaPencil className="text-[#2394db]" />
                <h1>Contribution Tracking</h1>
              </div>
              <p className="text-xs">
                Track who contributed to different sections of the assignment
              </p>
            </header>

            <div className="grid max-[767px]:grid-cols-1 grid-cols-3 gap-3">
              <div className="flex items-center gap-2 border border-gray-200 rounded-md p-4">
                <div className="bg-blue-200 p-3 rounded-md text-blue-500">
                  <TiGroup />
                </div>
                <div>
                  <h1 className="text-gray-500">Contributors</h1>
                  <p className=" font-Montserrat-Bold">
                    {assignmentData.document.contributions.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 border border-gray-200 rounded-md p-4">
                <div className="bg-green-200 p-3 rounded-md text-green-500">
                  <FaArrowTrendUp />
                </div>
                <div>
                  <h1 className="text-gray-500">Total Characters</h1>
                  <p className=" font-Montserrat-Bold">
                    {assignmentData.document.totalChars}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 border border-gray-200 rounded-md p-4">
                <div className="bg-blue-200 p-3 rounded-md text-blue-500">
                  <FaRegFileAlt />
                </div>
                <div>
                  <h1 className="text-gray-500">File uploaded</h1>
                  <p className=" font-Montserrat-Bold">
                    {assignmentData.document.files.length} docs
                  </p>
                </div>
              </div>
            </div>

            <GroupMembersCard
              contributions={assignmentData.document.contributions}
              groupName={assignmentData.group.groupName}
            />

            <div className="grid max-[767px]:grid-cols-1 grid-cols-2 gap-4">
              {assignmentData.document.files.map((file) => (
                <div
                  key={file._id}
                  className="grid gap-2 border border-gray-300 rounded-md p-4 lg:hover:border-[#2394db] transition lg:hover:shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <img
                      className="w-10 h-10"
                      src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1755801165/GroupBox/account_zthiqy.png"
                      alt="Group Member"
                    />

                    <div className="grid gap-1">
                      <h1 className=" font-Montserrat-Bold">
                        {file.uploadedBy.fullName}
                      </h1>
                      <p className="text-xs text-gray-500">
                        {file.uploadedBy.schoolEmail}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <h1>Uploaded File</h1>
                    <div>
                      <p className="">{file.name}</p>
                      <ul className="flex items-center gap-2 text-xs text-gray-500">
                        <li>{formatFileSize(file.size)}</li>
                        <li>
                          {format(
                            new Date(file.uploadedAt),
                            "MMM d, yyyy h:mm a"
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4">
              <h1 className="font-Montserrat-Bold">Peer Evaluation</h1>

              {assignmentData.peerEvaluations &&
              assignmentData.peerEvaluations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {assignmentData.peerEvaluations.map((evaluation) => (
                    <div
                      key={evaluation._id}
                      className="border border-gray-200 rounded-md p-4 grid gap-3 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                        <img
                          className="w-12 h-12 rounded-full"
                          src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1755801165/GroupBox/account_zthiqy.png"
                          alt={evaluation.targetUser?.fullName || "User"}
                        />
                        <div className="flex-1">
                          <h2 className="font-Montserrat-Bold text-lg">
                            {evaluation.targetUser?.fullName || "N/A"}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {evaluation.targetEmail}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            Normalized Score
                          </p>
                          <p className="text-2xl font-Montserrat-Bold text-[#0369a0]">
                            {evaluation.normalizedScore || 0}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Total Score:
                          </span>
                          <span className="font-Montserrat-Bold">
                            {evaluation.totalScore || 0}
                          </span>
                        </div>

                        {evaluation.evaluations &&
                          evaluation.evaluations.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-2">
                                Number of Evaluations:{" "}
                                {evaluation.evaluations.length}
                              </p>
                            </div>
                          )}

                        <div className="text-xs text-gray-400 mt-1">
                          Evaluated on:{" "}
                          {format(
                            new Date(evaluation.createdAt),
                            "MMM d, yyyy h:mm a"
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-gray-200 rounded-md p-6 text-center text-gray-500">
                  <p>No peer evaluations submitted yet.</p>
                </div>
              )}
            </div>
          </section>

          <section className="grid gap-6">
            <header className="max-[767px]:grid gap-4 p-4 bg-[#eaf2f7] md:p-8 rounded-md md:flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-[#0369a0] p-2 rounded-full">
                  <IoSchoolSharp className="  text-white" />
                </div>
                <div>
                  <h1 className=" font-Montserrat-Bold">Assignment Scoring</h1>
                  <p className="text-sm">
                    AI Introduction Presentation • Team Alpha
                  </p>
                </div>
              </div>
              <div>
                <Button
                  onClick={saveScoreHandler}
                  bgColor="#0369a0"
                  icon={<FaSave />}
                  label="Save scores"
                  isLoading={isLoading}
                />
              </div>
            </header>

            <ScoreSummaryCard members={assignmentData.group.members} />

            <div className="grid grid-cols-2 gap-2 bg-[#eaf2f7] p-1 rounded-md">
              <div
                onClick={() => setSwitchScores("group")}
                className={`flex justify-center items-center gap-2 cursor-pointer rounded-md ${
                  switchScore === "group"
                    ? "bg-white p-2 font-Montserrat-Bold"
                    : "p-2 text-gray-600"
                }`}
              >
                <TiGroup />
                <h1
                  className={`text-sm ${
                    switchScore === "group" ? "font-Montserrat-Bold" : ""
                  }`}
                >
                  GROUP SCORE
                </h1>
              </div>

              <div
                onClick={() => setSwitchScores("individual")}
                className={`flex justify-center items-center gap-2 cursor-pointer rounded-md ${
                  switchScore === "individual"
                    ? "bg-white p-2 font-Montserrat-Bold"
                    : "p-2 text-gray-600"
                }`}
              >
                <IoPerson />
                <h1
                  className={`text-sm ${
                    switchScore === "individual" ? "font-Montserrat-Bold" : ""
                  }`}
                >
                  INDIVIDUAL SCORE
                </h1>
              </div>
            </div>

            {switchScore === "group" && (
              <GroupScore errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
            )}
            {switchScore === "individual" && (
              <IndividualScore
                members={assignmentData.group.members}
                errorMsg={errorMsg}
                setErrorMsg={setErrorMsg}
              />
            )}
          </section>
        </section>
      </div>
    </div>
  );
};

export default ViewAssignmentText;
