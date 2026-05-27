import { Fragment, useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import NavItem from "./NavItem";
import { Link } from "react-router-dom";

import NotificationBadge from "../notification/NotificationBadge";

import { BiSolidDashboard } from "react-icons/bi";
import { FaUserGroup } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdLeaderboard } from "react-icons/md";
import { GrDocumentPerformance } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import { IoPersonCircle } from "react-icons/io5";
import { SiGoogledocs } from "react-icons/si";

const Navbar = () => {
  const { role, userData } = useContext(AuthContext);

  return (
    <Fragment>
      <nav className="font-Montserrat-Regular hidden lg:block h-screen fixed top-0 left-0 p-2 text-white">
        <div className="h-full flex gap-3 flex-col">
          <div className="flex items-center gap-2 p-3">
            <img
              src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749588045/GroupBox/GroupBox_Logo_vi2zzr.png"
              alt="GroupBox_Logo"
              className="w-[2rem] h-[2rem] shadow-xl"
            />
            <h1 className="max-[767px]:text-lg font-Montserrat-ExtraBold text-black">
              <span className="text-[#2394db]">GroupBox</span> AIT
            </h1>
          </div>

          <div className="overflow-auto scrollbar-custom flex-1 rounded-xl bg-[#21262d]">
            {userData.userName ? (
              <div className="border-[0.1px] border-white/10 flex gap-4 justify-center items-center mx-3 my-4 p-2 rounded-xl">
                <img
                  src={userData.profilePicture}
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
                <div className="min-w-0 grid gap-1">
                  <h1 className="text-xs font-Montserrat-Bold truncate">
                    {userData.userName}
                  </h1>
                  <p className="text-[0.6rem] truncate uppercase">
                    {userData.studentId}
                  </p>
                </div>
                <MdKeyboardArrowDown />
              </div>
            ) : (
              <div className="flex justify-between">
                <IoPersonCircle className="text-blue-600 text-4xl" />
                <h1 className="text-center p-4">Welcome Guest</h1>
              </div>
            )}
            <div className="p-3 border-t-[0.1px] border-white/10">
              <ul className="grid gap-4">
                <NavItem
                  to="/dashboard"
                  icon={BiSolidDashboard}
                  label="Home"
                  activePaths={["/dashboard"]}
                />

                {role === "student" && (
                  <NavItem
                    icon={SiGoogledocs}
                    to="/assignments"
                    label="Assignments"
                    activePaths={["/assignments", "/markedAssignments"]}
                  >
                    <Link to="/markedAssignments" className="block px-4 py-2 ">
                      Marked Assign
                    </Link>
                  </NavItem>
                )}

                {role === "lecturer" && (
                  <NavItem
                    icon={SiGoogledocs}
                    to="/assignments"
                    label="Assignments"
                    activePaths={[
                      "/assignments",
                      "/CreatedAssignments",
                      "/SubmittedAssignments",
                    ]}
                  >
                    <Link to="/CreatedAssignments" className="block px-4 py-2 ">
                      Created Assign
                    </Link>
                    <Link
                      to="/SubmittedAssignments"
                      className="block px-4 py-2"
                    >
                      Submitted Assign
                    </Link>
                  </NavItem>
                )}
                <NavItem
                  to="/groups"
                  icon={FaUserGroup}
                  label="Groups"
                  activePaths={[
                    "/groups",
                    "/groupWorkSpace",
                    "/lecturerWorkingSpace",
                  ]}
                />

                {role === "lecturer" && (
                  <NavItem
                    icon={NotificationBadge}
                    to="/notifications"
                    label="Notifications"
                    activePaths={["/notifications", "/sendNotification"]}
                  >
                    <Link to="/sendNotification" className="block px-4 py-2 ">
                      Send Notification
                    </Link>
                  </NavItem>
                )}
                {role === "student" && (
                  <NavItem
                    to="/notifications"
                    icon={NotificationBadge}
                    label="Notifications"
                    activePaths={["/notifications"]}
                  />
                )}
                <NavItem
                  to="/leaderBoard"
                  icon={MdLeaderboard}
                  label="Leader Board"
                  activePaths={["/leaderBoard", "/groupLeaderBoard"]}
                />
                {role === "student" && (
                  <NavItem
                    to="/performance"
                    icon={GrDocumentPerformance}
                    label="Performance"
                    activePaths={["/performance"]}
                  />
                )}
                {role === "lecturer" && (
                  <>
                    <NavItem
                      to="/reportAnalytics"
                      icon={FaUserGroup}
                      label="Report Analytics"
                      activePaths={["/reportAnalytics"]}
                    />
                    {/* <NavItem
                      to="/taskEvaluation"
                      icon={FaUserGroup}
                      label="Task Evaluation"
                      activePaths={["/taskEvaluation"]}
                    /> */}
                  </>
                )}
                <NavItem
                  to="/settings"
                  icon={IoSettingsOutline}
                  label="Settings"
                  activePaths={["/settings"]}
                />
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </Fragment>
  );
};

export default Navbar;
