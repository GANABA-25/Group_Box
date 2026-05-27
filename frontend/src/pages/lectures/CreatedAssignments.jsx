import { useContext, useState } from "react";
import { GroupContext } from "../../store/GroupContext";

import Header from "../../components/Header";
import AssignmentCard from "../../components/assignment/AssignmentCard";
import Dropdown from "../../components/assignment/Dropdown";
import AssignmentFilterBar from "../../components/assignment/AssignmentFilterBar";
import EmptyContent from "../../components/EmptyContent";

import { MdAssignment } from "react-icons/md";
import { MdOutlineGroups } from "react-icons/md";
import { MdAssignmentTurnedIn } from "react-icons/md";

const CreatedAssignments = () => {
  const [showAssignments, setShowAssignments] = useState("");
  const [groupId, setGroupId] = useState("allGroups");
  const { createdAssignments, isLoadingCreatedAssignments, groupData } =
    useContext(GroupContext);

  const assignmentOptions = [
    { value: "allAssignment", label: "All Assignments" },
    { value: "Due soon", label: "Due soon" },
    { value: "Overdue", label: "Overdue" },
    { value: "completed", label: "Completed" },
  ];

  const groupOptions = [
    { value: "allGroups", label: "All Groups" },
    ...groupData.flatMap((group) =>
      group.studentGroups.map((sg) => ({
        value: sg._id,
        label: group.groupName,
      }))
    ),
  ];

  return (
    <div className="min-h-screen overflow-auto font-Montserrat-Regular lg:ml-[17%] lg:w-[83%] lg:pr-2">
      <Header
        title="Created Assignments"
        icon1={<MdAssignmentTurnedIn />}
        icon2={<MdAssignment />}
      />

      <section className="grid gap-4 max-[767px]:mt-28 px-4 md:mt-36 lg:mt-24 lg:px-0">
        <div className="grid gap-4 border border-gray-200 justify-between items-center p-4 rounded-md lg:mr-1 shadow-sm md:justify-center lg:justify-between lg:flex">
          <AssignmentFilterBar
            assignments={createdAssignments}
            showAssignments={showAssignments}
            setShowAssignments={setShowAssignments}
          />

          <div className="md:flex items-center gap-2">
            <Dropdown
              options={groupOptions}
              value={groupId}
              onChange={(_id) => setGroupId(_id)}
              icon={MdOutlineGroups}
            />

            <Dropdown
              options={assignmentOptions}
              value={showAssignments}
              onChange={(val) => setShowAssignments(val)}
              icon={MdAssignment}
            />
          </div>
        </div>

        {isLoadingCreatedAssignments ? (
          <div className="flex justify-center items-center max-[767px]:min-h-[40vh] md:min-h-[70vh]">
            <img
              className="w-20 h-20"
              src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1758788158/GroupBox/Loading_lhitxj.svg"
              alt="loading"
            />
          </div>
        ) : (
          <>
            {createdAssignments.length === 0 ? (
              <EmptyContent
                imageUri="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1758785383/GroupBox/No_Assignment_xsu78y.svg"
                description=" You don’t have any assignments at the moment. Once new assignments are added, they’ll show up here."
              />
            ) : (
              <div className="grid max-[767px]:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AssignmentCard
                  assignments={createdAssignments}
                  groupId={groupId}
                  showAssignments={showAssignments}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default CreatedAssignments;
