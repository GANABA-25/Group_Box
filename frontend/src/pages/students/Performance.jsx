import { useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import Header from "../../components/Header";

import { FaArrowTrendUp, FaRecordVinyl } from "react-icons/fa6";
import { FaChartBar, FaMedal, FaTrophy, FaClipboardList } from "react-icons/fa";
import { LuPercent } from "react-icons/lu";

const Performance = () => {
  const { studentXpData } = useContext(AuthContext);

  console.log(studentXpData);

  return (
    <div className="min-h-screen overflow-auto bg-gray-50 lg:ml-[17%] lg:w-[83%]">
      <Header
        title="Performance Dashboard"
        icon1={<FaChartBar />}
        icon2={<FaArrowTrendUp />}
      />

      <section className="px-2 max-[767px]:mt-26 flex flex-col lg:flex-row items-center gap-4 md:mt-34 lg:mt-24">
        <div className="flex items-center gap-4 border border-gray-200 bg-white p-4 rounded-md shadow-md">
          <img
            className="w-20 h-20 rounded-full border-4 border-white shadow"
            src={studentXpData?.student?.profilePicture}
            alt="Profile"
          />
          <div>
            <h1 className="text-xl font-Montserrat-Bold text-gray-800">
              {studentXpData?.student?.fullName}
            </h1>
            <p className="text-xs text-gray-500">
              {studentXpData?.student?.schoolEmail}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 rounded-md border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition">
            <div className="bg-blue-50 p-3 rounded-md text-blue-600">
              <FaTrophy className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {studentXpData?.totalXP?.toFixed(2)}
              </h1>
              <p className="text-xs text-gray-500">Total XP</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-md border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition">
            <div className="bg-blue-50 p-3 rounded-md text-blue-600">
              <FaRecordVinyl className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {studentXpData?.xpHistory.length}
              </h1>
              <p className="text-xs text-gray-500">Xp recorded</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-md border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition">
            <div className="bg-green-50 p-3 rounded-md text-green-600">
              <LuPercent className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {studentXpData?.level}
              </h1>
              <p className="text-xs text-gray-500">Level</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-md border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition">
            <div className="bg-yellow-50 p-3 rounded-md text-yellow-600">
              <FaClipboardList className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {studentXpData?.submissionHistory?.length || 0}
              </h1>
              <p className="text-xs text-gray-500">Submissions</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-md border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition">
            <div className="bg-purple-50 p-3 rounded-md text-purple-600">
              <FaMedal className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {studentXpData?.badges?.length || 0}
              </h1>
              <p className="text-xs text-gray-500">Badges</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-2 grid lg:grid-cols-2 gap-6 mt-4">
        <div className="border border-gray-200 bg-white rounded-md shadow-sm p-6">
          <h1 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
            Submission History
          </h1>

          {studentXpData?.submissionHistory?.length > 0 ? (
            studentXpData.submissionHistory.map((data, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 mb-3 bg-gray-50 rounded-md border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <div>
                  <h1 className="text-lg font-semibold text-gray-800">
                    {data.groupName}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {data.assignmentTitle}
                  </p>
                </div>
                <div className="flex flex-col items-end bg-blue-50 px-4 py-2 rounded-lg">
                  <p className="text-xs uppercase font-medium text-blue-600">
                    Score
                  </p>
                  <h1 className="text-2xl font-bold text-blue-700">
                    {data.student_score}
                  </h1>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 italic">
              No submission history available.
            </p>
          )}
        </div>

        <div className="border border-gray-200 bg-white rounded-md shadow-sm p-6">
          <h1 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
            Badge History
          </h1>

          {studentXpData?.xpHistory?.length > 0 ? (
            studentXpData.xpHistory.map((data, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 mb-3 bg-gray-50 rounded-md border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <div>
                  <h1 className="text-lg font-semibold text-gray-800">
                    {data.groupName}
                  </h1>
                  <p className="text-xs text-gray-500">{data.description}</p>
                </div>
                <div className="flex flex-col items-end bg-green-50 px-4 py-2 rounded-lg">
                  <p className="text-xs uppercase font-medium text-green-600">
                    XP Awarded
                  </p>
                  <h1 className="text-2xl font-bold text-green-700">
                    {data.xpAwarded}
                  </h1>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 italic">
              No XP history available.
            </p>
          )}
        </div>
      </section>

      <section className="px-2 mt-4">
        <div className="border border-gray-200 bg-white rounded-md shadow-sm p-2">
          <h1 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
            XP History (Detailed Breakdown)
          </h1>

          {studentXpData?.xpHistory?.length > 0 ? (
            studentXpData.xpHistory.map((data, index) => (
              <div
                key={index}
                className="p-4 mb-4 bg-gray-50 rounded-md border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h1 className="text-lg font-semibold text-gray-800">
                      {data.assignmentTitle}
                    </h1>
                    <p className="text-xs text-gray-500">
                      {data.description} ({data.groupName})
                    </p>
                  </div>
                  <div className="flex flex-col items-end bg-blue-50 px-4 py-2 rounded-lg">
                    <p className="text-xs uppercase font-medium text-blue-600">
                      Total XP
                    </p>
                    <h1 className="text-2xl font-bold text-blue-700">
                      {data.xpBreakdown?.totalXP || data.xpAwarded}
                    </h1>
                  </div>
                </div>

                {data.xpBreakdown && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                    {Object.entries(data.xpBreakdown).map(
                      ([key, value]) =>
                        key !== "totalXP" && (
                          <div
                            key={key}
                            className="flex justify-between bg-white border border-gray-100 p-2 rounded-lg text-xs"
                          >
                            <span className="capitalize text-gray-600">
                              {key.replace(/XP/g, " XP")}
                            </span>
                            <span className="font-medium text-gray-800">
                              +{value}
                            </span>
                          </div>
                        )
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 italic">
              No XP breakdown data available.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Performance;
