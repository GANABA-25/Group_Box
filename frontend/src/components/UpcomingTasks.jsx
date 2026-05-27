import React from "react";

const UpcomingTasks = ({ title, groupName, dueDay, date }) => {
  return (
    <div className="flex justify-between">
      <div>
        <h1 className="font-Montserrat-Bold">{title}</h1>
        <p className="text-xs text-gray-500"> {groupName}</p>
      </div>

      <div>
        <h1 className="text-red-600 text-sm"> {dueDay}</h1>
        <p className="text-xs text-end text-gray-500"> {date}</p>
      </div>
    </div>
  );
};

export default UpcomingTasks;
