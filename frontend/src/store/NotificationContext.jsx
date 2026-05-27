import { createContext, useState, useEffect, useContext } from "react";
import { useFetch } from "../hooks/useFetch";
import { getUri } from "../../http";
import { AuthContext } from "./AuthContext";
import { GroupContext } from "./GroupContext";
import { useSocket } from "./SocketContext";
// import io from "socket.io-client";
// const socket = io("http://localhost:8080");
// HOSTING VERSION --------------------------
// const socket = io("https://groupbox-backend.onrender.com", {
//   transports: ["websocket"],
//   withCredentials: true,
// });

export const NotificationContext = createContext({
  notifications: [],
  groupNotifications: [],
  replyData: null,
  replyNotification: (data) => {},
  clearNotifications: () => {},
});

const NotificationContextProvider = ({ children }) => {
  const [userNotifications, setUserNotifications] = useState([]);
  const [groupNotifications, setGroupNotifications] = useState([]);
  const [totalNotifications, setTotalNotifications] = useState("");
  const [replyData, setReplyData] = useState(null);
  const { userData, isAuthenticated } = useContext(AuthContext);
  const { groupData } = useContext(GroupContext);

  const { fetchedData, fetchData, isLoading } = useFetch(getUri);

  const socket = useSocket();

  useEffect(() => {
    if (isAuthenticated) {
      fetchData(
        `${import.meta.env.VITE_GET_GROUP_NOTIFICATION_URI}?schoolEmail=${
          userData.schoolEmail
        }`,
      );
    }
  }, [isAuthenticated, userData]);

  useEffect(() => {
    if (fetchedData) {
      setGroupNotifications(fetchedData.groupNotifications);
      setTotalNotifications(fetchedData.totalNotifications);
    }
  }, [fetchedData]);

  //--------------------------- JOINING ALL USER GROUPS ---------------------------
  useEffect(() => {
    if (groupData && Array.isArray(groupData) && groupData.length > 0) {
      groupData.forEach((group) => {
        if (group.groupCode) {
          socket.emit("joinGroup", group.groupCode);
        }
      });
    }
  }, [groupData]);

  useEffect(() => {
    socket.on("GroupNotification", (data) => {
      setGroupNotifications((prev) => [...prev, data.notification]);
    });

    return () => {
      socket.off("GroupNotification");
    };
  }, []);

  useEffect(() => {
    socket.on("replyNotification", (data) => {
      setGroupNotifications((prev) => [...prev, data.notification]);
    });

    return () => {
      socket.off("replyNotification");
    };
  }, []);

  const setReplyDataHandler = (data) => {
    setReplyData(data);
  };

  const clearNotifications = () => {
    setUserNotifications([]);
    setGroupNotifications([]);
  };

  const value = {
    notifications: userNotifications,
    groupNotifications,
    totalNotifications,
    isLoading,
    replyData,
    setReplyData: setReplyDataHandler,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContextProvider;
