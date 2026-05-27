import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/AuthContext";

import Header from "../../components/Header";
import JoinGroupModal from "../../features/JoinGroup/JoinGroupModal";
import Card from "../../components/Card";
import MetricBox from "../../components/MetricBox";
// import PieChartComponent from "../../components/charts/PieChartComponent";
import PieChartComponent from "../../components/charts/PieChartComponent";
// import Example from "../../components/charts/BarChart";
import BarChartComp from "../../components/charts/BarChart";
import Top3Rankings from "../../components/Top3Rankings";

import UpcomingTasks from "../../components/UpcomingTasks";
import Feedback from "../../components/Feedback";

import Button_2 from "../../components/Button_2";

import { HiUserGroup } from "react-icons/hi2";
import { BsBell } from "react-icons/bs";
import { MdOutlineGroups3, MdLeaderboard } from "react-icons/md";
import { LuCrown, LuMedal } from "react-icons/lu";
import { GiTrophyCup, GiProgression } from "react-icons/gi";
import { CiClock2 } from "react-icons/ci";
import { MdOutlineLeaderboard } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { FaRegCircleCheck } from "react-icons/fa6";
import { TfiMedall } from "react-icons/tfi";
import { FaTasks } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";

const upcomingTasksData = [
  {
    id: 1,
    title: "ML Project Report",
    groupName: "Team Alpha",
    dueDay: "Due in 2 days",
    date: "Dec 8",
  },
  {
    id: 2,
    title: "Security Analysis",
    groupName: "Code Warriors",
    dueDay: "Due in 5 days",
    date: "Dec 11",
  },
  {
    id: 3,
    title: "Final Presentation",
    groupName: "Group Delta",
    dueDay: "Due in 1 week",
    date: "Dec 15",
  },
];

const FeedbackData = [
  {
    id: 1,
    message: "Excellent work on ML Project Report",
    lectureName: "Prof. Johnson",
    group: "Team Alpha",
    score: "4.8/5.0",
    time: "2 hours ago",
  },
  {
    id: 2,
    message: "Good collaboration in team meetings",
    lectureName: "Peer Review ",
    group: "Code Warriors",
    score: "4.5/5.0",
    time: "1 day ago",
  },
  {
    id: 3,
    message: "Consider improving documentation",
    lectureName: "TA Review",
    group: "Group Delta",
    score: "3.8/5.0",
    time: "2 days ago",
  },
];

const DashBoard = () => {
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const navigation = useNavigate();
  const { logout, userData, studentXpData } = useContext(AuthContext);

  const openJoinModalOpenHandler = () => setJoinModalOpen(true);
  const closeJoinModalOpenHandler = () => setJoinModalOpen(false);

  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-auto lg:ml-[17%] lg:w-[83%]">
      <div className="lg:hidden">
        <Header title="Student Dashboard" icon2={<MdDashboardCustomize />} />
      </div>
      <div className="lg:grid lg:gap-4 max-[767px]:mt-22 md:mt-30 lg:mt-0">
        <header className="flex max-[767px]:justify-center items-center gap-5 py-3 md:p-3 md:justify-between lg:shadow-sm lg:fixed lg:bg-white lg:w-[83%] lg:z-10">
          <div className="hidden lg:flex justify-between items-center max-[767px]:gap-2 md:items-center md:gap-3">
            <Button_2
              onClick={openJoinModalOpenHandler}
              icon={<HiUserGroup />}
              label="Join Group"
            />
            <Button_2 icon={<FaRegCircleCheck />} label="Submit Task" />
            <Button_2
              onClick={() => navigation("/leaderBoard")}
              icon={<MdLeaderboard />}
              label="LeaderBoard"
            />
          </div>

          <div className="hidden items-center gap-5 lg:flex">
            <BsBell className=" text-2xl" />
            <img
              src={userData.profilePicture}
              alt="student"
              className="w-10 h-10 rounded-full"
            />
            <div className="hidden lg:block">
              <Button_2 label="Logout" onClick={logout} />
            </div>
          </div>
        </header>
        <section className="grid gap-4 px-4 lg:mt-24 lg:pr-2 lg:px-0">
          <div className="grid max-[767px]:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricBox
              title="Total Groups"
              icon={<MdOutlineGroups3 />}
              totalGroups={userData.stats?.totalGroups}
              text="+2 from last week"
            />
            <MetricBox
              title="Task Completed"
              icon={<FaTasks />}
              totalGroups={userData.stats?.tasksCompleted}
              text="+2 from last week"
            />
            <MetricBox
              title="Average Score"
              icon={<TfiMedall />}
              totalGroups={userData.stats?.averageScore}
              text="+2 from last week"
            />
            <MetricBox
              title="Total XP Points"
              icon={<MdOutlineLeaderboard />}
              totalGroups={studentXpData?.totalXP.toFixed(2)}
              text="+2 from last week"
            />
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <BarChartComp />
            <div className="border border-gray-200 shadow-sm font-Montserrat-Regular p-4">
              <div className="flex justify-between">
                <h1>Full Rankings</h1>
                <h1 className="font-Montserrat-Bold text-green-600">Top 3</h1>
              </div>
              <Top3Rankings />
            </div>
          </div>
        </section>
        <section className="grid lg:grid-cols-3 gap-4 p-4 lg:p-0 lg:pr-2">
          <Card icon={<GiProgression />} title="Group status Distribution">
            <PieChartComponent />
          </Card>
          <Card icon={<CiClock2 />} title="Upcoming Tasks">
            {upcomingTasksData.map((data) => (
              <UpcomingTasks
                key={data.id}
                title={data.title}
                groupName={data.groupName}
                dueDay={data.dueDay}
                date={data.date}
              />
            ))}
          </Card>
          <Card icon={<VscFeedback />} title="Recent Feedback">
            <div className="grid gap-4">
              {FeedbackData.map((data) => (
                <Feedback
                  key={data.id}
                  message={data.message}
                  lectureName={data.lectureName}
                  group={data.group}
                  score={data.score}
                  time={data.time}
                />
              ))}
            </div>
          </Card>
        </section>

        <div className="flex justify-center items-center p-4 text-center">
          <h1>
            © 2025 GroupBox - Advanced Software Development. All rights
            reserved.
          </h1>
        </div>
        <JoinGroupModal
          open={joinModalOpen}
          onClose={closeJoinModalOpenHandler}
        />
      </div>
    </div>
  );
};

export default DashBoard;
