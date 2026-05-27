import { parseISO, format } from "date-fns";
import { useContext } from "react";
import { GroupContext } from "../../store/GroupContext";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Button_2 from "../../components/Button_2";
import EmptyContent from "../../components/EmptyContent";
import { calculateGrade } from "../../util/calculateGrade";

import { MdAssignment } from "react-icons/md";
import { MdAssignmentTurnedIn } from "react-icons/md";
import { TiGroup } from "react-icons/ti";

const MarkedAssignments = () => {
  const { markedAssignments, isLoadingMarkedAssignments } =
    useContext(GroupContext);
  const navigate = useNavigate();

  console.log(markedAssignments);

  return (
    <div className="min-h-screen overflow-auto lg:ml-[17%] lg:w-[83%] lg:pr-2">
      <Header title="Marked Assignments" icon1={<MdAssignmentTurnedIn />} />

      <section className="max-[767px]:px-2 md:px-4 max-[767px]:mt-28 grid gap-4 md:mt-36 lg:mt-24 lg:px-0">
        {isLoadingMarkedAssignments ? (
          <div className="flex justify-center items-center max-[767px]:min-h-[40vh] md:min-h-[70vh]">
            <img
              className="w-20 h-20"
              src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1758788158/GroupBox/Loading_lhitxj.svg"
              alt="loading"
            />
          </div>
        ) : (
          <>
            {markedAssignments.length === 0 ? (
              <EmptyContent
                imageUri="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1758785383/GroupBox/No_Assignment_xsu78y.svg"
                description="You don't have any marked assignments at the moment. Once assignments are marked, they’ll show up here."
              />
            ) : (
              <div className="grid max-[767px]:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {markedAssignments.map((markedAssignment) => {
                  const { grade, color } = calculateGrade(
                    markedAssignment.totalGroupScore
                  );
                  return (
                    <div
                      key={markedAssignment._id}
                      className="grid gap-3 border border-gray-200 shadow-md max-[767px]:p-4 md:p-6 rounded-md cursor-pointer lg:hover:shadow-md hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-1 hover:scale-[1]"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h1 className="font-extrabold max-[767px]:text-sm text-gray-800 text-lg">
                          {markedAssignment.assignment.title}
                        </h1>

                        <span
                          className={`${color} flex items-center justify-center px-4 py-1.5 rounded-full text-white font-semibold text-sm shadow-sm whitespace-nowrap`}
                        >
                          {grade}
                        </span>
                      </div>

                      <h1 className="text-sm text-gray-500">
                        {markedAssignment.assignment.lecturerGroupName}
                      </h1>

                      <div className="flex gap-2 items-center">
                        <TiGroup className="text-[#2394db]" />
                        <h1 className="text-gray-500">
                          {markedAssignment.group.groupName}
                        </h1>
                      </div>

                      <div className="flex items-center justify-between text-gray-600 gap-6">
                        <div className="flex flex-col items-start gap-1 text-sm">
                          <h1 className="font-medium text-gray-500">
                            Group Score
                          </h1>
                          <p className="flex items-baseline gap-1">
                            <span className="text-[#2394db] text-xl font-extrabold">
                              {markedAssignment.totalGroupScore}
                            </span>
                            <span className="text-gray-400 text-sm">/ 100</span>
                          </p>
                        </div>

                        <div className="h-8 w-px bg-gray-200 hidden max-[767px]:block"></div>

                        <div className="flex flex-col items-end gap-1 text-sm">
                          <h1 className="font-medium text-gray-500">
                            Your Score
                          </h1>
                          <p className="flex items-baseline gap-1">
                            <span className="text-[#2394db] text-xl font-extrabold">
                              {
                                markedAssignment.individualScore[0]
                                  .totalIndividualScore
                              }
                            </span>
                            <span className="text-gray-400 text-sm">/ 100</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:justify-between border-t border-red-600 py-4 gap-3">
                        <div className="flex justify-between items-center md:flex-col md:items-start gap-1">
                          <h1 className="text-gray-500 text-sm">Due Date</h1>
                          <p className="text-xs font-bold">
                            {format(
                              parseISO(markedAssignment.assignment.dueDate),
                              "EEE, MMM d, yyyy 'at' h:mm a"
                            )}
                          </p>
                        </div>

                        <div className="flex justify-between items-center md:flex-col md:items-start gap-1">
                          <h1 className="text-gray-500 text-sm">Submitted</h1>
                          <p className="text-xs font-bold">
                            {format(
                              parseISO(markedAssignment.submittedAt),
                              "EEE, MMM d, yyyy 'at' h:mm a"
                            )}
                          </p>
                        </div>
                      </div>

                      <Button_2
                        onClick={() =>
                          navigate("/markedAssignmentsDetails", {
                            state: { markedAssignment },
                          })
                        }
                        label="View score details"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default MarkedAssignments;
