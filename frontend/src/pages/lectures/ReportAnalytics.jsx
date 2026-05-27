import { useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import { GroupContext } from "../../store/GroupContext";
import { useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { getUri } from "../../../http";
import { BarChart } from "@mui/x-charts/BarChart";
import EmptyContent from "../../components/EmptyContent";

import ProgressBar from "../../components/charts/ProgressBar";
import Header from "../../components/Header";

import { TbReport } from "react-icons/tb";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { LuFolderKanban } from "react-icons/lu";
import { RiGroupLine } from "react-icons/ri";
import { LuTrendingUp } from "react-icons/lu";

const ReportAnalytics = () => {
  const { isAuthenticated, userData, token } = useContext(AuthContext);
  const { groupData, submittedAssignments, createdAssignments } =
    useContext(GroupContext);

  const totalStudentsAcrossAll = groupData.reduce((total, lecturer) => {
    const groupTotal = lecturer.studentGroups.reduce(
      (sum, group) => sum + (group.memberCount || 0),
      0
    );
    return total + groupTotal;
  }, 0);

  const { isLoading, fetchedData, fetchData, errorMsg } = useFetch(getUri);

  useEffect(() => {
    if (isAuthenticated && groupData.length > 0) {
      const studentGroupCodes = groupData.flatMap((lecturer) =>
        lecturer.studentGroups.map((g) => g.groupCode)
      );

      if (studentGroupCodes.length === 0) return; // <-- prevent empty fetch

      const query = new URLSearchParams({
        schoolEmail: userData.schoolEmail,
        groupCodes: JSON.stringify(studentGroupCodes),
      });

      fetchData(
        `${
          import.meta.env.VITE_GET_LECTURER_GROUP_ASSIGNMENTS_SCORE_URI
        }?${query.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  }, [isAuthenticated, groupData]);

  useEffect(() => {
    if (fetchedData) {
      console.log(fetchedData);
    }

    if (errorMsg) {
      console.log(errorMsg);
    }
  }, [fetchedData, errorMsg]);

  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-auto lg:ml-[17%] lg:w-[83%] lg:pr-2 flex flex-col gap-4">
      <Header
        title="Report Analysis"
        icon1={<TbDeviceDesktopAnalytics />}
        icon2={<TbReport />}
      />

      <section className="mt-24 grid grid-cols-4 gap-4">
        <div className="border border-gray-200 p-4 rounded-md shadow-md lg:hover:shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-xs">Active Projects</p>
              <h1 className="font-Montserrat-Bold text-2xl">
                {createdAssignments.length}
              </h1>
            </div>
            <div className="bg-blue-100/50 p-2 text-2xl rounded-md">
              <LuFolderKanban className="text-[#2394db]" />
            </div>
          </div>
          <p className="text-xs text-gray-500">Ongoing group projects</p>
        </div>

        <div className="border border-gray-200 p-4 rounded-md shadow-md lg:hover:shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-xs">Total Students</p>
              <h1 className="font-Montserrat-Bold text-2xl">
                {totalStudentsAcrossAll}
              </h1>
            </div>
            <div className="bg-blue-100/50 p-2 text-2xl rounded-md">
              <RiGroupLine className="text-[#2394db]" />
            </div>
          </div>
          <p className="text-xs text-gray-500">Across all groups</p>
        </div>

        <div className="border border-gray-200 p-4 rounded-md shadow-md lg:hover:shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-xs">Participation Rate</p>
              <h1 className="font-Montserrat-Bold text-2xl">87%</h1>
            </div>
            <div className="bg-blue-100/50 p-2 text-2xl rounded-md">
              <LuTrendingUp className="text-[#2394db]" />
            </div>
          </div>
          <p className="text-xs text-gray-500">Active vs. inactive</p>
        </div>

        <div className="border border-gray-200 p-4 rounded-md shadow-md lg:hover:shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-xs">Submissions</p>
              <h1 className="font-Montserrat-Bold text-2xl">
                {submittedAssignments.length}/{createdAssignments.length}
              </h1>
            </div>
            <div className="bg-blue-100/50 p-2 text-2xl rounded-md">
              <LuFolderKanban className="text-[#2394db]" />
            </div>
          </div>
          <p className="text-xs text-gray-500">Projects submitted</p>
        </div>
      </section>

      <section className="">
        {isLoading ? (
          <div className="flex justify-center items-center max-[767px]:min-h-[40vh] md:min-h-[70vh]">
            <img
              className="w-20 h-20"
              src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1758788158/GroupBox/Loading_lhitxj.svg"
              alt="loading"
            />
          </div>
        ) : fetchedData?.results && fetchedData.results.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="bg-gray-100 p-4 rounded-md">
              <h1 className="mb-4 text-lg font-bold">
                Group Performance Comparison
              </h1>
              <BarChart
                xAxis={[
                  {
                    data: fetchedData.results.map((d) => d.groupName),
                  },
                ]}
                series={[
                  {
                    name: "Total Score",
                    data: fetchedData.results.map((d) => d.totalGroupScore),
                  },
                  {
                    name: "Total XP",
                    data: fetchedData.results.map((d) => d.totalXP),
                  },
                  {
                    name: "Overall Performance",
                    data: fetchedData.results.map((d) => d.overallPerformance),
                  },
                ]}
                height={300}
              />
            </div>
            <section className="grid grid-cols-3 gap-4">
              {fetchedData.results.map((data) => (
                <div
                  key={data._id}
                  className=" flex flex-col gap-4 border border-gray-200 shadow-md rounded-md p-4"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="font-bold">{data.groupName}</h1>
                    <div className="bg-green-600 text-white p-1 rounded-md">
                      <h1 className="text-xs">Excellent</h1>
                    </div>
                  </div>

                  <div className="text-gray-500">
                    <div className="flex justify-between items-center">
                      <h1 className="text-xs">Health Score</h1>
                      <h1 className="text-xs text-black font-Montserrat-Bold">
                        {data.totalGroupScore}%
                      </h1>
                    </div>
                  </div>

                  <ProgressBar value={data.totalGroupScore} />

                  <div className="flex justify-between items-center text-gray-500">
                    <div className="flex items-center gap-2">
                      <RiGroupLine />
                      <p className="text-xs">13 members</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <LuTrendingUp />
                      <p className="text-xs">82% balanced</p>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        ) : (
          <>
            <EmptyContent
              imageUri="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1764750095/GroupBox/undraw_data-reports_l2u3_nvcyis.svg"
              description="No Analytics to show now"
            />
          </>
        )}
      </section>
    </div>
  );
};

export default ReportAnalytics;
