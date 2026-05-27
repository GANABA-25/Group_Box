import React from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { LuCrown, LuMedal, LuTrophy } from "react-icons/lu";

const LeaderboardView = ({ data }) => {
  const groups = Array.isArray(data) ? data : [];

  const topThree = groups.slice(0, 3);
  const rest = groups.slice(3);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-8 order-last md:order-first">
        {topThree[1] && <PodiumCard group={topThree[1]} rank={2} />}

        {topThree[0] && <PodiumCard group={topThree[0]} rank={1} />}

        {topThree[2] && <PodiumCard group={topThree[2]} rank={3} />}
      </div>

      {rest.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-2 md:col-span-1 text-center">Rank</div>
            <div className="col-span-6 md:col-span-5">Group</div>
            <div className="hidden md:block col-span-3 text-center">
              Members
            </div>
            <div className="col-span-4 md:col-span-3 text-right pr-4">XP</div>
          </div>

          <div className="divide-y divide-gray-100">
            {rest.map((group, index) => (
              <ListRow
                key={group.groupCode || index}
                group={group}
                rank={index + 4}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PodiumCard = ({ group, rank }) => {
  const config = {
    1: {
      color: "text-yellow-500",
      bg: "bg-gradient-to-b from-yellow-50 to-white border-yellow-200",
      badge: "bg-yellow-100 text-yellow-700",
      height: "md:h-80",
      icon: <LuCrown className="w-8 h-8" />,
      shadow: "shadow-xl shadow-yellow-100/50",
    },
    2: {
      color: "text-slate-400",
      bg: "bg-gradient-to-b from-slate-50 to-white border-slate-200",
      badge: "bg-slate-100 text-slate-600",
      height: "md:h-72",
      icon: <LuMedal className="w-6 h-6" />,
      shadow: "shadow-lg",
    },
    3: {
      color: "text-orange-500",
      bg: "bg-gradient-to-b from-orange-50 to-white border-orange-200",
      badge: "bg-orange-100 text-orange-700",
      height: "md:h-64",
      icon: <LuTrophy className="w-6 h-6" />,
      shadow: "shadow-lg",
    },
  };

  const style = config[rank];

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-3xl border ${style.bg} ${style.height} ${style.shadow} transform transition hover:-translate-y-1 duration-300`}
    >
      <div
        className={`absolute top-4 right-4 ${style.badge} font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm`}
      >
        #{rank}
      </div>

      <div className={`mb-4 ${style.color}`}>{style.icon}</div>

      <div className="relative mb-4">
        <img
          src={
            group?.members?.[0]?.profilePicture ||
            "https://res.cloudinary.com/dmdnq9vh8/image/upload/v1755801165/GroupBox/account_zthiqy.png"
          }
          alt={group.groupName}
          className={`w-20 h-20 rounded-full object-cover border-4 border-white shadow-md`}
        />
        <div className={`absolute -bottom-2 inset-x-0 flex justify-center`}>
          <span
            className={`${style.badge} text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider`}
          >
            Rank {rank}
          </span>
        </div>
      </div>

      <h3 className="font-bold text-gray-800 text-lg text-center line-clamp-1 mb-1">
        {group.groupName}
      </h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-1 text-center px-2">
        {group.description || "No description"}
      </p>

      <div className="mt-auto w-full flex justify-between items-center bg-white/60 rounded-xl p-3 border border-gray-100">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 font-medium">XP</span>
          <span className="font-bold text-gray-800">{group.totalXP}</span>
        </div>
        <AvatarGroup
          max={3}
          sx={{ "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 10 } }}
        >
          {group.members?.map((m, i) => (
            <Avatar key={i} src={m.profilePicture} alt={m.fullName} />
          ))}
        </AvatarGroup>
      </div>
    </div>
  );
};

const ListRow = ({ group, rank }) => {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors duration-200">
      <div className="col-span-2 md:col-span-1 flex justify-center">
        <span className="font-mono font-bold text-gray-400">#{rank}</span>
      </div>

      <div className="col-span-6 md:col-span-5 flex items-center gap-3">
        <img
          src={
            group?.members?.[0]?.profilePicture ||
            "https://res.cloudinary.com/dmdnq9vh8/image/upload/v1755801165/GroupBox/account_zthiqy.png"
          }
          alt={group.groupName}
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 text-sm md:text-base line-clamp-1">
            {group.groupName}
          </span>
          <span className="text-xs text-gray-400 hidden md:block line-clamp-1">
            {group.description}
          </span>
        </div>
      </div>

      <div className="hidden md:block col-span-3">
        <div className="flex justify-center">
          <AvatarGroup
            max={4}
            sx={{
              "& .MuiAvatar-root": { width: 28, height: 28, fontSize: 12 },
            }}
          >
            {group.members?.map((m, i) => (
              <Avatar key={i} src={m.profilePicture} alt={m.fullName} />
            ))}
          </AvatarGroup>
        </div>
      </div>

      <div className="col-span-4 md:col-span-3 text-right pr-4">
        <span className="font-bold text-green-600">{group.totalXP}</span>
        <span className="text-xs text-gray-400 ml-1">XP</span>
      </div>
    </div>
  );
};

export default LeaderboardView;
