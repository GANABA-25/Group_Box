import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { usePost } from "../../hooks/usePost";
import { postUri } from "../../../http";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import { GroupContext } from "../../store/GroupContext";
import { toast } from "react-toastify";

import AttachDocuments from "../../features/attachDocuments/AttachDocuments";
import TextEditor from "../../components/TextEditor";
import Button_2 from "../../components/Button_2";
import Button from "../../components/Button";
import JoinLectureGroupModal from "../../features/JoinGroup/JoinLectureGroupModal";
import AssignmentSubmissionModal from "../../components/assignment/AssignmentSubmissionModal";
import PeerEvaluationModal from "../../components/assignment/PeerEvaluationModal";

import { LuHash } from "react-icons/lu";
import { GoPeople } from "react-icons/go";
import { FiActivity } from "react-icons/fi";
import { PiShareNetworkBold } from "react-icons/pi";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { LuSave } from "react-icons/lu";
import { PiHeadCircuitFill } from "react-icons/pi";

const GroupWorkSpace = () => {
  const { userData } = useContext(AuthContext);
  const { lecturerGroup } = useContext(GroupContext);
  const { state } = useLocation();
  const payload = state?.payload;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [peerModal, setPeerModal] = useState(false);

  const openModalHandler = () => setIsModalOpen(true);
  const closeModalHandler = () => setIsModalOpen(false);

  const openAssignmentModalHandler = () => setIsAssignmentModalOpen(true);
  const closeAssignmentModalHandler = () => setIsAssignmentModalOpen(false);

  const { isLoading, postResponse, setPostResponse, errorMsg, postData } =
    usePost(postUri);

  useEffect(() => {
    if (postResponse) {
      console.log(postResponse);

      toast.success(postResponse.data.message, {
        style: {
          fontFamily: "font-Montserrat-Regular",
        },
      });
    }

    if (errorMsg) {
      toast.error(errorMsg.message, {
        style: {
          fontFamily: "font-Montserrat-Regular",
        },
      });
    }
  }, [postResponse, errorMsg]);

  return (
    <>
      <div className="min-h-screen flex flex-col font-Montserrat-Regular lg:ml-[17%] lg:w-[83%]">
        <section className="flex flex-1 flex-col lg:flex-row gap-6">
          <section className="flex-1 lg:mr-[24%]">
            <header className="max-[767px]:grid max-[767px]:justify-center max-[767px]:w-[100%] md:flex items-center justify-between gap-4 border-b border-gray-200 p-4 shadow-sm bg-white fixed top-0 md:p-8 lg:p-4 md:w-full lg:w-[62.3%] z-50">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-md">
                  <PiShareNetworkBold className="text-xl text-[#2394db]" />
                </div>
                <div>
                  <h1 className="font-Montserrat-Bold text-2xl">WorkSpace</h1>
                  <p className="text-xs">
                    Collaborative environment for your team
                  </p>
                </div>
                <div className="flex max-[767px]:justify-center items-center gap-2 bg-green-100 p-2 rounded-full text-xs">
                  <div className="bg-green-600 w-2 h-2 rounded-full" />
                  <h1>Online</h1>
                </div>
              </div>

              {lecturerGroup ? (
                <div className="bg-[#2394db] p-2 rounded-md text-white">
                  <h1>{lecturerGroup.groupName}</h1>
                </div>
              ) : (
                <Button_2
                  label="Connect to Lecture Group"
                  onClick={openModalHandler}
                />
              )}
            </header>

            <div className="max-[767px]:mt-40 md:mt-30 p-3 lg:p-0 lg:mt-24 lg:pr-3">
              <TextEditor groupDocumentId={payload?.groupCode} />
            </div>
            <div className="p-3 lg:pr-3">
              <AttachDocuments groupDocumentId={payload?.groupCode} />
            </div>

            <div className="flex justify-end gap-4 mb-5 p-3 lg:p-0 lg:pr-3">
              <button className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700  lg:hover:bg-gray-100 transition-all duration-300">
                Save Draft
                <span>
                  <LuSave className="text-[#2394db]" />
                </span>
              </button>

              <Button_2
                onClick={openAssignmentModalHandler}
                label=" Submit Work"
                bgColor="#2394db"
                icon2={<BsFillCloudUploadFill />}
              />
            </div>
          </section>

          <section className="hidden fixed right-0 top-0 h-screen w-1/5 rounded-l-md shadow-sm border-l border-gray-200 flex-col p-4 overflow-y-auto lg:flex">
            <div className="grid gap-8">
              <div className="p-4 border border-gray-200 rounded-md shadow-sm grid gap-2">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <LuHash className="text-xl text-[#2394db]" />
                  </div>
                  <div>
                    <h1 className="font-Montserrat-Bold">Group Info</h1>
                    <p className="text-xs">Active</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <h1 className="text-md font-semibold">
                    {payload?.groupName}
                  </h1>
                  <p className="text-sm text-gray-700">
                    {payload?.description}
                  </p>
                  <p className="text-xs">Created 2 days ago</p>
                </div>
              </div>

              <div className="p-4 border-gray-200 rounded-md shadow-sm grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-[#f0fdf4] p-2 rounded-md">
                    <GoPeople className="text-xl text-[#22a753]" />
                  </div>
                  <div>
                    <h1 className="font-Montserrat-Bold">Members</h1>
                    <p className="text-xs">3 active</p>
                  </div>
                </div>
                <div className="grid gap-4">
                  {payload.members.map((member) => (
                    <div
                      key={member._id}
                      className="flex justify-between items-center gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.profilePicture}
                          alt={member.fullName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="grid gap-1">
                          <h1 className="text-sm font-Montserrat-Bold">
                            {member.fullName}
                          </h1>

                          {member.leader ? (
                            <div className="flex items-center gap-2">
                              <p className="text-xs">Leader</p>
                              <PiHeadCircuitFill className="text-blue-600 text-xs" />
                            </div>
                          ) : (
                            <p className="text-xs">Member</p>
                          )}
                        </div>
                      </div>
                      <div className="bg-green-600 w-2 h-2 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-md shadow-sm grid gap-2">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <FiActivity className="text-xl text-[#2394db]" />
                  </div>
                  <div className="grid gap-1">
                    <h1 className="font-Montserrat-Bold">Activity</h1>
                    <p className="text-xs">Last 24 hours</p>
                  </div>
                </div>
                <div className="grid gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-600 w-2 h-2 rounded-full" />
                    <div>
                      <h1>Research started</h1>
                      <p className="text-xs">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-600 w-2 h-2 rounded-full" />
                    <div>
                      <h1>Research started</h1>
                      <p className="text-xs">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-600 w-2 h-2 rounded-full" />
                    <div>
                      <h1>Research started</h1>
                      <p className="text-xs">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-md shadow-sm grid gap-3">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <FiActivity className="text-xl text-[#2394db]" />
                  </div>
                  <div className="grid gap-1">
                    <h1 className="font-Montserrat-Bold">Peer Evaluation</h1>
                    <p className="text-xs">Anonymous Rating</p>
                  </div>
                </div>

                <Button_2
                  label="Evaluate Members"
                  bgColor="#2394db"
                  onClick={() => setPeerModal(true)}
                />

                {payload?.evaluationCompleted ? (
                  <p className="text-green-600 text-xs">
                    ✔ You have completed your evaluation
                  </p>
                ) : (
                  <p className="text-red-600 text-xs">
                    ✖ Required before submission
                  </p>
                )}
              </div>
            </div>
          </section>
        </section>
      </div>

      <JoinLectureGroupModal
        groupCode={payload.groupCode}
        open={isModalOpen}
        onClose={closeModalHandler}
      />
      <AssignmentSubmissionModal
        data={payload}
        open={isAssignmentModalOpen}
        onClose={closeAssignmentModalHandler}
      />
      <PeerEvaluationModal
        open={peerModal}
        onClose={() => setPeerModal(false)}
        members={payload.members}
        isLoading={isLoading}
        onSubmit={({ assignmentId, scores }) => {
          postData(import.meta.env.VITE_POST_GROUP_EVALUATION_SCORE_URI, {
            schoolEmail: userData?.schoolEmail,
            groupCode: payload.groupCode,
            assignmentId,
            scores,
          });
        }}
      />
    </>
  );
};

export default GroupWorkSpace;
