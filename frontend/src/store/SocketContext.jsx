import { createContext, useContext } from "react";
import io from "socket.io-client";

// const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8080", {
//   transports: ["websocket"], // optional but more stable
// });

const socket = io(
  import.meta.env.VITE_SOCKET_URL || "https://groupbox-backend.onrender.com",
  {
    transports: ["websocket"], // optional but more stable
  },
);

const SocketContext = createContext(socket);

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
