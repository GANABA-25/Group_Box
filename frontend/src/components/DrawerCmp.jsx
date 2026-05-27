// import { useState } from "react";
// import Box from "@mui/material/Box";
// import Drawer from "@mui/material/Drawer";

// import NavItem from "./navigation/NavItem";

// import { useContext } from "react";
// import { AuthContext } from "../store/AuthContext";

// import { BsBell } from "react-icons/bs";
// import { FaBars } from "react-icons/fa";
// import { BiSolidDashboard } from "react-icons/bi";
// import { FaUserGroup } from "react-icons/fa6";
// import { MdKeyboardArrowDown } from "react-icons/md";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import { MdNotificationsActive } from "react-icons/md";
// import { MdLeaderboard } from "react-icons/md";
// import { GrDocumentPerformance } from "react-icons/gr";
// import { IoSettingsOutline } from "react-icons/io5";
// import { IoPersonCircle } from "react-icons/io5";

// const DrawerCmp = () => {
//   const [open, setOpen] = useState(false);
//   const { role, userData, logout } = useContext(AuthContext);

//   const toggleDrawer = (newOpen) => () => {
//     setOpen(newOpen);
//   };

//   return (
//     <div className="lg:hidden">
//       <div className="bg-blue-500 p-4 flex justify-between items-center gap-5 fixed w-full z-10">
//         <div className="flex gap-4">
//           <FaBars
//             className="text-white text-3xl"
//             onClick={toggleDrawer(true)}
//           />
//           <div className="flex items-center gap-2 ">
//             <img
//               src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749588045/GroupBox/GroupBox_Logo_vi2zzr.png"
//               alt="GroupBox_Logo"
//               className="w-[2rem] h-[2rem] shadow-xl"
//             />
//             <h1 className="max-[767px]:text-sm font-Montserrat-ExtraBold text-black">
//               <span className="text-white">GroupBox</span> AIT
//             </h1>
//           </div>
//         </div>

//         <div className="flex gap-4">
//           <div className="flex items-center gap-5">
//             <BsBell className="text-white text-2xl" />
//             <img
//               src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1727979151/PORTFOLIO/original_picture_rq8bmg.jpg"
//               alt="student"
//               className="w-10 h-10 rounded-full"
//             />
//           </div>
//         </div>
//       </div>
//       <Drawer open={open} onClose={toggleDrawer(false)}>
//         <Box
//           sx={{
//             width: {
//               xs: 250,
//               sm: 400,
//             },
//           }}
//           role="presentation"
//           onClick={toggleDrawer(false)}
//           className="text-white h-full flex gap-3 flex-col"
//         >
//           <div className="flex items-center gap-2 pt-3 md:pt-4 px-3">
//             <img
//               src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749588045/GroupBox/GroupBox_Logo_vi2zzr.png"
//               alt="GroupBox_Logo"
//               className="w-[1rem] h-[1rem] md:w-[3rem] md:h-[3rem] shadow-xl"
//             />
//             <h1 className="max-[767px]:text-sm font-Montserrat-ExtraBold text-black md:text-2xl">
//               <span className="text-[#2394db]">GroupBox</span> AIT
//             </h1>
//           </div>

//           <div className="overflow-auto scrollbar-custom flex-1 bg-[#21262d]">
//             {userData.userName ? (
//               <div className="border-[0.1px] border-white/10 flex gap-4 justify-between items-center mx-3 my-4 p-2 rounded-xl">
//                 <div className="flex items-center gap-4">
//                   <img
//                     src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1727979151/PORTFOLIO/original_picture_rq8bmg.jpg"
//                     alt="student"
//                     className="w-10 h-10 md:w-15 md:h-15 rounded-full"
//                   />
//                   <div className="min-w-0 grid gap-1">
//                     <h1 className="text-xs md:text-sm font-Montserrat-Bold truncate">
//                       {userData.userName}
//                     </h1>
//                     <p className="text-[0.6rem] md:text-xs truncate uppercase">
//                       {userData.studentId}
//                     </p>
//                   </div>
//                 </div>
//                 <MdKeyboardArrowDown className="md:text-2xl" />
//               </div>
//             ) : (
//               <div className="flex justify-between">
//                 <IoPersonCircle className="text-blue-600 text-4xl" />
//                 <h1 className="text-center p-4">Welcome Guest</h1>
//               </div>
//             )}
//             <div className="p-3 md:p-4 border-t-[0.1px] border-white/10">
//               <ul className="grid gap-7 md:text-2xl md:gap-10">
//                 <NavItem to="/dashboard" icon={BiSolidDashboard} label="Home" />
//                 <NavItem to="/groups" icon={FaUserGroup} label="Groups" />

//                 {role === "student" && (
//                   <NavItem
//                     to="/calender"
//                     icon={FaRegCalendarAlt}
//                     label="Calender"
//                   />
//                 )}

//                 <NavItem
//                   to="/notifications"
//                   icon={MdNotificationsActive}
//                   label="Notifications"
//                 />

//                 <NavItem
//                   to="/leaderBoard"
//                   icon={MdLeaderboard}
//                   label="Leader Board"
//                 />

//                 {role === "student" && (
//                   <NavItem
//                     to="/performance"
//                     icon={GrDocumentPerformance}
//                     label="Performance"
//                   />
//                 )}

//                 <NavItem
//                   to="/settings"
//                   icon={IoSettingsOutline}
//                   label="Settings"
//                 />

//                 {role === "lecturer" && (
//                   <>
//                     <NavItem
//                       to="/reportAnalytics"
//                       icon={FaUserGroup}
//                       label="Report Analytics"
//                     />
//                     <NavItem
//                       to="/taskEvaluation"
//                       icon={FaUserGroup}
//                       label="Task Evaluation"
//                     />
//                   </>
//                 )}
//               </ul>
//             </div>
//           </div>
//         </Box>
//       </Drawer>
//     </div>
//   );
// };

// export default DrawerCmp;
