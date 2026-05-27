import AuthContextProvider from "./AuthContext";
import GroupContextProvider from "./GroupContext";
import NotificationContextProvider from "./NotificationContext";
import SocketProvider from "./SocketContext";

const AppContextProvider = ({ children }) => {
  return (
    <AuthContextProvider>
      <GroupContextProvider>
        <SocketProvider>
          <NotificationContextProvider>{children}</NotificationContextProvider>
        </SocketProvider>
      </GroupContextProvider>
    </AuthContextProvider>
  );
};

export default AppContextProvider;
