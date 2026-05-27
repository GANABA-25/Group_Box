import { useState, useContext, Fragment } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Link } from "react-router-dom";

import NavItem from "./navigation/NavItem";

import { AuthContext } from "../store/AuthContext";
import NotificationBadge from "./notification/NotificationBadge";

import { BsBell } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaBars } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { FaUserGroup } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdLeaderboard } from "react-icons/md";
import { GrDocumentPerformance } from "react-icons/gr";
import { IoPersonCircle } from "react-icons/io5";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";

const Header = ({ title, icon1, icon2 }) => {
  const [open, setOpen] = useState(false);
  const { role, userData, logout } = useContext(AuthContext);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    <>
      <header className="fixed top-0 w-full bg-white z-10 grid gap-2 md:gap-3 border-b-1 px-3 py-2 md:py-5 border-gray-300 shadow-sm lg:w-[83%]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <HiMiniBars3BottomLeft
              className="text-[#2394db] text-2xl lg:hidden"
              onClick={toggleDrawer(true)}
            />
            <div className="flex items-center gap-2">
              {icon1 && <div className="text-[#2394db] text-2xl">{icon1}</div>}
              <h1 className="max-[767px]:text-sm font-bold text-2xl">
                {title}
              </h1>
              {icon2 && <div className="text-green-500 text-2xl">{icon2}</div>}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#8dbfdd] p-1 px-2 text-white rounded-md lg:hover:bg-[#2394db] cursor-pointer transition-all duration-200 text-muted-foreground lg:hover:text-foreground lg:hover:scale-105">
              <NotificationBadge />
            </div>
            <img
              src={userData.profilePicture}
              alt="student"
              className="max-[767px]:hidden w-10 h-10 rounded-full transition-all duration-200 text-muted-foreground lg:hover:text-foreground lg:hover:scale-105"
            />
          </div>
        </div>
      </header>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: {
              xs: 250,
              sm: 400,
            },
          }}
          role="presentation"
          className="text-white h-full flex gap-3 flex-col"
        >
          <div className="flex items-center gap-2 pt-3 md:pt-4 px-3">
            <img
              src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749588045/GroupBox/GroupBox_Logo_vi2zzr.png"
              alt="GroupBox_Logo"
              className="w-[1rem] h-[1rem] md:w-[3rem] md:h-[3rem] shadow-xl"
            />
            <h1 className="max-[767px]:text-sm font-extrabold text-black md:text-2xl">
              <span className="text-[#2394db]">GroupBox</span> AIT
            </h1>
          </div>

          <div className="overflow-auto scrollbar-custom flex-1 bg-[#21262d]">
            {userData.userName ? (
              <div className="border-[0.1px] border-white/10 flex gap-4 justify-between items-center mx-3 my-4 p-2 rounded-xl">
                <div className="flex items-center gap-4">
                  <img
                    src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1727979151/PORTFOLIO/original_picture_rq8bmg.jpg"
                    alt="student"
                    className="w-10 h-10 md:w-15 md:h-15 rounded-full"
                  />
                  <div className="min-w-0 grid gap-1">
                    <h1 className="text-xs md:text-sm font-bold truncate">
                      {userData.userName}
                    </h1>
                    <p className="text-[0.6rem] md:text-xs truncate uppercase">
                      {userData.studentId}
                    </p>
                  </div>
                </div>
                <MdKeyboardArrowDown className="md:text-2xl" />
              </div>
            ) : (
              <div className="flex justify-between">
                <IoPersonCircle className="text-blue-600 text-4xl" />
                <h1 className="text-center p-4">Welcome Guest</h1>
              </div>
            )}
            <div className="p-3 md:p-4 border-t-[0.1px] border-white/10">
              <ul className="grid gap-4">
                <NavItem
                  to="/dashboard"
                  icon={BiSolidDashboard}
                  label="Home"
                  activePaths={["/dashboard"]}
                />

                {role === "student" && (
                  <NavItem
                    icon={FaUserGroup}
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
                    icon={FaUserGroup}
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
                    <NavItem
                      to="/taskEvaluation"
                      icon={FaUserGroup}
                      label="Task Evaluation"
                      activePaths={["/taskEvaluation"]}
                    />
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
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
