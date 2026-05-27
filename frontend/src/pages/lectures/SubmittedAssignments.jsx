import { useContext, useState } from "react";
import { GroupContext } from "../../store/GroupContext";

import Header from "../../components/Header";
import SubmittedAssignmentsComp from "../../components/assignment/SubmittedAssignmentsComp";
import Dropdown from "../../components/assignment/Dropdown";
import EmptyContent from "../../components/EmptyContent";

import { MdAssignment } from "react-icons/md";
import { MdAssignmentTurnedIn } from "react-icons/md";
import { MdOutlineGroups } from "react-icons/md";

const SubmittedAssignments = () => {
  const {
    groupData,
    submittedAssignments,
    assignments,
    isLoadingSubmittedAssignments,
  } = useContext(GroupContext);

  const [groupId, setGroupId] = useState("");

  const groupOptions = [
    { value: "allGroups", label: "All Groups" },
    ...groupData.map((group) => ({
      value: group._id,
      label: group.groupName,
    })),
  ];

  return (
    <div className="min-h-screen overflow-auto font-Montserrat-Regular lg:ml-[17%] lg:w-[83%] lg:pr-2">
      <Header
        title="Submitted Assignments"
        icon1={<MdAssignmentTurnedIn />}
        icon2={<MdAssignment />}
      />

      <div className="max-[767px]:mt-28 px-4 md:mt-36 lg:mt-24 lg:px-0">
        <Dropdown
          options={groupOptions}
          value={groupId}
          onChange={(_id) => setGroupId(_id)}
          icon={MdOutlineGroups}
        />

        {isLoadingSubmittedAssignments ? (
          <div className="flex justify-center items-center max-[767px]:min-h-[40vh] md:min-h-[70vh]">
            <img
              className="w-20 h-20"
              src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1758788158/GroupBox/Loading_lhitxj.svg"
              alt="loading"
            />
          </div>
        ) : (
          <>
            {submittedAssignments.length === 0 ? (
              <EmptyContent
                imageUri="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1758785383/GroupBox/No_Assignment_xsu78y.svg"
                description="No assignments have been submitted at the moment. Once new assignments are submitted, they’ll show up here."
              />
            ) : (
              <div className="grid max-[767px]:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                {submittedAssignments.map((assignment) => (
                  <SubmittedAssignmentsComp
                    key={assignment._id}
                    assignmentData={assignment}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubmittedAssignments;
