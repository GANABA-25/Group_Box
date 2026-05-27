import { RiTeamFill } from "react-icons/ri";
import { LuCrown } from "react-icons/lu";

const GroupMembersCard = ({ contributions, groupName }) => {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <RiTeamFill />
        <h1 className=" font-Montserrat-Bold">{groupName}</h1>
      </div>

      <div className="grid max-[767px]:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contributions.map((contribution) => (
          <div
            key={contribution.user}
            className="border border-gray-200 p-4 flex items-center gap-2 rounded-md lg:hover:border-[#2394db] transition lg:hover:shadow-lg cursor-pointer"
          >
            <img
              className="w-7 h-7"
              src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1755801165/GroupBox/account_zthiqy.png"
              alt="Group Member"
            />
            <div className="max-[767px]:grid max-[767px]:gap-1 flex justify-between items-center gap-4">
              <div className="">
                <div className="flex items-center gap-2">
                  <h1 className="font-Montserrat-Bold text-xs lg:text-sm">
                    {contribution.userName}
                  </h1>
                  <div className="flex items-center gap-2 bg-amber-50 text-amber-500 p-1 rounded-full text-xs">
                    <LuCrown />
                    <h1>Leader</h1>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {contribution.userEmail}
                </p>
              </div>

              <div className="max-[767px]:flex max-[767px]:gap-1 gap-4 text-xs">
                <h1 className=" font-Montserrat-Bold">
                  {contribution.percentage} %
                </h1>
                <p className="text-gray-500">contribution</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupMembersCard;
