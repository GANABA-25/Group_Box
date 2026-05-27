import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import SearchInput from "../../components/SearchInput";
import { CiSearch } from "react-icons/ci";
import { BsPatchCheckFill } from "react-icons/bs";
import { LuCrown, LuMedal } from "react-icons/lu";
import { GiTrophyCup } from "react-icons/gi";

const GroupLeaderBoard = () => {
  const location = useLocation();
  const { payload } = location.state || {};

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <LuCrown className="text-yellow-500 text-2xl" />;
      case 2:
        return <GiTrophyCup className="text-gray-400 text-2xl" />;
      case 3:
        return <LuMedal className="text-orange-400 text-2xl" />;
      default:
        return null;
    }
  };

  const topThreeGroups = payload?.joinedStudentGroups
    ?.sort((a, b) => a.rank - b.rank)
    ?.slice(0, 3);

  const otherGroups = payload?.joinedStudentGroups
    ?.sort((a, b) => a.rank - b.rank)
    ?.slice(3);

  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-auto lg:ml-[17%] lg:w-[83%] font-Montserrat-Regular">
      <Header title="Groups" icon1={<LuCrown />} icon2={<LuMedal />} />
      <section className="grid gap-4 lg:pt-20 mt-4 lg:pr-2">
        <div className="flex items-center gap-3 border border-gray-200 p-4 rounded-md shadow-md">
          <BsPatchCheckFill className="text-[#2394db] text-2xl" />
          <div className="flex flex-col gap-1">
            <h1 className="text-sm text-gray-500">Your group Ranking</h1>
            <h1 className="max-[767px]:text-sm text-xl font-Montserrat-Bold">
              Ranked{" "}
              <span className="text-[#2394db]">
                #{payload?.userGroupRank || 6}
              </span>{" "}
              in this Leaderboard
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topThreeGroups?.map((group) => (
            <div
              key={group.groupCode}
              className="flex flex-col gap-4 bg-white border border-gray-100 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    src={
                      group.image ||
                      "https://res.cloudinary.com/dmdnq9vh8/image/upload/v1755801165/GroupBox/account_zthiqy.png"
                    }
                    alt="Group"
                  />
                  <h1 className="font-semibold text-gray-900 text-lg">
                    {group.groupName}
                  </h1>
                </div>

                <div className="flex items-center justify-center bg-yellow-100 p-2 rounded-full">
                  {getRankIcon(group.rank)}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <span className="text-sm font-medium text-gray-500">Rank</span>
                <div className="mt-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold text-center rounded-full px-3 py-1 w-fit shadow-sm">
                  #{group.rank}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center border-t border-gray-100 pt-4">
                <div>
                  <h2 className="text-sm font-medium text-gray-500">
                    Group Members
                  </h2>
                  <p className="text-lg font-semibold text-gray-800">
                    {group.memberCount || 0}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">
                    XP Points
                  </h2>
                  <p className="text-lg font-semibold text-gray-800">
                    {group.totalXP}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="overflow-auto max-h-[32rem] border border-gray-200 rounded-lg">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-gray-100 z-10 text-left font-Montserrat-Bold">
                <tr className="max-[767px]:text-sm">
                  <th className="py-2 px-2 border-y border-x border-gray-200">
                    Rank
                  </th>
                  <th className="py-2 px-2 border-y border-x border-gray-200">
                    Group Name
                  </th>
                  <th className="py-2 px-2 border-y border-x border-gray-200">
                    Members
                  </th>
                  <th className="py-2 px-2 border-y border-x border-gray-200">
                    XP Points
                  </th>
                </tr>
              </thead>

              <tbody>
                {otherGroups?.map((group) => (
                  <tr
                    key={group.groupCode}
                    className="hover:bg-gray-50 max-[767px]:text-xs"
                  >
                    <td className="py-2 px-2 border-y border-x border-gray-100 font-Montserrat-Bold flex items-center gap-2">
                      {getRankIcon(group.rank)}
                      {group.rank}
                    </td>
                    <td className="py-2 px-2 border-y border-x border-gray-100">
                      {group.groupName}
                    </td>
                    <td className="py-2 px-2 border-y border-x border-gray-100">
                      {group.membersCount || 0}
                    </td>
                    <td className="py-2 px-2 border-y border-x border-gray-100">
                      {group.totalXP} points
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GroupLeaderBoard;
