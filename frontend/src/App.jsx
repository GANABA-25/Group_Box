import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "./components/Loading";
import Layout from "./pages/authentication/Layout";
import ProtectedRoutes from "./pages/authentication/ProtectedRoutes";

const LandingPage = lazy(() => import("./pages/landingPage/LandingPage"));
const SignIn = lazy(() => import("./pages/authentication/SignIn"));
const SignUp = lazy(() => import("./pages/authentication/SignUp"));
const ResetPasswordEmailVerification = lazy(() =>
  import("./pages/authentication/ResetPasswordEmailVerification")
);
const ResetPasswordOTPVerification = lazy(() =>
  import("./pages/authentication/ResetPasswordOTPVerification")
);
const ResetPassword = lazy(() =>
  import("./pages/authentication/ResetPassword")
);

//------------------------------ SHARED PAGES ------------------------------
const Dashboard = lazy(() => import("./pages/shared/DashBoard"));
const Groups = lazy(() => import("./pages/shared/Groups"));
const LeaderBoard = lazy(() => import("./pages/shared/LeaderBoard"));
const GroupRankings = lazy(() => import("./pages/shared/GroupRankings"));
const Notifications = lazy(() => import("./pages/shared/Notifications"));
const Settings = lazy(() => import("./pages/shared/Settings"));
const Assignments = lazy(() => import("./pages/shared/Assignments"));

//------------------------------ Student-specific Pages ------------------------------
const GroupWorkSpace = lazy(() => import("./pages/students/GroupWorkSpace"));
const Calender = lazy(() => import("./pages/students/Calender"));
const Performance = lazy(() => import("./pages/students/Performance"));
const MarkedAssignments = lazy(() =>
  import("./pages/students/MarkedAssignments")
);
const MarkedAssignmentsDetails = lazy(() =>
  import("./pages/students/MarkedAssignmentsDetails")
);

//------------------------------ Lecturer-specific Pages ------------------------------
const ReportAnalytics = lazy(() => import("./pages/lectures/ReportAnalytics"));
const TaskEvaluation = lazy(() => import("./pages/lectures/TaskEvaluation"));
const LecturerWorkingSpace = lazy(() =>
  import("./pages/lectures/LecturerWorkingSpace")
);
const ViewAssignmentText = lazy(() =>
  import("./pages/lectures/ViewAssignmentText")
);
const CreatedAssignments = lazy(() =>
  import("./pages/lectures/CreatedAssignments")
);
const SubmittedAssignments = lazy(() =>
  import("./pages/lectures/SubmittedAssignments")
);
const SendNotification = lazy(() =>
  import("./pages/lectures/SendNotification")
);

const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/landingPage" />} />
            <Route path="landingPage" element={<LandingPage />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route
              path="reset-password/email"
              element={<ResetPasswordEmailVerification />}
            />
            <Route
              path="reset-password/otp"
              element={<ResetPasswordOTPVerification />}
            />
            <Route path="reset-password/new" element={<ResetPassword />} />

            <Route element={<ProtectedRoutes allowedRoles={["student"]} />}>
              <Route path="groupWorkSpace" element={<GroupWorkSpace />} />
              <Route path="calender" element={<Calender />} />
              <Route path="performance" element={<Performance />} />
              <Route path="markedAssignments" element={<MarkedAssignments />} />
              <Route
                path="markedAssignmentsDetails"
                element={<MarkedAssignmentsDetails />}
              />
            </Route>

            <Route
              element={
                <ProtectedRoutes allowedRoles={["student", "lecturer"]} />
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="groups" element={<Groups />} />
              <Route path="leaderBoard" element={<LeaderBoard />} />
              <Route path="groupRankings" element={<GroupRankings />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
              <Route path="reportAnalytics" element={<ReportAnalytics />} />
              <Route path="taskEvaluation" element={<TaskEvaluation />} />
              <Route path="Assignments" element={<Assignments />} />
            </Route>

            <Route element={<ProtectedRoutes allowedRoles={["lecturer"]} />}>
              <Route
                path="lecturerWorkingSpace"
                element={<LecturerWorkingSpace />}
              />
              <Route path="reportAnalytics" element={<ReportAnalytics />} />
              <Route path="taskEvaluation" element={<TaskEvaluation />} />
              <Route
                path="ViewAssignmentText"
                element={<ViewAssignmentText />}
              />
              <Route
                path="CreatedAssignments"
                element={<CreatedAssignments />}
              />
              <Route
                path="SubmittedAssignments"
                element={<SubmittedAssignments />}
              />
              <Route path="sendNotification" element={<SendNotification />} />
            </Route>

            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
