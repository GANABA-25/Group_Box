import { useContext } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../store/AuthContext";

const ProtectedRoutes = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useContext(AuthContext);
  const location = useLocation();

  return allowedRoles?.includes(role) ? (
    <Outlet />
  ) : isAuthenticated ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/landingPage" state={{ from: location }} replace />
  );
};

export default ProtectedRoutes;
