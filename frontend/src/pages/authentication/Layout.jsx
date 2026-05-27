import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import { navbarHiddenRoutes } from "../../config/navbarHiddenRoutes";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);

  const shouldShowNavbar =
    isAuthenticated && !navbarHiddenRoutes.includes(location.pathname);

  return (
    <>
      <ToastContainer autoClose={3000} />
      {shouldShowNavbar && <Navbar />}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
