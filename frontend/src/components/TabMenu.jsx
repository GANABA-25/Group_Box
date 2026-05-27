import React from "react";

const TabMenu = ({ tabs }) => {
  return (
    <div className="text-sm flex items-center gap-2">
      {tabs.map((tab, index) => (
        <h1
          key={index}
          className="text-blue-400 underline underline-offset-4 font-Montserrat-Bold lg:cursor-pointer"
        >
          {tab}
        </h1>
      ))}
    </div>
  );
};

export default TabMenu;
