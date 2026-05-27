import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { GroupContext } from "../../../store/GroupContext";
import { AuthContext } from "../../../store/AuthContext";

import { useFetch } from "../../../hooks/useFetch";
import { getUri } from "../../../../http";

import EmptyContent from "../../../components/EmptyContent";
import Button_2 from "../../../components/Button_2";

const GroupLeaderBoard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userData, token } = useContext(AuthContext);
  const { groupData } = useContext(GroupContext);
  const [joinedLecturerGroupIds, setJoinedLecturerGroupIds] = useState([]);

  useEffect(() => {
    if (groupData && groupData.length > 0) {
      const ids = groupData
        .map((group) => group.joinedLecturerGroup?._id)
        .filter(Boolean);
      setJoinedLecturerGroupIds(ids);
    }
  }, [groupData]);

  const { isLoading, errorMsg, fetchedData, fetchData } = useFetch(getUri);

  useEffect(() => {
    if (
      isAuthenticated &&
      userData?.schoolEmail &&
      joinedLecturerGroupIds.length > 0
    ) {
      console.log("checking ids", joinedLecturerGroupIds);

      const queryParams = new URLSearchParams();
      queryParams.append("schoolEmail", userData.schoolEmail);

      joinedLecturerGroupIds.forEach((id) => {
        queryParams.append("joinedLecturerGroupIds", id);
      });

      const url = `${
        import.meta.env.VITE_GET_STUDENT_GROUPS_LEADERBOARD_URI
      }?${queryParams.toString()}`;

      fetchData(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  }, [isAuthenticated, userData?.schoolEmail, joinedLecturerGroupIds]);

  useEffect(() => {
    if (fetchedData) {
      console.log("checking response", fetchedData);
    }

    if (errorMsg) {
      console.log(errorMsg);
    }
  }, [fetchedData, errorMsg]);

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center max-[767px]:min-h-[40vh] md:min-h-[70vh]">
          <img
            className="w-20 h-20"
            src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1758788158/GroupBox/Loading_lhitxj.svg"
            alt="loading"
          />
        </div>
      ) : (
        <>
          {!fetchedData?.leaderboard || fetchedData.leaderboard.length === 0 ? (
            <EmptyContent
              imageUri="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1763058472/GroupBox/undraw_stand-out_9j2q_uzsvqz.svg"
              description="No Group LeaderBoard to display moment. Once Group are added, they’ll show up here."
            />
          ) : (
            <div className="grid max-[767px]:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fetchedData?.leaderboard?.map((data) => (
                <div className="relative overflow-hidden rounded-md shadow-lg border border-gray-200 bg-white/70 backdrop-blur-sm">
                  <div className="relative h-44 w-full">
                    <img
                      src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1753885285/GroupBox/WhatsApp_Image_2025-07-30_at_14.14.24_672869ce_efjfas.jpg"
                      alt="leaderboard"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent rounded-t-2xl"></div>
                    <h1 className="absolute bottom-3 left-4 text-white text-lg font-semibold drop-shadow-md">
                      {data.lecturerGroupName}
                    </h1>

                    <div className="absolute bottom-3 right-3 text-white flex items-center gap-4">
                      <h1 className="">Groups</h1>
                      <div className="bg-[#2394db] rounded-full p-2 px-4">
                        <p className="text-sm font-Montserrat-Bold">
                          {data.joinedStudentGroups.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-3">
                    <p className="text-sm text-gray-600 leading-snug">
                      A collaborative class group striving for academic
                      excellence and recognition among peers. Join the race for
                      top performance and earn bragging rights for{" "}
                      <span className="font-bold text-[#2394db]">
                        {data.lecturerGroupName}
                      </span>
                      .
                    </p>

                    <Button_2
                      label="View Leaderboard"
                      onClick={() =>
                        navigate("/groupRankings", {
                          state: { payload: data },
                        })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GroupLeaderBoard;
