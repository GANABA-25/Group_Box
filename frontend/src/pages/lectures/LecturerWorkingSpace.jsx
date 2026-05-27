import { useLocation } from "react-router-dom";
import AssociatedStudentGroups from "./AssociatedStudentGroups";
import EmptyContent from "../../components/EmptyContent";

import Header from "../../components/Header";

import { MdOutlineGroups2 } from "react-icons/md";
import { BsPerson } from "react-icons/bs";

const LecturerWorkingSpace = () => {
  const { state } = useLocation();
  const payload = state?.payload;

  console.log("checking payload", payload);

  const totalStudents =
    payload?.studentGroups?.reduce(
      (sum, group) => sum + (group.memberCount || 0),
      0
    ) || 0;

  const activeGroups =
    payload?.studentGroups?.filter((g) => g.isActive)?.length || 0;

  return (
    <div className="min-h-screen overflow-auto font-Montserrat-Regular lg:ml-[17%] lg:w-[83%] lg:pr-2">
      <div className="flex flex-col gap-4 mt-14 md:mt-22">
        <Header title="Group Details" icon1={<MdOutlineGroups2 />} />

        <div className="flex flex-col gap-2 px-2 lg:px-0">
          <h1 className="text-2xl font-Montserrat-Bold">{payload.groupName}</h1>
          <p className="text-xs">{payload.description}</p>
          <div className="flex items-center gap-4 text-xs">
            <h1>Group CODE</h1>
            <p className="font-Montserrat-Bold bg-[#2394db] text-white p-2 rounded-md">
              {payload.groupCode}
            </p>
          </div>
        </div>

        <section className="px-2 grid max-[767px]:grid-cols-1 grid-cols-3 gap-4 lg:px-0">
          <div className="flex flex-col gap-2 border border-gray-300 p-4 rounded-md shadow-md">
            <div className="flex justify-between">
              <h1 className=" font-Montserrat-Bold">Total Groups</h1>
              <MdOutlineGroups2 className="text-2xl text-[#2394db]" />
            </div>
            <h1 className="text-2xl font-Montserrat-Bold px-4">
              {payload.studentGroupCount}
            </h1>
            <h1 className="text-xs">Student groups created</h1>
          </div>

          <div className="flex flex-col gap-2 border border-gray-300 p-4 rounded-md shadow-md">
            <div className="flex justify-between">
              <h1 className=" font-Montserrat-Bold">Total Students</h1>
              <BsPerson className="text-2xl text-[#2394db]" />
            </div>
            <h1 className="text-2xl font-Montserrat-Bold px-4">
              {totalStudents}
            </h1>
            <h1 className="text-xs">Across all groups</h1>
          </div>

          <div className="flex flex-col gap-2 border border-gray-300 p-4 rounded-md shadow-md">
            <div className="flex justify-between">
              <h1 className=" font-Montserrat-Bold">Total Active Groups</h1>
              <MdOutlineGroups2 className="text-2xl text-[#2394db]" />
            </div>
            <h1 className="text-2xl font-Montserrat-Bold px-4">
              {activeGroups}
            </h1>
            <h1 className="text-xs">Student groups created</h1>
          </div>
        </section>

        {payload.studentGroups.length === 0 ? (
          <EmptyContent
            imageUri="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1763547584/GroupBox/undraw_profile-data_xkr9_z0bbtk.svg"
            description="No groups have joined yet. Once they do, they will appear here."
          />
        ) : (
          <section className="flex flex-col gap-4 px-2 lg:px-0">
            <h1 className="text-2xl font-Montserrat-Bold">Group Details</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {payload?.studentGroups.map((groups) => (
                <AssociatedStudentGroups key={groups._id} data={groups} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default LecturerWorkingSpace;
