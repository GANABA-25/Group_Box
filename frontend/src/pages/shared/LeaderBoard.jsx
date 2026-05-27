import { useState } from "react";
import Header from "../../components/Header";
import Button_2 from "../../components/Button_2";
import GroupLeaderBoard from "./leaderBoard/GroupLeaderBoard";
import FullLeaderboard from "./leaderBoard/FullLeaderboard";

import { TiGroup } from "react-icons/ti";
import { FaRankingStar } from "react-icons/fa6";
import { GiPodiumWinner } from "react-icons/gi";
import { MdOutlineLeaderboard } from "react-icons/md";

const LeaderBoard = () => {
  const [showGroups, setShowGroups] = useState(true);

  const groupHandler = () => {
    setShowGroups(true);
  };

  const fullRankingsHandler = () => {
    setShowGroups(false);
  };

  return (
    <div className="min-h-screen overflow-auto font-Montserrat-Regular lg:ml-[17%] lg:w-[83%]">
      <Header
        title="Leaderboard"
        icon1={<MdOutlineLeaderboard />}
        icon2={<GiPodiumWinner />}
      />

      <section className="max-[767px]:px-3 max-[767px]:mt-28 grid gap-4 md:px-4 md:mt-36 lg:px-0 lg:mr-2 lg:mt-24">
        <div className="flex gap-3">
          <Button_2 label="Groups" icon={<TiGroup />} onClick={groupHandler} />
          <Button_2
            label="Full Rankings"
            icon={<FaRankingStar />}
            onClick={fullRankingsHandler}
          />
        </div>

        {showGroups ? <GroupLeaderBoard /> : <FullLeaderboard />}
      </section>
    </div>
  );
};

export default LeaderBoard;
