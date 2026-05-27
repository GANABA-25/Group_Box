import { createContext, useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { getUri } from "../../http";

export const AuthContext = createContext({
  userData: null,
  isAuthenticated: false,
  role: null,
  authenticate: (userData) => {},
  updateProfilePicture: (newUrl) => {},
  logout: () => {},
});

const AuthContextProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studentXpData, setStudentXpData] = useState(null);

  const { fetchedData, fetchData, errorMsg } = useFetch(getUri);

  useEffect(() => {
    try {
      const storedUserData = sessionStorage.getItem("userData");
      const storedToken = sessionStorage.getItem("token");
      if (storedUserData) setAuthData(JSON.parse(storedUserData));
      if (storedToken) setToken(storedToken);
    } catch (error) {
      console.error("Error loading auth data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token || !authData?.schoolEmail) return;

    const schoolEmail = authData.schoolEmail.trim();
    if (schoolEmail) {
      fetchData(
        `${import.meta.env.VITE_GET_STUDENT_XP_URI}?schoolEmail=${schoolEmail}`,
      );
    }
  }, [token, authData?.schoolEmail]);

  useEffect(() => {
    if (fetchedData) {
      setStudentXpData(fetchedData.studentXp || []);
    }

    if (errorMsg) {
      console.log("checking get error", errorMsg);
    }
  }, [fetchedData, errorMsg]);

  const authenticate = (userData) => {
    try {
      sessionStorage.setItem("userData", JSON.stringify(userData.user));
      setAuthData(userData.user);
      if (userData.token) {
        sessionStorage.setItem("token", userData.token);
        setToken(userData.token);
      }
    } catch (error) {
      console.error("Error saving auth token", error);
      throw error;
    }
  };

  const logout = () => {
    try {
      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("token");
      setAuthData(null);
      setToken(null);
    } catch (error) {
      console.error("Error removing auth token", error);
    }
  };

  const updateProfilePicture = (newUrl) => {
    setAuthData((prev) => {
      if (!prev) return prev;

      const updatedUser = { ...prev, profilePicture: newUrl };
      sessionStorage.setItem("userData", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const updateUserStats = (newStats) => {
    setAuthData((prev) => {
      if (!prev) return prev;
      const updatedUser = {
        ...prev,
        stats: { ...prev.stats, ...newStats },
      };
      sessionStorage.setItem("userData", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const value = {
    userData: authData,
    token,
    studentXpData,
    isAuthenticated: !!token,
    role: authData?.role || null,
    authenticate,
    updateProfilePicture,
    updateUserStats,
    logout,
  };

  if (isLoading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
