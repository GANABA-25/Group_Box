import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../store/AuthContext";
import { useFetch } from "../../../hooks/useFetch";
import { getUri } from "../../../../http";
import EmptyContent from "../../../components/EmptyContent";
import LeaderboardView from "../../../components/LeaderboardView";

const FullLeaderboard = () => {
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
      setLeaderBoardData(fetchedData.leaderboard || []);
    }
    if (errorMsg) {
      console.error(errorMsg);
    }
  }, [fetchedData, errorMsg]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <img
          className="w-20 h-20 animate-pulse"
          src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1758788158/GroupBox/Loading_lhitxj.svg"
          alt="loading"
        />
      </div>
    );
  }

  return (
    <div className="pr-2">
      {leaderBoardData.length === 0 ? (
        <EmptyContent
          imageUri="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1763058472/GroupBox/undraw_stand-out_9j2q_uzsvqz.svg"
          description="No Group Leaderboard to display at the moment."
        />
      ) : (
        <LeaderboardView data={leaderBoardData} />
      )}
    </div>
  );
};

export default FullLeaderboard;
