import React from "react";

const Feedback = ({ message, lectureName, group, score, time }) => {
  return (
    <div className="flex items-center gap-4 font-Montserrat-Regular">
      <div className="bg-green-600 w-[4px] h-full" />
      <div>
        <h1 className="text-green-600 font-Montserrat-Bold">{message}</h1>
        <p className="text-xs text-gray-500">
          {lectureName} • {group} • {score}
        </p>
        <p className="text-xs text-gray-500"> {time}</p>
      </div>
    </div>
  );
};

export default Feedback;
