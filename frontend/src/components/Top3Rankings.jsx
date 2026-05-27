import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../store/AuthContext";
import { useFetch } from "../hooks/useFetch";
import { getUri } from "../../http";
import EmptyContent from "./EmptyContent";

import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";

const Top3Rankings = () => {
  const { isAuthenticated, userData, token } = useContext(AuthContext);
  const [leaderBoardData, setLeaderBoardData] = useState([]);

  const { isLoading, errorMsg, fetchedData, fetchData } = useFetch(getUri);

  useEffect(() => {
    if (isAuthenticated && userData?.schoolEmail) {
      fetchData(
        `${import.meta.env.VITE_GET_GROUPS_LEADERBOARD_URI}?schoolEmail=${
          userData.schoolEmail
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  }, [isAuthenticated, userData?.schoolEmail]);

  useEffect(() => {
    if (fetchedData) {
      setLeaderBoardData(fetchedData?.leaderboard || []);
    }
    if (errorMsg) {
      console.error("checking error", errorMsg);
    }
  }, [fetchedData, errorMsg]);

  const top3Groups = leaderBoardData.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[30vh] p-4 bg-gray-50 rounded-lg">
        <img
          className="w-12 h-12 animate-pulse"
          src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1758788158/GroupBox/Loading_lhitxj.svg"
          alt="loading"
        />
        <p className="mt-2 text-sm text-gray-600">Loading Leaderboard...</p>
      </div>
    );
  }

  // if (errorMsg) {
  //   return (
  //     <div className="text-center p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
  //       An error occurred: {errorMsg?.message}
  //     </div>
  //   );
  // }

  if (top3Groups?.length === 0) {
    return (
      <div className="flex justify-center items-center">
        <div className="flex flex-col gap-2">
          <img
            className="w-100"
            src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1764793016/GroupBox/undraw_pitching_y6kw_wxyic8.svg"
            alt=""
          />
          <p className="text-center">No groups found to display in the top 3</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-semibold text-center mb-4 text-gray-800 border-b pb-2">
        🏆 Top 3 Groups
      </h1>

      <section className="grid grid-cols-3 gap-2">
        {top3Groups.map((group, index) => {
          let rankStyles = {};
          let medalEmoji = "";

          if (index === 0) {
            rankStyles = {
              bg: "bg-amber-400 border-amber-500",
              text: "text-amber-900",
              shadow: "shadow-lg shadow-amber-200",
            };
            medalEmoji = "🥇";
          } else if (index === 1) {
            rankStyles = {
              bg: "bg-gray-300 border-gray-400",
              text: "text-gray-800",
              shadow: "shadow-md shadow-gray-200",
            };
            medalEmoji = "🥈";
          } else {
            rankStyles = {
              bg: "bg-orange-300 border-orange-400",
              text: "text-orange-900",
              shadow: "shadow-md shadow-orange-200",
            };
            medalEmoji = "🥉";
          }

          return (
            <div
              key={group?.groupCode || index}
              className={`flex flex-col items-center p-3 rounded-xl border ${rankStyles.bg} ${rankStyles.shadow} transition-all duration-300 transform hover:scale-[1.03]`}
            >
              <div
                className={`w-12 h-12 bg-white flex justify-center items-center mb-2 rounded-full border-2 border-white ring-2 ring-offset-1 ring-white ${rankStyles.bg}`}
              >
                <span className={`text-2xl font-extrabold ${rankStyles.text}`}>
                  {medalEmoji}
                </span>
              </div>

              <h2 className="text-sm font-semibold text-gray-900 mb-1 text-center truncate w-full">
                {group?.groupName}
              </h2>

              <p className="text-xs font-medium text-gray-700 mb-2 text-center">
                Rank **#{group?.rank || index + 1}**
              </p>

              <div className="w-full space-y-1 pt-2 border-t border-white/50">
                <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-1 rounded-md">
                  <span className="text-xs font-medium text-gray-600">XP</span>
                  <span className="text-sm font-bold text-green-700">
                    {group?.totalXP}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-1 rounded-md">
                  <span className="text-xs font-medium text-gray-600">
                    Mems
                  </span>
                  <span className="text-sm font-bold text-blue-700">
                    {group?.members?.length || 0}
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <AvatarGroup total={group.members?.length} max={3}>
                  {group.members?.slice(0, 3).map((member, i) => (
                    <Avatar
                      key={i}
                      alt={member.fullName}
                      src={member.profilePicture}
                      sx={{ width: 24, height: 24 }}
                    />
                  ))}
                </AvatarGroup>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Top3Rankings;
