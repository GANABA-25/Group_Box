import React from "react";

const XpCard = ({ icon, title, subtitle, value, color }) => {
  const bgColor = {
    green: "from-green-50 to-white border-green-200",
    blue: "from-blue-50 to-white border-blue-200",
    orange: "from-orange-50 to-white border-orange-200",
    yellow: "from-yellow-50 to-white border-yellow-200",
    purple: "from-purple-50 to-white border-purple-200",
  }[color];
  return (
    <div
      className={`flex gap-4 border rounded-xl p-5 bg-gradient-to-br ${bgColor} shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-inner">
        {icon}
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className="mt-2 bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs w-fit font-semibold">
          {value || 0} XP
        </div>
      </div>
    </div>
  );
};

export default XpCard;
