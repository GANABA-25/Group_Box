import Badge from "@mui/material/Badge";
import { useContext } from "react";
import { NotificationContext } from "../../store/NotificationContext";

import { FaBell } from "react-icons/fa";

const NotificationBadge = () => {
  const { totalNotifications } = useContext(NotificationContext);
  return (
    <Badge badgeContent={totalNotifications} color="primary">
      <FaBell color="action" />
    </Badge>
  );
};

export default NotificationBadge;
